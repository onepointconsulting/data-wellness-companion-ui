import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext.tsx";
import { getSession } from "../lib/sessionFunctions.ts";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { ConsultantRating } from "../model/consultantRating.ts";
import { AppContext } from "../context/AppContext.tsx";

export function useSuggestConsultant() {
  const { t } = useTranslation();
  const { reportUrl } = useContext(ChatContext);
  const { messages } = useContext(AppContext);
  const { setOntologyOpen } = useAppStore(
    useShallow((state) => ({ ...state })),
  );
  const {
    showConsultantRatings,
    setShowConsultantRatings,
    consultantRatings,
    setUpdatingSuggestedConsultants,
    setSuggestedConsultantsError,
    setConsultantRatings,
  } = useAppStore(useShallow((state) => ({ ...state })));

  useEffect(() => {
    setConsultantRatings([]);
  }, [messages]);

  function fetchSuggestedConsultants(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const session = getSession();
    if (consultantRatings.length) {
      setShowConsultantRatings(!showConsultantRatings);
      return;
    }
    if (session) {
      setOntologyOpen(false);
      setUpdatingSuggestedConsultants(true);
      setSuggestedConsultantsError("");
      setConsultantRatings([]);
      fetch(`${reportUrl}/consultant/ratings/${session.id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setSuggestedConsultantsError(
              t("Failed to fetch suitable consultants."),
            );
            return null;
          }
        })
        .then((json) => {
          if (json) {
            const consultantRatings = json["consultant_ratings"] as
              | ConsultantRating[]
              | undefined;
            if (consultantRatings) {
              setConsultantRatings(consultantRatings);
            } else {
              setSuggestedConsultantsError(
                t("Failed to fetch suitable consultants."),
              );
            }
          }
        })
        .catch((e) => {
          setSuggestedConsultantsError(
            t("Failed to fetch suitable consultants."),
          );
          console.error("Failed to retrieve suitable consultants.", e);
        })
        .finally(() => {
          setUpdatingSuggestedConsultants(false);
        });
    }
  }

  return { fetchSuggestedConsultants };
}
