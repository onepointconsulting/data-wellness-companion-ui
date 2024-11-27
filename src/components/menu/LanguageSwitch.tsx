import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";
import MenuSelectorBase from "./MenuSelectorBase.tsx";
import World from "../buttons/World.tsx";
import useSessionRestart from "../../hooks/useSessionRestart.ts";

/**
 * The language switch component used to change the language of the user interface and interaction.
 * @param setOpen
 * @constructor
 */
export default function LanguageSwitch({
  setOpen,
}: {
  setOpen: (b: boolean) => void;
}) {
  const { i18n, t } = useTranslation();
  const { restartFunction } = useSessionRestart({
    func: (e) => {
      const language = e?.target?.value;
      i18n.changeLanguage(language);
      setOpen(false);
    },
  });

  const onClickLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    restartFunction(e);
  };

  return (
    <MenuSelectorBase
      image={<World />}
      select={
        <select
          className="menu-select"
          onChange={onClickLanguageChange}
          value={i18n.language}
        >
          <option value="en">{t("English")}</option>
          <option value="de">{t("German")}</option>
        </select>
      }
    />
  );
}
