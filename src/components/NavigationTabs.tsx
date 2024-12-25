import { ReactNode, useContext, useEffect } from "react";
import { useNavigationTabStore } from "../context/NavigationTabStore.tsx";
import { useShallow } from "zustand/react/shallow";
import { AppContext } from "../context/AppContext.tsx";
import { useTranslation } from "react-i18next";

const tabs = ["Questions", "Final Report"];

export default function NavigationTab({ children }: { children: ReactNode }) {
  const [t] = useTranslation();
  const { messages, currentMessage, setCurrentMessage, isReport } =
    useContext(AppContext);
  const { visible, activeTab, setVisible, setActiveTab } =
    useNavigationTabStore(useShallow((state) => ({ ...state })));

  useEffect(() => {
    const messagesLength = messages?.length;
    if (messagesLength) {
      const finalMessageIndex = messagesLength - 1;
      setVisible(isReport);
      if (currentMessage === finalMessageIndex) {
        setActiveTab(tabs.length - 1);
      }
    }
  }, [messages, currentMessage]);

  function onSetActiveTab(index: number) {
    setActiveTab(index);
    const messagesLength = messages?.length;
    setCurrentMessage(messagesLength - 2 + index);
  }

  return (
    <>
      {visible && (
        <ul className="tab-main">
          {tabs.map((tab, i) => (
            <li
              key={`navtab_${i}`}
              className={`tab-item-${activeTab !== i ? "in" : ""}active`}
              onClick={() => onSetActiveTab(i)}
            >
              {t(tab)}
            </li>
          ))}
        </ul>
      )}
      <div>{children}</div>
    </>
  );
}
