import {
  saveAccessToken,
  removeAccessToken,
} from "../../repositories/tokenRepository";
import { LoginType } from "../../types/login";
import { errorMessagePopup } from "../../util/messages";
import api from "../index";

export const doLogin = async ({
  login,
  password,
}: LoginType): Promise<void> => {
  const result = await api.post("/login", { login, password });
  if (!result?.data?.token)
    return errorMessagePopup(
      "Erro ao tentar efetuar login. Verifique o login e senha e tente novemante"
    );
  console.log(result?.data);
  saveAccessToken({
    accessToken: result?.data?.token,
    expiresIn: result?.data?.tokenExpiration,
  });
  window.location.reload();
};

export const doLogout = () => {
  removeAccessToken();
  window.location.reload();
};
