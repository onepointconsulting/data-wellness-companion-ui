export const SUCCESS = 0;

export const ERROR = 1;

const USER_INFO = "";

const SERVER = "http://hackthon-boomi.uksouth.cloudapp.azure.com:9090/ws/rest";

type RequestData = {
  language?: string;
  email?: string;
  session?: string;
  step_number?: number;
  user_answer?: string;
  username?: string;
};

export type ResponseData = {
  code: number;
  message?: string,
  data?: any;
}

export async function queryInitSession(language: string = "en", email: string): Promise<ResponseData> {
  if (!email) {
    return createError("Missing email");
  }
  return await handleRequest(`${SERVER}/InitSession${USER_INFO}`, {
    language,
    email,
  });
}

export async function askClarification(session: string, stepNumber: number): Promise<ResponseData> {
  if (!session) {
    return createError("Missing session");
  }
  if (!stepNumber) {
    return createError("Missing step number");
  }
  return await handleRequest(`${SERVER}/AskClarification${USER_INFO}`, {
    session,
    step_number: stepNumber,
  });
}

export async function upsertUserAnswer(
  session: string,
  stepNumber: number,
  userAnswer: string,
): Promise<ResponseData> {
  if (!session) {
    return createError("Missing session");
  }
  if (stepNumber === null || typeof stepNumber === "undefined") {
    return createError("Missing step number");
  }
  if (textMissing(userAnswer)) {
    return createError("Missing user message");
  }
  return await handleRequest(`${SERVER}/UserAnswer${USER_INFO}`, {
    session,
    step_number: stepNumber,
    user_answer: userAnswer,
  });
}

export async function queryReportEmail(
  session: string,
  username: string,
  email: string,
): Promise<ResponseData> {
  if (!session) {
    return createError("Missing session");
  }
  if (textMissing(username)) {
    return createError("Missing user name");
  }
  if (textMissing(email)) {
    return createError("Missing email");
  }
  return await handleRequest(`${SERVER}/ReportEmail${USER_INFO}`, {
    session,
    username,
    email,
  });
}

function textMissing(text: string) {
  return !text || text.trim().length === 0;
}

async function handleRequest(endpoint: string, query: RequestData): Promise<ResponseData> {
  try {
    console.info("query", query);
    const headers = {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
    };
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(query),
      headers,
    });
    console.info("Status", res.status);
    const data = await res.json();
    return {
      data,
      code: SUCCESS,
    };
  } catch (e) {
    return createError(`Failed to process: ${e}`);
  }
}

function createError(message: string) {
  console.error("Error:", message);
  return {
    code: ERROR,
    message,
  };
}
