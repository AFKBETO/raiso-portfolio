export default function formatString(str: string, ...values: unknown[]) {
  return str.replace(/{(\d+)}/g, function (match, index) {
    return typeof values[index] !== 'undefined' ? String(values[index]) : match;
  });
}
