import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import {scrollBottom} from "../lib/scrollFunctions.ts";

export default function useOntology() {
  const { ontologyOpen, setOntologyOpen } = useAppStore(
    useShallow((state) => ({ ...state })),
  );
  const {
    setUpdatingSuggestedConsultants,
    setSuggestedConsultantsError,
    setConsultantRatings,
  } = useAppStore(useShallow((state) => ({ ...state })));

  function toggleOntologyView() {
    setOntologyOpen(!ontologyOpen);
    setTimeout(() => scrollBottom(), 1000);
  }

  function onOntologyOpenClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // Close consultants area
    setUpdatingSuggestedConsultants(false);
    setSuggestedConsultantsError("");
    setConsultantRatings([]);
    toggleOntologyView();
  }
  return { onOntologyOpenClick };
}
