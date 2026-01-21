import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { getSessionHistory } from "../../lib/sessionFunctions";
import { Session } from "../../model/session";
import { decodeTime } from "ulid";
import { ChatContext } from "../../context/ChatContext";
import { AppContext } from "../../context/AppContext";
import { useAppStore } from "../../context/AppStore";
import { useShallow } from "zustand/react/shallow";
import { getSessionId, switchSession } from "../../lib/websocketFunctions";
import { IoClose } from "react-icons/io5";
import { MdHistory } from "react-icons/md";

const finishedFilter = (session: Session) => session.finished;

const isUlid = (session: Session) => {
  try {
    decodeTime(session.id);
    return true;
  } catch (e) {
    return false;
  }
};

function timestampAdapter(session: Session) {
  const id = session.id;
  const dateStr = new Date(decodeTime(id))
    .toISOString()
    .replace("T", " ")
    .replace(/:\d{2}\.\d{3}Z/, "");
  return dateStr;
}

function adaptSessionHistory(sessionHistory: Session[]): Session[] {
  const uniques: Session[] = Object.values(
    sessionHistory.reduce(
      (acc, session) => ({ ...acc, ...{ [session.id]: session } }),
      {},
    ),
  );

  return uniques
    .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
    .filter(finishedFilter)
    .filter(isUlid);
}

export default function HistorySidebar() {
  const { t } = useTranslation();
  const { socket } = useContext(ChatContext);
  const { selectedHistoricalSession, setSelectedHistoricalSession } =
    useContext(AppContext);
  const { setOntologyOpen, historySidebarOpen, setHistorySidebarOpen } =
    useAppStore(
      useShallow((state) => ({
        setOntologyOpen: state.setOntologyOpen,
        historySidebarOpen: state.historySidebarOpen,
        setHistorySidebarOpen: state.setHistorySidebarOpen,
      })),
    );

  const sessionHistory = getSessionHistory();
  const adaptedHistory = adaptSessionHistory(sessionHistory);

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
            {adaptedHistory.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                {t("No history available")}
              </p>
            ) : (
              adaptedHistory.map((session) => {
                const isSelected = selectedHistoricalSession === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session.id)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 
                        ${
                          isSelected
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 shadow-sm ring-1 ring-blue-300"
                            : "bg-gray-50 border-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 hover:shadow-sm"
                        }
                      `}
                  >
                    <div className="text-xs text-gray-400 mb-1">
                      {timestampAdapter(session)}
                    </div>
                    <div
                      className={`text-sm font-medium ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}`}
                    >
                      {session.topic || t("New Session")}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
