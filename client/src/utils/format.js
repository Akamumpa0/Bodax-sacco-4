export function money(value) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function shortDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-UG', { dateStyle: 'medium' }).format(new Date(value));
}
