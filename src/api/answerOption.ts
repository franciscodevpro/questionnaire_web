import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import {
  AnswerOptionRequestResultType,
  AnswerOptionRequestType,
} from "../types/answerOption";
import { routes_constraints } from "../util/route_utils";
import api from "./index";

const getAccessToken = (): string | null => {
  const accessToken = getAccessTokenRepository();
  if (!accessToken?.accessToken) return null;
  return accessToken.accessToken;
};

const authConfig = () => ({
  headers: { "x-access-token": `Bearer ${getAccessToken()}` },
});

export const saveAnswerOption = async (
  answerOption: AnswerOptionRequestType
): Promise<AnswerOptionRequestResultType> => {
  const { idQuestion, title, status } = answerOption;
  const result = await api.post(
    routes_constraints.ANSWER_OPTION + "?idQuestion=" + idQuestion,
    { title, status },
    authConfig()
  );
  return result.data;
};
