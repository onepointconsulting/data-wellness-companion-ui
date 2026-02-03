import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSessionHistory } from "../../lib/sessionFunctions";
import { ChatContext } from "../../context/ChatContext";
import { AppContext } from "../../context/AppContext";
import { useAppStore } from "../../context/AppStore";
import { useShallow } from "zustand/react/shallow";
import { getSessionId, switchSession } from "../../lib/websocketFunctions";
import { IoClose } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import HistoryEntry from "./HistoryEntry";
import { fetchSessionsCompleted } from "../../lib/apiCalls";

export default function HistorySidebar() {
  const { t } = useTranslation();
  const { socket, reportUrl } = useContext(ChatContext);
  const { selectedHistoricalSession, setSelectedHistoricalSession } =
    useContext(AppContext);
  const {
    setOntologyOpen,
    historySidebarOpen,
    setHistorySidebarOpen,
    sessionsCompleted,
    setSessionsCompleted,
    loadingHistoricalSessions,
    setLoadingHistoricalSessions,
  } = useAppStore(
    useShallow((state) => ({
      setOntologyOpen: state.setOntologyOpen,
      historySidebarOpen: state.historySidebarOpen,
      setHistorySidebarOpen: state.setHistorySidebarOpen,
      sessionsCompleted: state.sessionsCompleted,
      setSessionsCompleted: state.setSessionsCompleted,
      loadingHistoricalSessions: state.loadingHistoricalSessions,
      setLoadingHistoricalSessions: state.setLoadingHistoricalSessions,
    })),
  );

  useEffect(() => {
    if (historySidebarOpen) {
      setLoadingHistoricalSessions(true);
      fetchSessionsCompleted(
        getSessionHistory().map((session) => session.id),
        reportUrl,
      )
        .then((sessionsCompleted) => {
          setSessionsCompleted(sessionsCompleted);
        })
        .catch((error) => {
          console.error("Error fetching sessions completed: ", error);
        })
        .finally(() => {
          setLoadingHistoricalSessions(false);
        });
    }
  }, [
    historySidebarOpen,
    reportUrl,
    setSessionsCompleted,
    setLoadingHistoricalSessions,
  ]);

  const handleSessionClick = (sessionId: string) => {
    if (getSessionId() !== sessionId) {
      setSelectedHistoricalSession(sessionId);
      switchSession(socket.current, sessionId);
      setOntologyOpen(false);
    }
    if (window.innerWidth < 1024) {
      setHistorySidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {historySidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setHistorySidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          historySidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-row items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <MdHistory className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {t("History")}
              </h2>
            </div>
            <button
              onClick={() => setHistorySidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <IoClose className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sessionsCompleted.sessions.length === 0 ||
            loadingHistoricalSessions ? (
              <p className="text-gray-500 text-center mt-10">
                {t("No history available")}
              </p>
            ) : (
              sessionsCompleted.sessions.map((session) => {
                const isSelected =
                  selectedHistoricalSession === session.session_id;
                return (
                  <HistoryEntry
                    key={session.session_id}
                    session={session}
                    isSelected={isSelected}
                    onClick={handleSessionClick}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
