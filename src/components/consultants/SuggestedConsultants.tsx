import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import Spinner from "../Spinner.tsx";
import { useTranslation } from "react-i18next";
import Alert from "../form/Alert.tsx";
import ConsultantCard from "./ConsultantCard.tsx";
import { Rating } from "../../model/consultantRating.ts";

const CONSULTANT_LIMIT = 5;
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
      <section className="text-3xl py-6">
        {t("consultants-explanation")}
      </section>
      <section
        id="consultants-main"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full"
      >
        {consultantRatings
          .filter((rating) => Rating.UNSUITABLE !== rating.rating)
          .slice(0, CONSULTANT_LIMIT)
          .map((rating, i) => (
            <ConsultantCard key={`consultant-${i}`} rating={rating} />
          ))}
      </section>
    </div>
  );
}
