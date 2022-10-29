import { TokenType } from "../types/login";

export const saveAccessToken = (accessToken: TokenType) => {
  localStorage.setItem(
    "questionnaire:accessToken",
    JSON.stringify(accessToken)
  );
};

export const getAccessToken = (): TokenType | null => {
  const result = localStorage.getItem("questionnaire:accessToken");
  if (!result) return null;
  return JSON.parse(result);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem("questionnaire:accessToken");
};
