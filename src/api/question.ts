import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import {
  QuestionRequestResultType,
  QuestionRequestType,
} from "../types/question";
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

export const saveQuestion = async (
  question: QuestionRequestType
): Promise<QuestionRequestResultType> => {
  const {
    idQuestionnaire,
    title,
    variable,
    type,
    minAnswers,
    maxAnswers,
    defaultValue,
    shuffle,
    prioritizeBySelection,
  } = question;
  const result = await api.post(
    routes_constraints.QUESTION + "?idQuestionnaire=" + idQuestionnaire,
    {
      title,
      variable,
      type,
      minAnswers,
      maxAnswers,
      defaultValue,
      shuffle,
      prioritizeBySelection,
    },
    authConfig()
  );
  return result.data;
};
