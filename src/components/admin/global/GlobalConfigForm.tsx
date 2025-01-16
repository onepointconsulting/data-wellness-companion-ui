import { useTranslation } from "react-i18next";
import { useContext, useEffect, useReducer } from "react";
import {
  globalConfigurationReducer,
  initialGlobalConfigState,
} from "./globalConfigReducer.ts";
import AdminContainer from "../AdminContainer.tsx";
import Field from "../token/Field.tsx";
import {
  globalProperties,
  handleError,
  handleJson,
  updateGlobalProperties,
} from "../../../lib/admin/apiClient.ts";
import { ChatContext } from "../../../context/ChatContext.tsx";
import FormContainer from "../FormContainer.tsx";
import { MessageType } from "../model.ts";
import handleSubmission from "../../../lib/formSubmission.ts";

const KEY_MESSAGE_LOWER_LIMIT = "MESSAGE_LOWER_LIMIT";
const KEY_MESSAGE_UPPER_LIMIT = "MESSAGE_UPPER_LIMIT";

export default function GlobalConfigForm() {
  const [t] = useTranslation();
  const { reportUrl } = useContext(ChatContext);
  const [state, dispatch] = useReducer(
    globalConfigurationReducer,
    initialGlobalConfigState,
  );

  useEffect(() => {
    globalProperties(reportUrl)
      .then((response) => handleJson(response))
      .then((json) => {
        const properties = json["properties"];
        for (const property of properties) {
          const configKey = property["config_key"];
          const configValue = property["config_value"];
          switch (configKey) {
            case KEY_MESSAGE_LOWER_LIMIT:
              dispatch({
                type: "setMessageLowerLimit",
                messageLowerLimit: configValue,
              });
              break;
            case KEY_MESSAGE_UPPER_LIMIT:
              dispatch({
                type: "setMessageUpperLimit",
                messageUpperLimit: configValue,
              });
              break;
          }
        }
      })
      .catch((error) => handleError(error, dispatch));
  }, []);

  function isDisabled(): boolean {
    return !state.messageLowerLimitValid || !state.messageUpperLimitValid;
  }

  function onSubmit() {
    dispatch({ type: "processing" });
    updateGlobalProperties(reportUrl, {
      message_lower_limit: state.messageLowerLimit,
      message_upper_limit: state.messageUpperLimit,
    })
      .then((response) => handleJson(response))
      .then((json) => {
        dispatch({
          type: "setMessage",
          message: t("Updated {{updated}} item(s).", {
            updated: json["updated"],
          }),
          messageType: MessageType.SUCCESS,
        });
      })
      .catch((error) => handleError(error, dispatch));
  }

  return (
    <AdminContainer
      title="Global Configuration"
      processing={state.processing}
      message={state.message}
      messageType={state.messageType}
    >
      <FormContainer
        onReset={() => {}}
        onSubmit={handleSubmission(onSubmit)}
        disabled={isDisabled()}
        hasReset={false}
      >
        <Field label={t("Messages lower limit")}>
          <input
            type="number"
            autoFocus={true}
            className="admin-input"
            placeholder={t("Messages lower limit")}
            value={state.messageLowerLimit}
            onChange={(e) =>
              dispatch({
                type: "setMessageLowerLimit",
                messageLowerLimit: e.target.value,
              })
            }
          />
        </Field>
        <Field label={t("Messages upper limit")}>
          <input
            type="number"
            autoFocus={true}
            className="admin-input"
            placeholder={t("Messages upper limit")}
            value={state.messageUpperLimit}
            onChange={(e) =>
              dispatch({
                type: "setMessageUpperLimit",
                messageUpperLimit: e.target.value,
              })
            }
          />
        </Field>
      </FormContainer>
    </AdminContainer>
  );
}
