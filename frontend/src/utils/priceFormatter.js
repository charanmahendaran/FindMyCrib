export function formatPrice(value) {
  if (!value) return "";

  const num = Number(value);

  if (num >= 10000000) {
    return (num / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
  }

  if (num >= 100000) {
    return (num / 100000).toFixed(0) + " L";
  }

  return num.toString();
}