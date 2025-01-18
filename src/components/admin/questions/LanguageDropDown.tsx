import {
  supportedLanguages,
  supportedLanguagesLabels,
} from "../model/languages.ts";
import Field from "../token/Field.tsx";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { QuestionsContext } from "./questionsReducer.tsx";

export default function LanguageDropDown() {
  const [t] = useTranslation();
  const { dispatch } = useContext(QuestionsContext);
  return (
    <Field label={t("Select language")}>
      <select
        className="admin-input"
        onChange={(e) =>
          dispatch({ type: "setLanguage", language: e.target.value })
        }
      >
        {supportedLanguages.map((language, i) => (
          <option key={`lang_${i}`} value={language}>
            {t(supportedLanguagesLabels[language] ?? language)}
          </option>
        ))}
      </select>
    </Field>
  );
}
