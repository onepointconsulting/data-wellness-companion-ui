import {createContext, useRef, useState} from "react";
import {Props} from "./commonModel.ts";
import {Socket} from "socket.io-client";

const DEFAULT_WEBSOCKET_URL = "ws://127.0.0.1:5000";

export const KEY_CHAT_TYPE = "chatType";

export enum ChatType {
  DIVERGING = "diverging",
  TO_THE_POINT = "to_the_point",
}

export function toChatType(value: string): ChatType {
  const validChatTypes = Object.values(ChatType) as string[];
  return validChatTypes.includes(value)
    ? (value as ChatType)
    : ChatType.DIVERGING;
}

interface ConfigState {
  websocketUrl: string;
  reportUrl: string;
  socket: React.MutableRefObject<Socket | null>;
  chatType: ChatType;
  setChatType: (chatType: ChatType) => void;
}

declare global {
  interface Window {
    dataWellnessConfig: any;
  }
}

export const ChatContext = createContext<ConfigState>({
  websocketUrl: "ws://localhost:8080",
  reportUrl: "http://localhost:8080",
  socket: { current: null },
  chatType: ChatType.DIVERGING,
  setChatType: (_) => {},
});

export function readChatTYpeFromLS(): ChatType {
  const savedChatType = window.localStorage.getItem(KEY_CHAT_TYPE);
  if (!!savedChatType) {
    return toChatType(savedChatType);
  }
  return ChatType.DIVERGING;
}

export const ConfigContextProvider = ({ children }: Props) => {
  const { dataWellnessConfig } = window;
  const { websocketUrl, reportUrl } =
    dataWellnessConfig || DEFAULT_WEBSOCKET_URL;
  const socket: React.MutableRefObject<Socket | null> = useRef<Socket | null>(
    null,
  );
  const [chatType, setChatType] = useState<ChatType>(readChatTYpeFromLS());

  return (
    <ChatContext.Provider
      value={{ websocketUrl, reportUrl, socket, chatType, setChatType }}
    >
      {children}
    </ChatContext.Provider>
  );
};
