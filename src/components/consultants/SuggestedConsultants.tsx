import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import Spinner from "../Spinner.tsx";
import { useTranslation } from "react-i18next";
import Alert from "../form/Alert.tsx";
import MarkdownComponent from "../Markdown.tsx";
import { ConsultantRating, Rating } from "../../model/consultantRating.ts";

const CONSULTANT_LIMIT = 5;

function ConsultantCard({
  i,
  rating,
}: {
  i: number;
  rating: ConsultantRating;
}) {
  const { t } = useTranslation();
  return (
    <div key={`rating_${i}`} className="mt-4 md:mt-8">
      <div className="w-full">
        <img
          src={
            rating.linkedin_photo_400 ??
            rating.linkedin_photo_200 ??
            "hypergility_logo_square.avif"
          }
          className="w-full grayscale hover:grayscale-0 transition duration-300 ease-in-out"
        />
      </div>
      <h3 className="border-b-2 !text-[1.5rem] pb-2">{rating.analyst_name}</h3>
      <div className="flex flex-wrap">
        <div className="w-full md:w-[20%] font-bold">{t("Rating")}</div>
        <div className="w-full md:w-[80%]">{rating.rating}</div>
        <div className="w-full font-bold">{t("LinkedIN")}</div>
        <div className="w-full">
          <a
            href={rating.analyst_linkedin_url}
            target="_blank"
            className="underline"
          >
            {rating.analyst_linkedin_url}
          </a>
        </div>
        <MarkdownComponent content={rating.reasoning} className="w-full" />
      </div>
    </div>
  );
}

export default function SuggestedConsultants() {
  const { t } = useTranslation();
  const {
    showConsultantRatings,
    consultantRatings,
    updatingSuggestedConsultants,
    suggestedConsultantsError,
    setSuggestedConsultantsError,
  } = useAppStore(useShallow((state) => ({ ...state })));
  if (updatingSuggestedConsultants) {
    return (
      <>
        <Spinner />
        <div className="final-report-message mt-10 mb-2">
          {t("Finding suitable consultants")}
        </div>
      </>
    );
  }
  if (suggestedConsultantsError) {
    return (
      <Alert
        feedback={suggestedConsultantsError}
        onClose={() => setSuggestedConsultantsError("")}
      />
    );
  }
  return (
    <div
      className={`consultants-section ${showConsultantRatings ? "open" : "closed"}`}
    >
      <section>{t("consultants-explanation")}</section>
      <section
        id="consultants-main"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {consultantRatings
          .filter((rating) => Rating.UNSUITABLE !== rating.rating)
          .slice(0, CONSULTANT_LIMIT)
          .map((rating, i) => {
            return (
              <ConsultantCard key={`consultant-${i}`} i={i} rating={rating} />
            );
          })}
      </section>
    </div>
  );
}
