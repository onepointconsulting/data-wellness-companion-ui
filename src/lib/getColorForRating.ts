export const getColorForRating = (rating: number): string => {
  if (rating >= 0.8) return "#4CAF50"; // Outstanding
  if (rating >= 0.6) return "#8BC34A"; // High
  if (rating >= 0.4) return "#FFEB3B"; // Medium
  if (rating >= 0.2) return "#e9ff00eb"; // Mediocre
  return "#F44336"; // Low
};
