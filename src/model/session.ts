import { Socket } from "socket.io-client";
import { ChatType } from "../context/ChatContext.tsx";

export type Session = {
  id: string;
  timestamp: Date;
  finished?: boolean;
  language: string;
  topic?: string;
};

export type StartSession = {
  socket: Socket<any, any> | null;
  expectedInteviewSteps: number | null;
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void;
  apiServer: string;
  chatType: ChatType;
};

export type SessionCompletedDataList = {
  sessions: SessionCompletedData[];
};

export type SessionCompletedData = {
  session_id: string;
  created_at: Date;
  start_answer: string;
  end_advice: string;
};
