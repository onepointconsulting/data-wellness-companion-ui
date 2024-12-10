import { MessageType } from "./model.ts";

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

async function processPost(reportUrl: string, method: string, data: object) {
  return fetch(`${reportUrl}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
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
