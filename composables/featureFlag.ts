export const useFeatureFlag = (flagName: string): boolean => {
  const config = useRuntimeConfig().public;
  const { environment } = config;

  if (environment !== 'prod') {
    return true;
  }

  const flag = config[flagName];

  return flag === 'true';
};
