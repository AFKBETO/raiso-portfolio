<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { type CodeSchema, codeSchema, type LoginSchema, loginSchema } from '~/types/login';

type LoginState = 'email' | 'code';

const loginState = ref<LoginState>('email');
const locale = useNuxtLocale();

const emailState = reactive<Partial<LoginSchema>>({
  email: undefined,
});

const codeState = reactive<Partial<CodeSchema>>({
  code: undefined,
});

const { maxSessionAge } = useRuntimeConfig().public;

const { query } = useRoute();
const redirect = query.redirect ? query.redirect.toString() : '';

const timeLeft = ref(60);

const { data: loginLabels } = await useAsyncData('login', async () => {
  const login = await queryCollection('login')
    .where('language', '=', locale.value)
    .first();
  if (login) {
    return login;
  }
  return queryCollection('login')
    .where('language', '=', 'fr')
    .first();
}, {
  watch: [locale],
});

definePageMeta({
  colorMode: 'light',
});

function getCodeDescription(codeDescription: string | undefined): string {
  if (!codeDescription) {
    return '';
  }
  return codeDescription.replace('<email-address>', emailState.email ?? '').replace('<code-duration>', String(maxSessionAge / 60));
}

function runCountdown() {
  timeLeft.value = 60;
  const countdown = setInterval(() => {
    if (timeLeft.value <= 0) {
      clearInterval(countdown);
    }
    timeLeft.value = timeLeft.value - 1;
  }, 1000);
}

async function onSubmitEmail(event: FormSubmitEvent<LoginSchema>) {
  await $fetch('/api/login', {
    method: 'POST',
    body: event.data,
  });
  loginState.value = 'code';
  runCountdown();
}

async function onSubmitCode(event: FormSubmitEvent<CodeSchema>) {
  console.log('code submitted', event.data);
  await $fetch('/api/authenticate', {
    method: 'POST',
    body: { ...event.data, ...emailState },
  });
  await navigateTo(redirect);
}
</script>

<template>
  <div>
    <UForm
      v-if="loginState === 'email'"
      :schema="loginSchema"
      :state="emailState"
      class="m-auto w-1/3"
      @submit="onSubmitEmail"
    >
      <UCard
        variant="outline"
      >
        <template #header>
          <p class="text-center">
            {{ loginLabels?.login }}
          </p>
        </template>

        <UFormField
          name="email"
          label="Email"
          :help="loginLabels?.emailHelp"
          required
        >
          <UInput
            v-model="emailState.email"
            :placeholder="loginLabels?.emailPlaceholder"
          >
            <template
              v-if="emailState.email?.length"
              #trailing
            >
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="emailState.email = ''"
              />
            </template>
          </UInput>
        </UFormField>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="primary"
              type="submit"
            >
              {{ loginLabels?.submit }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UForm>
    <UForm
      v-if="loginState === 'code'"
      :schema="codeSchema"
      :state="codeState"
      class="m-auto w-1/3"
      @submit="onSubmitCode"
    >
      <UCard
        variant="outline"
      >
        <template #header>
          <p class="text-center">
            {{ loginLabels?.code }}
          </p>
        </template>

        {{ getCodeDescription(loginLabels?.codeDescription) }}
        <UFormField
          name="code"
          label="Code"
          required
        >
          <UInput
            v-model="codeState.code"
          />
        </UFormField>
        <div v-if="timeLeft > 0">
          {{ `${loginLabels?.codeCooldown} ${timeLeft} ${loginLabels?.second}` }}
        </div>
        <UButton
          v-else
          color="primary"
          @click="runCountdown"
        >
          Resend code
        </UButton>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="primary"
              type="submit"
            >
              {{ loginLabels?.submit }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </div>
</template>
