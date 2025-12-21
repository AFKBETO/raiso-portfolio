export default function (...args: unknown[]): void {
  const { environment } = useRuntimeConfig().public;

  if (environment !== 'prod') {
    console.log(...args);
  }
}
