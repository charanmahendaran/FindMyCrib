export const formatCurrency = (val) => {
  if (val === null || val === undefined || val === "") return "";

  let num;

  // If already a number
  if (typeof val === "number") {
    num = val;
  } else {
    const v = val.toString().toLowerCase().replace(/,/g, "").trim();

    if (v.includes("cr")) {
      num = parseFloat(v) * 10000000;
    } else if (v.includes("l")) {
      num = parseFloat(v) * 100000;
    } else {
      // remove ₹ or any non-digit except dot
      const clean = v.replace(/[^\d.]/g, "");
      num = parseFloat(clean);
    }
  }

  if (isNaN(num)) return val; // fallback (VERY important)

  return "₹ " + num.toLocaleString("en-IN");
};