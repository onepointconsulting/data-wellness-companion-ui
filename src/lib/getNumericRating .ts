export const getNumericRating = (rating: string): number => {
  const ratingMap: { [key: string]: number } = {
    outstanding: 1,
    high: 0.8,
    medium: 0.6,
    mediocre: 0.4,
    low: 0.2,
  };
  return ratingMap[rating.toLowerCase()] ?? 0;
};
