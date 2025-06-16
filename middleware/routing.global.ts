export default defineNuxtRouteMiddleware((to, _from) => {
  if (to.path === '/home') {
    // setting the redirect code to '301 Moved Permanently'
    return navigateTo('/', { redirectCode: 301 });
  }
});
