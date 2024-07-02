import MenuSelectorBase from "./MenuSelectorBase.tsx";
import { getSessionHistory } from "../../lib/sessionFunctions.ts";
import { GoHistory } from "react-icons/go";
import { Session } from "../../model/session.ts";
import {ChangeEvent, useContext, useEffect} from "react";
import { AppContext } from "../../context/AppContext.tsx";
import {useTranslation} from "react-i18next";
import {ChatContext} from "../../context/ChatContext.tsx";
import {getSessionId, switchSession} from "../../lib/websocketFunctions.ts";
import { decodeTime } from 'ulid'

const finishedFilter = (session: Session) => session.finished;

const isUlid = (session: Session) => {
  try {
    decodeTime(session.id)
    return true
  } catch (e) {
    return false
  }
}

function timestampAdapter(session: Session) {
  const id = session.id;
  return new Date(decodeTime(id)).toISOString().replace('T', ' ').replace(/:\d{2}\.\d{3}Z/, '');
}

function adaptSessionHistory(sessionHistory: Session[]): Session[] {
  const uniques: Session[] = Object.values(sessionHistory.reduce((acc, session) => ({...acc, ...{[session.id]: session}}), {}))

  return uniques
    .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
    .filter(finishedFilter)
    .filter(isUlid);
}

/**
 * Used to switch between sessions.
 * @constructor
 */
export default function SessionSwitch() {
  const { socket } = useContext(ChatContext);
  const { selectedHistoricalSession, setSelectedHistoricalSession, setOntologyOpen } = useContext(AppContext);
  const { t } = useTranslation();
  const sessionHistory = getSessionHistory();

  useEffect(() => {
    if(!!selectedHistoricalSession) {
      if(getSessionId() !== selectedHistoricalSession) {
        switchSession(socket.current, selectedHistoricalSession);
        setOntologyOpen(false);
      }
    }
  }, [selectedHistoricalSession])

  function onChange (e: ChangeEvent<HTMLSelectElement>) {
    if(!!e.target.value) {
      const session = sessionHistory.find((session) => session.id === e.target.value)
      if(!!session) {
        setSelectedHistoricalSession(session.id)
      }
    } else {
      setSelectedHistoricalSession(null)
    }
  }

  if (!sessionHistory || sessionHistory.filter(finishedFilter).length === 0) {
    return <></>;
  }
  return (
    <MenuSelectorBase
      image={<GoHistory />}
      select={
        <select
          className="menu-select"
          value={selectedHistoricalSession || ""}
          onChange={onChange}
        >
          <option value={''}>{t("No session")}</option>
          {adaptSessionHistory(sessionHistory)
            .map((session, i) => {
              return (
                <option key={`session_switch_${i}`} value={session.id}>
                  {timestampAdapter(session)}
                </option>
              );
            })}
        </select>
      }
    />
  );
}
