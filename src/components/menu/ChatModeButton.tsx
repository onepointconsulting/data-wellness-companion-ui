import { ChangeEvent, useContext } from "react";
import {
  ChatContext,
  ChatType,
  KEY_CHAT_TYPE,
  toChatType,
} from "../../context/ChatContext.tsx";
import MenuSelectorBase from "./MenuSelectorBase.tsx";
import { useTranslation } from "react-i18next";
import useSessionRestart from "../../hooks/useSessionRestart.ts";
import Dialog from "../buttons/Dialog.tsx";
import { HamburgerMenuContext } from "../../context/HamburgerMenuContext.tsx";

export default function ChatModeButton() {
  const { t } = useTranslation();
  const { setOpen } = useContext(HamburgerMenuContext);
  const { chatType, setChatType } = useContext(ChatContext);
  const { restartFunction } = useSessionRestart({
    func: (e) => {
      const value = e.target.value;
      const chatType = toChatType(value);
      window.localStorage.setItem(KEY_CHAT_TYPE, chatType);
      setChatType(chatType);
      setOpen(false);
    },
  });
  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    restartFunction(e);
  }
  return (
    <MenuSelectorBase
      image={<Dialog />}
      select={
        <select
          className="menu-select"
          value={chatType ?? ""}
          onChange={onChange}
        >
          <option value={""}>{t("Chat type")}</option>
          <option value={ChatType.DIVERGING}>{t("Diverging")}</option>
          <option value={ChatType.TO_THE_POINT}>{t("To the point")}</option>
        </select>
      }
    />
  );
}
