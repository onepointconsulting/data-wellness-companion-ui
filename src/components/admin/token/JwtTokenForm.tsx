import { useTranslation } from "react-i18next";
import { useContext, useReducer } from "react";
import { ChatContext } from "../../../context/ChatContext.tsx";
import Spinner from "../../Spinner.tsx";
import {
  generateJwtToken,
  generateJwtTokenBatch, handleError,
  handleJson,
} from "../apiClient.ts";
import Field from "./Field.tsx";
import {
  Action,
  GenerationMode,
  initialState,
  State,
  tokenReducer,
} from "./jwtReducer.ts";
import { MessageType } from "../model.ts";
import AdminContainer from "../AdminContainer.tsx";
import FormContainer from "../FormContainer.tsx";
import AdminMessage from "../AdminMessage.tsx";

const inputStyle = `flex h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background
file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-[#0084d7]
disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500`;

const dwellTemplate = "https://d-well.onepointltd.ai/0?id=";
const dwiseTemplate = "https://d-wise.onepointltd.ai/index.html?id=";

const generationModeId = "generationMode";

const generationOptions = [GenerationMode.SINGLE, GenerationMode.BULK];

function TokenLink({ link, text }: { link: string; text: string }) {
  return (
    <div className="pl-3">
      <a href={link} className="text-ellipsis font-bold" target="_blank">
        {text}
      </a>
    </div>
  );
}

function TokenResult({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  const [t] = useTranslation();

  function copyToClipboard(text?: string) {
    if (!!text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard");
          dispatch({ type: "setCopied" });
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  }

  function generateDwell(token: string) {
    return `${dwellTemplate}${token}`;
  }

  function generateDwise(token: string) {
    return `${dwiseTemplate}${token}`;
  }

  const dwellLink = state.generatedToken
    ? generateDwell(state.generatedToken)
    : "";
  const dwiseLink = state.generatedToken
    ? generateDwise(state.generatedToken)
    : "";

  return (
    <>
      {state.generatedToken && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-4 overflow-hidden">
          <textarea className="border-2 border-input w-full px-3 py-2">
            {state.generatedToken}
          </textarea>
          <div className="flex mt-2">
            <TokenLink link={dwellLink} text="D-Well" />
            <TokenLink link={dwiseLink} text="D-Wise" />
          </div>
          <p className="text-right pt-2">
            <a
              href={"#"}
              onClick={() =>
                copyToClipboard(`D-Well\n${dwellLink}\n\nD-Wise\n${dwiseLink}`)
              }
            >
              {t("Copy links to clipboard")}
            </a>
          </p>
          {state.copied && <p className="text-right">{t("Copied!")}</p>}
        </div>
      )}
    </>
  );
}

export default function JwtTokenForm() {
  const [t] = useTranslation();
  const [state, dispatch] = useReducer(tokenReducer, initialState);
  const { reportUrl } = useContext(ChatContext);

  function onSubmit(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    const { name, email } = state;
    dispatch({ type: "generating" });
    if (state.generationMode == GenerationMode.SINGLE) {
      generateJwtToken({ reportUrl, name, email })
        .then((response) => handleJson(response))
        .then((data) => {
          console.log("Success:", data); // Handle the response data
          dispatch({ type: "generated", generatedToken: data.token });
        })
        .catch((error) => handleError(error, dispatch));
    } else {
      generateJwtTokenBatch({
        reportUrl,
        name,
        email,
        amount: state.generationAmount,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "exported_data.csv";
          a.click();
          window.URL.revokeObjectURL(url);
          dispatch({
            type: "setMessage",
            message: t("File was successfully downloaded"),
            messageType: MessageType.SUCCESS,
          });
        })
        .catch((error) => {
          console.error("Error:", error); // Handle errors
          dispatch({
            type: "setMessage",
            message: error.message,
            messageType: MessageType.FAILURE,
          });
        });
    }
  }

  function isDisabled() {
    return (
      state.name.length < 3 ||
      state.email.length < 5 ||
      state.email.indexOf("@") < 0
    );
  }

  return (
    <AdminContainer title="JWT Token Generation">
      {state.processing && <Spinner size={12} />}
      {state.message && (
        <AdminMessage message={state.message} messageType={state.messageType} />
      )}
      <TokenResult state={state} dispatch={dispatch} />
      <FormContainer
        onSubmit={onSubmit}
        onReset={() => dispatch({ type: "reset" })}
        isDisabled={isDisabled}
      >
        <Field label="Name">
          <input
            type="text"
            className="admin-input"
            placeholder={t("Name")}
            value={state.name}
            onChange={(e) =>
              dispatch({ type: "setName", name: e.target.value })
            }
          />
        </Field>
        <Field label="Email">
          <input
            type="text"
            className="admin-input"
            value={state.email}
            placeholder={t("Email")}
            onChange={(e) =>
              dispatch({ type: "setEmail", email: e.target.value })
            }
          />
        </Field>
        <Field label="Generation Mode">
          <div className="mt-2.5">
            {generationOptions.map((mode) => {
              return (
                <span key={mode} className="pl-2">
                  <input
                    type="radio"
                    id={`${mode}_id`}
                    name={generationModeId}
                    value={mode}
                    checked={state.generationMode == mode}
                    required={true}
                    onChange={() =>
                      dispatch({
                        type: "setGenerationMode",
                        generationMode: mode,
                      })
                    }
                  />
                  <label
                    htmlFor={`${mode}_id`}
                    className="text-base dark:text-gray-300 pl-2 pr-3 "
                  >
                    {t(mode)}
                  </label>
                </span>
              );
            })}
          </div>
        </Field>
        {state.generationMode === GenerationMode.BULK && (
          <Field label="Generation Amount">
            <input
              type="number"
              className={inputStyle}
              value={state.generationAmount}
              placeholder={t("Generation Amount")}
              onChange={(e) =>
                dispatch({
                  type: "setGenerationAmount",
                  generationAmount: parseInt(e.target.value),
                })
              }
            />
          </Field>
        )}
      </FormContainer>
    </AdminContainer>
  );
}
