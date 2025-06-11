export const useNuxtLocale = () => useState<string>('locale', () => useDefaultLocale().value);
export const useDefaultLocale = (fallback = 'fr') => {
  const locale = ref(fallback);
  if (import.meta.client) {
    const navLang = navigator.language;
    if (navLang) {
      locale.value = navLang;
    }
  }
  return locale;
};
