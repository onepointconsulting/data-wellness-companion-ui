import { useTranslation } from "react-i18next";
import { useContext, useReducer } from "react";
import { reportInitialState, reportReducer } from "./reportReducer.ts";
import { ChatContext } from "../../../context/ChatContext.tsx";
import AdminContainer from "../AdminContainer.tsx";
import Spinner from "../../Spinner.tsx";
import FormContainer from "../FormContainer.tsx";
import Field from "../token/Field.tsx";
import AdminMessage from "../AdminMessage.tsx";
import {
  generateReport,
  handleError,
  handleJson,
  ReportData,
} from "../apiClient.ts";
import { MessageType } from "../model.ts";

const supportedLanguages = ["en", "de"];

export default function ReportForm() {
  const [t] = useTranslation();
  const [state, dispatch] = useReducer(reportReducer, reportInitialState);
  const { reportUrl } = useContext(ChatContext);

  function onSubmit(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    dispatch({ type: "sending" });
    const reportData: ReportData = {
      reportUrl,
      email_list: state.emails,
      tokens: state.tokens,
      language: state.language,
    };
    generateReport(reportData)
      .then((response: Response) => handleJson(response))
      .then((data) => {
        console.log("Success:", data); // Handle the response data
        dispatch({ type: "sent" });
        dispatch({
          type: "setMessage",
          message: t(
            "Request sent. The report will be sent to all emails you specified.",
          ),
          messageType: MessageType.SUCCESS,
        });
      })
      .catch((error) => handleError(error, dispatch));
  }

  return (
    <AdminContainer title="Generate Email Report">
      {state.processing && <Spinner size={12} />}
      {state.message && (
        <AdminMessage message={state.message} messageType={state.messageType} />
      )}
      <FormContainer
        onSubmit={onSubmit}
        onReset={() => dispatch({ type: "reset" })}
        isDisabled={() => state.disabled}
      >
        <Field label="Emails">
          <textarea
            autoFocus={true}
            className="admin-input"
            placeholder={t("Enter emails separated by new line")}
            value={state.emailsStr}
            onChange={(e) =>
              dispatch({ type: "setEmailsStr", emailsStr: e.target.value })
            }
          />
        </Field>
        <Field label="Tokens">
          <textarea
            className="admin-input"
            placeholder={t("Enter tokens separated by new line")}
            value={state.tokenStr}
            onChange={(e) =>
              dispatch({ type: "setTokenStr", tokenStr: e.target.value })
            }
          />
        </Field>
        <Field label="Language">
          <select
            className="admin-input"
            value={state.language}
            onChange={(e) =>
              dispatch({ type: "setLanguage", language: e.target.value })
            }
          >
            {supportedLanguages.map((l, i) => (
              <option key={`lang_${i}`} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </FormContainer>
    </AdminContainer>
  );
}
