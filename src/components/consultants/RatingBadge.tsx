import { useTranslation } from "react-i18next";
import { ConsultantRating } from "../../model/consultantRating";

export default function RatingBadge({ rating }: { rating: ConsultantRating }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row gap-2 items-center text-xl">
      <span
        title={t("Rating")}
        className="text-xs md:text-sm font-semibold uppercase py-0.5 px-2 bg-white/50 dark:bg-black/20 rounded-md"
      >
        {rating.rating}
      </span>
    </div>
  );
}
