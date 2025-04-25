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
    <div key={`rating_${i}`} className="mt-4 md:mt-8 p-4 border border-[#a6a6a6] flex gap-3 flex-col">
      <div className="w-full">
        <img
          src={
            rating.linkedin_photo_400 ??
            rating.linkedin_photo_200 ??
            "res_ai_logo_square.avif"
          }
          className="w-full grayscale hover:grayscale-0 transition duration-300 ease-in-out"
        />
      </div>
      <div className="flex flex-wrap border-b-2 py-2 justify-between">
        <h3 className="!text-[1.5rem]">{rating.analyst_name}</h3>
        <a
            href={rating.analyst_linkedin_url}
            target="_blank"
            className="underline"
        >
          <svg height="39" viewBox="0 0 176 176" width="39" xmlns="http://www.w3.org/2000/svg" id="fi_3536505"><g id="Layer_2" data-name="Layer 2"><g id="linkedin"><rect id="background" fill="#0077b5" height="176" rx="24" width="176"></rect><g id="icon" fill="#fff"><path d="m63.4 48a15 15 0 1 1 -15-15 15 15 0 0 1 15 15z"></path><path d="m60 73v66.27a3.71 3.71 0 0 1 -3.71 3.73h-15.81a3.71 3.71 0 0 1 -3.72-3.72v-66.28a3.72 3.72 0 0 1 3.72-3.72h15.81a3.72 3.72 0 0 1 3.71 3.72z"></path><path d="m142.64 107.5v32.08a3.41 3.41 0 0 1 -3.42 3.42h-17a3.41 3.41 0 0 1 -3.42-3.42v-31.09c0-4.64 1.36-20.32-12.13-20.32-10.45 0-12.58 10.73-13 15.55v35.86a3.42 3.42 0 0 1 -3.37 3.42h-16.42a3.41 3.41 0 0 1 -3.41-3.42v-66.87a3.41 3.41 0 0 1 3.41-3.42h16.42a3.42 3.42 0 0 1 3.42 3.42v5.78c3.88-5.82 9.63-10.31 21.9-10.31 27.18 0 27.02 25.38 27.02 39.32z"></path></g></g></g></svg>
        </a>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap w-full">
          <div className="w-full md:w-[20%] font-bold">{t("Rating")}</div>
          <div className="w-full md:w-[80%] capitalize">{rating.rating}</div>
        </div>
        {/* <div className="w-full font-bold">{t("LinkedIN")}</div>
        <div className="w-full">
          <a
            href={rating.analyst_linkedin_url}
            target="_blank"
            className="underline"
          >
            {rating.analyst_linkedin_url}
          </a>
        </div> */}
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
