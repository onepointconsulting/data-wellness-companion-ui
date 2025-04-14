export enum Rating {
  VERY_SUITABLE = "very suitable",
  SUITABLE = "suitable",
  MODERATELY_SUITABLE = "moderately suitable",
  HARDLY_SUITABLE = "hardly suitable",
  UNSUITABLE = "unsuitable",
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
