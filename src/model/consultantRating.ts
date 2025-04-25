export enum Rating {
  VERY_SUITABLE = "Very suitable",
  SUITABLE = "Suitable",
  MODERATELY_SUITABLE = "Moderately suitable",
  HARDLY_SUITABLE = "Hardly suitable",
  UNSUITABLE = "Unsuitable",
}

export type ConsultantRating = {
  analyst_name: string;
  analyst_linkedin_url: string;
  reasoning: string;
  rating: Rating;
  score: number;
  linkedin_photo_200: string | null;
  linkedin_photo_400: string | null;
};
