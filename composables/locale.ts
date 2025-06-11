export const useNuxtLocale = () => {
  const locale = useCookie('locale', {
    default: () => 'fr',
  });
  return locale;
};
