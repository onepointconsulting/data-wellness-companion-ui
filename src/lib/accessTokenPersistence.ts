const ACCESS_TOKEN_KEY = "access_token";

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(access_token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
}

function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export { getAccessToken, setAccessToken, removeAccessToken };
