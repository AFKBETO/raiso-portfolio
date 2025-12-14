export default function parsePrice(price: number): string {
  const locale = useNuxtLocale();
  let format = 'fr-FR';
  if (locale.value === 'en') {
    format = 'en-US';
  }

  return new Intl.NumberFormat(format, {
    style: 'currency',
    currency: 'EUR',
  }).format(price / 100);
}
