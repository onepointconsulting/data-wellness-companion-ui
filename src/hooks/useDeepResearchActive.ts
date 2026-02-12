import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { fetchDeepResearchActive } from "../lib/apiCalls.ts";

export default function useDeepResearchActive() {
  const { reportUrl } = useContext(ChatContext);
  const { setDeepResearchActive } = useAppStore(
    useShallow((state) => ({
      setDeepResearchActive: state.setDeepResearchActive,
    })),
  );

  useEffect(() => {
    if (reportUrl) {
      fetchDeepResearchActive(reportUrl)
        .then((active) => {
          setDeepResearchActive(active);
        })
        .catch((error) => {
          console.error("Error fetching deep research active status: ", error);
          // Default to false on error
          setDeepResearchActive(false);
        });
    }
  }, [reportUrl, setDeepResearchActive]);
}
