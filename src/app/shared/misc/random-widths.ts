export function generateRandomWidths(count = 5) {
  const widths: number[] = [];

  for (let i = 0; i < count; i++) {
    widths[i] = Math.floor(Math.random() * 120) + 120;
  }

  return widths;
}
