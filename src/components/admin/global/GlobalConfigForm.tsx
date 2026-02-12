import { useTranslation } from "react-i18next";
import { useContext, useEffect, useReducer } from "react";
import {
  GlobalConfigurationProperty,
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
        // sort the properties by config_key
        properties.sort(
          (a: GlobalConfigurationProperty, b: GlobalConfigurationProperty) => a.config_key.localeCompare(b.config_key)
        );
        dispatch({ type: "setProperties", properties });
      })
      .catch((error) => handleError(error, dispatch));
  }, []);

  function isDisabled(): boolean {
    return false
  }

  function onSubmit() {
    dispatch({ type: "processing" });
    updateGlobalProperties(reportUrl, state.properties)
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
      .catch((error) => handleError(error, dispatch))
      .finally(() => {
        // scroll smoothly to the top of the page
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
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
        {state.properties.map((property) => {
          return (
            <Field label={property.config_key}>
              <input
                type="text"
                className="admin-input"
                value={property.config_value}
                onChange={(e) =>
                  dispatch({
                    type: "setProperty",
                    config_key: property.config_key,
                    config_value: e.target.value,
                  })
                }
              />
            </Field>
          )
        })}
      </FormContainer>
    </AdminContainer>
  );
}
