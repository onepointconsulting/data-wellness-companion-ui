import { GlobalConfigurationProperty } from "../../components/admin/global/globalConfigReducer";
import { MessageType } from "../../components/admin/model";
import { getAccessToken } from "../accessTokenPersistence";

interface JwtTokenData {
  reportUrl: string;
  name: string;
  email: string;
}

export type ReportData = {
  reportUrl: string;
  email_list: string[];
  tokens: string[];
  language: string;
};

interface JwtTokenDataExtended extends JwtTokenData {
  amount: number;
}

function getAccessTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

async function processPost(
  reportUrl: string,
  method: string,
  data: object,
  includeCredentials: boolean = false,
) {
  return fetch(`${reportUrl}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
      ...getAccessTokenHeader(),
    },
    credentials: includeCredentials ? "include" : "same-origin",
    body: JSON.stringify(data),
  });
}

export async function generateJwtToken(jwtTokenData: JwtTokenData) {
  const { name, email, reportUrl } = jwtTokenData;
  return processPost(reportUrl, "gen_jwt_token", { name, email });
}

export async function generateJwtTokenBatch(
  jwtTokenData: JwtTokenDataExtended,
) {
  const { name, email, amount, reportUrl } = jwtTokenData;
  return processPost(reportUrl, "generate_token_batch", {
    name,
    email,
    amount,
  });
}

export async function generateReport(reportData: ReportData) {
  const { email_list, tokens, language, reportUrl } = reportData;
  return processPost(reportUrl, "generate_aggregated_report", {
    email_list,
    tokens,
    language,
  });
}

export async function globalProperties(baseUrl: string) {
  return fetch(`${baseUrl}/protected/global_configuration`, {
    headers: getAccessTokenHeader(),
  });
}

export async function updateGlobalProperties(
  baseUrl: string,
  globalProperties: GlobalConfigurationProperty[],
) {
  return processPost(
    baseUrl,
    "protected/update_global_configuration",
    globalProperties,
    true, // Include credentials for protected routes
  );
}

export async function getQuestions(baseUrl: string, language: string) {
  return fetch(`${baseUrl}/protected/questions/${language}`, {
    headers: getAccessTokenHeader(),
  });
}

export async function updateQuestion(baseUrl: string, questionUpdate: object) {
  return processPost(
    baseUrl,
    "protected/questions/update",
    questionUpdate,
    true,
  ); // Include credentials for protected routes
}

export function handleJson(response: Response) {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json(); // Parse the response as JSON
}

export function handleError(error: Error, dispatch: (content: any) => void) {
  console.error("Error:", error); // Handle errors
  dispatch({
    type: "setMessage",
    message: error.message,
    messageType: MessageType.FAILURE,
  });
}

export async function getPrompts(reportUrl: string, language: string = "en") {
  const response = await fetch(
    `${reportUrl}/protected/prompts/${language}?add_ids=true`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...getAccessTokenHeader(),
      },
      credentials: "include", // Include credentials for protected routes
    },
  );
  return handleJson(response);
}

export async function updatePrompt(
  id: number,
  text: string,
  reportUrl: string,
): Promise<boolean> {
  const res = await fetch(`${reportUrl}/protected/prompts/update/${id}`, {
    method: "PUT",
    credentials: "include", // Include credentials for protected routes
    body: text,
    headers: getAccessTokenHeader(),
  });
  return res.ok;
}
