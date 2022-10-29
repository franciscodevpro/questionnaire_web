import { getAccessToken } from "../repositories/tokenRepository";

export const isLoggedIn = (): boolean => {
  const accessToken = getAccessToken();
  if (!accessToken?.accessToken || !accessToken?.expiresIn) return false;

  if (accessToken.expiresIn <= Date.now()) return false;

  return true;
};
