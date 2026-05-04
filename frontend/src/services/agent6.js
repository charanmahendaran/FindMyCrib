export const getCTA = (intent) => {
  switch (intent) {
    case "evaluating":
      return "Compare Now";
    case "serious_buyer":
      return "Check Finance";
    case "ready_to_visit":
      return "Book Visit";
    default:
      return "Explore";
  }
};