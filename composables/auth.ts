export const useAuth = () => {
  const { maxSessionAge } = useRuntimeConfig().public;
  const auth = useCookie('auth', {
    default: (): string | null => null,
    maxAge: maxSessionAge,
    sameSite: true,
  });
  return auth;
};
