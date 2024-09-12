import { Socket } from "socket.io-client";

export type Session = {
  id: string;
  timestamp: Date;
  finished?: boolean;
  language: string;
};

export type StartSession = {
  socket: Socket<any, any> | null;
  expectedInteviewSteps: number | null;
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void;
  apiServer: string;
};
