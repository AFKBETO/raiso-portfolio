export const useAuth = () => {
  const { maxSessionAge } = useRuntimeConfig().public;
  const auth = useCookie('auth', {
    default: () => '',
    maxAge: maxSessionAge,
    sameSite: true,
  });
  return auth;
};
