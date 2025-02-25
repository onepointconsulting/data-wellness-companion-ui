import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import Spinner from "../Spinner.tsx";
import { useTranslation } from "react-i18next";
import Alert from "../form/Alert.tsx";
import MarkdownComponent from "../Markdown.tsx";

const CONSULTANT_LIMIT = 5;

export default function SuggestedConsultants() {
  const { t } = useTranslation();
  const {
    consultantRatings,
    updatingSuggestedConsultants,
    suggestedConsultantsError,
    setSuggestedConsultantsError,
  } = useAppStore(useShallow((state) => ({ ...state })));
  if (updatingSuggestedConsultants) {
    return <Spinner />;
  }
  if (suggestedConsultantsError) {
    return (
      <Alert
        feedback={suggestedConsultantsError}
        onClose={() => setSuggestedConsultantsError("")}
      />
    );
  }
  if (!consultantRatings || consultantRatings.length === 0) {
    return null;
  }
  return (
    <>
      <section>{t("consultants-explanation")}</section>
      <section id="consultants-main">
        {consultantRatings.slice(0, CONSULTANT_LIMIT).map((rating, i) => {
          return (
            <div key={`rating_${i}`} className="mt-4 md:mt-8">
              <h3 className="border-b-2 !text-[1.5rem] pb-2">
                {rating.analyst_name}
              </h3>
              <div className="flex flex-wrap">
                <div className="w-full md:w-[20%] font-bold">{t("Rating")}</div>
                <div className="w-full md:w-[80%]">{rating.rating}</div>
                <div className="w-full md:w-[20%] font-bold">
                  {t("LinkedIN")}
                </div>
                <div className="w-full md:w-[80%]">
                  <a
                    href={rating.analyst_linkedin_url}
                    target="_blank"
                    className="underline"
                  >
                    {rating.analyst_linkedin_url}
                  </a>
                </div>
                <div className="w-full md:w-[20%] font-bold">
                  {t("Reasoning")}
                </div>
                <MarkdownComponent
                  content={rating.reasoning}
                  className="w-full md:w-[80%]"
                />
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
