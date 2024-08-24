function encodeUsernamePassword(username: string, password: string) {
  const base64Credentials = btoa(`${username}:${password}`).toString();
  return {
    Authorization: `Basic ${base64Credentials}`,
  };
}

function encodeUsernamePasswordPredefined() {
  return encodeUsernamePassword(
    "tpponepointconsultingltd5-LV11SA",
    "adf629ec-0a7f-4443-abcf-0bf6934fd8ea",
  );
}

module.exports = {
  encodeUsernamePassword,
  encodeUsernamePasswordPredefined,
};
