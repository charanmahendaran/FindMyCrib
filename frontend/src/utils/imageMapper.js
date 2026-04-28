import apt2 from "../assets/properties/apartment/2bhk.jpg";
import apt3 from "../assets/properties/apartment/3bhk.jpg";
import apt4 from "../assets/properties/apartment/4bhk.jpg";
import villa1 from "../assets/properties/villa/villa1.jpg";
import villa2 from "../assets/properties/villa/villa2.jpg";
import plot1 from "../assets/properties/plot/plot1.jpg";
import fallback from "../assets/properties/fallback.jpg";

export function getPropertyImage(property, index = 0) {
  const text = (property.name || "").toLowerCase();
  const bhk = Number(property.bhk);

  // 🏡 Villa
  if (property.type === "villa" || text.includes("villa")) {
    return index % 2 === 0 ? villa1 : villa2;
  }

  // 🌱 Plot
  if (property.type === "plot" || text.includes("plot") || text.includes("land")) {
    return plot1;
  }

  // 🏢 Apartment
  if (bhk === 2) return apt2;
  if (bhk === 3) return apt3;
  if (bhk >= 4) return apt4;

  // 🔁 Smart fallback (not random fallback image)
  return apt3;
}