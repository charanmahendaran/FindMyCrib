export const formatCurrency = (val) => {
  if (val === null || val === undefined || val === "") return "";

  const num = Number(val);
  if (isNaN(num)) return val;

  return "₹ " + num.toLocaleString("en-IN");
};