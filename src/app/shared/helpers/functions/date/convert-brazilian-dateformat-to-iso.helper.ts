export function convertBrazilianDateFormatToIso(originalDate: string) {
  const parts = originalDate.split('/');

  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null;

  return `${year}-${month}-${day}`;
}
