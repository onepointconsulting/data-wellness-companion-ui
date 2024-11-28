import {useTranslation} from "react-i18next";
import {useContext, useReducer} from "react";
import {ChatContext} from "../../context/ChatContext.tsx";
import Spinner from "../Spinner.tsx";
import {generateJwtToken, generateJwtTokenBatch} from "./apiClient.ts";
import Field from "./Field.tsx";

enum GenerationMode {
    SINGLE = "single",
    BULK = "bulk"
}

enum MessageType {
    SUCCESS = "success",
    FAILURE = "failure"
}

interface State {
    name: string;
    email: string;
    generatedToken?: string;
    message?: string;
    messageType?: MessageType;
    processing: boolean;
    copied: boolean;
    generationAmount: number,
    generationMode: GenerationMode
}

type Action =
    | { type: "generating" }
    | { type: "generated"; generatedToken: string }
    | { type: "setName"; name: string }
    | { type: "setEmail"; email: string }
    | { type: "setMessage"; message: string, messageType: MessageType }
    | { type: "setGenerationAmount"; generationAmount: number }
    | { type: "setGenerationMode"; generationMode: GenerationMode }
    | { type: "setCopied" }
    | { type: "reset" };

const initialState: State = {
    name: "",
    email: "",
    processing: false,
    copied: false,
    generationAmount: 1,
    generationMode: GenerationMode.SINGLE
};

function reducer(state: State, action: Action): State {
    const type = action.type;
    switch (type) {
        case "setName":
            return {...state, name: action.name};
        case "setEmail":
            return {...state, email: action.email};
        case "setMessage":
            return {...state, message: action.message, messageType: action.messageType, processing: false};
        case "generating":
            return {...state, processing: true, generatedToken: "", copied: false};
        case "setGenerationAmount":
            return {...state, generationAmount: action.generationAmount < 1 ? 1 : action.generationAmount};
        case "setGenerationMode":
            return {...state, generationMode: action.generationMode};
        case "generated":
            return {
                ...state,
                generatedToken: action.generatedToken,
                processing: false,
                copied: false,
                message: ""
            };
        case "setCopied":
            return {...state, copied: true};
        case "reset":
            return {
                name: "",
                email: "",
                generatedToken: "",
                message: "",
                processing: false,
                copied: false,
                generationAmount: 1,
                generationMode: GenerationMode.SINGLE
            };
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
}

const inputStyle = `flex h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base ring-offset-background
file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-[#0084d7]
disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500`;

const dwellTemplate = "https://d-well.onepointltd.ai/0?id=";
const dwiseTemplate = "https://d-wise.onepointltd.ai/index.html?id=";

const generationModeId = "generationMode"

const generationOptions = [GenerationMode.SINGLE, GenerationMode.BULK]

function TokenLink({link, text}: { link: string; text: string }) {
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
                    dispatch({type: "setCopied"});
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
                <div
                    className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-4 overflow-hidden">
          <textarea className="border-2 border-input w-full px-3 py-2">
            {state.generatedToken}
          </textarea>
                    <div className="flex mt-2">
                        <TokenLink link={dwellLink} text="D-Well"/>
                        <TokenLink link={dwiseLink} text="D-Wise"/>
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

function messageTypeColor(messageType: MessageType | undefined) {
    return messageType === MessageType.FAILURE ? 'bg-red-100' : 'bg-green-100'
}

export default function JwtTokenForm() {
    const [t] = useTranslation();
    const [state, dispatch] = useReducer(reducer, initialState);
    const {reportUrl} = useContext(ChatContext);

    function onSubmit(e: React.MouseEvent<HTMLInputElement>) {
        e.preventDefault();
        const {name, email} = state;
        dispatch({type: "generating"});
        if (state.generationMode == GenerationMode.SINGLE) {
            generateJwtToken({reportUrl, name, email})
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json(); // Parse the response as JSON
                })
                .then((data) => {
                    console.log("Success:", data); // Handle the response data
                    dispatch({type: "generated", generatedToken: data.token});
                })
                .catch((error) => {
                    console.error("Error:", error); // Handle errors
                    dispatch({type: "setMessage", message: error.message, messageType: MessageType.FAILURE});
                });
        } else {
            generateJwtTokenBatch({reportUrl, name, email, amount: state.generationAmount})
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.blob()
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'exported_data.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    dispatch({type: "setMessage", message: t("File was successfully downloaded"), messageType: MessageType.SUCCESS});
                })
                .catch((error) => {
                    console.error("Error:", error); // Handle errors
                    dispatch({type: "setMessage", message: error.message, messageType: MessageType.FAILURE});
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
        <div className="container mt-1 text-gray-900">
            <h1 className="dark:text-gray-100 pt-6">{t("JWT Token Generation")}</h1>
            {state.processing && <Spinner size={12}/>}
            {state.message && (
                <div className={`${messageTypeColor(state.messageType)} border border-gray-400 text-gray-700 px-4 py-3 rounded relative mt-4`}>
                    {state.message}
                </div>
            )}
            <TokenResult state={state} dispatch={dispatch}/>
            <form className="mt-8">
                <Field label="Name">
                    <input
                        type="text"
                        className={inputStyle}
                        placeholder={t("Name")}
                        value={state.name}
                        onChange={(e) =>
                            dispatch({type: "setName", name: e.target.value})
                        }
                    />
                </Field>
                <Field label="Email">
                    <input
                        type="text"
                        className={inputStyle}
                        value={state.email}
                        placeholder={t("Email")}
                        onChange={(e) =>
                            dispatch({type: "setEmail", email: e.target.value})
                        }
                    />
                </Field>
                <Field label="Generation Mode">
                    <div className="mt-2.5">
                        {generationOptions.map(mode => {
                            return (
                                <span key={mode} className="pl-2">
                                    <input type="radio" id={`${mode}_id`} name={generationModeId}
                                           value={mode}
                                           checked={state.generationMode == mode}
                                           required={true}
                                           onChange={() => dispatch({type: "setGenerationMode", generationMode: mode})}
                                    />
                                    <label htmlFor={`${mode}_id`}
                                           className="text-base dark:text-gray-300 pl-2 pr-3 ">{t(mode)}</label>
                                </span>
                            )
                        })}
                    </div>
                </Field>
                {state.generationMode === GenerationMode.BULK && <Field label="Generation Amount">
                    <input
                        type="number"
                        className={inputStyle}
                        value={state.generationAmount}
                        placeholder={t("Generation Amount")}
                        onChange={(e) =>
                            dispatch({type: "setGenerationAmount", generationAmount: parseInt(e.target.value)})
                        }
                    />
                </Field>}
                <div className="flex flex-wrap mt-8 justify-end">
                    <input
                        type="reset"
                        onClick={() => dispatch({type: "reset"})}
                        className="bg-destructive px-6 py-3 text-white hover:bg-red-600 mr-2 disabled:bg-red-200 dark:disabled:bg-red-400"
                        disabled={isDisabled()}
                    />
                    <input
                        type="submit"
                        onClick={(e) => onSubmit(e)}
                        className="bg-blue-500 disabled:bg-blue-200 px-6 py-3 text-white hover:bg-blue-700 dark:disabled:bg-blue-400 dark:hover:bg-blue-400"
                        disabled={isDisabled()}
                    />
                </div>
            </form>
        </div>
    );
}
