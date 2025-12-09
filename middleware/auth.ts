export default defineNuxtRouteMiddleware((to, _from) => {
  const auth = useAuth();

  if (!auth || auth.value === '') {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
