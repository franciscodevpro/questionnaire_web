import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import {
  QuestionRequestResultType,
  QuestionRequestType,
} from "../types/question";
import { routes_helpers } from "../util/route_utils";
import api from "./index";

const getAccessToken = (): string | null => {
  const accessToken = getAccessTokenRepository();
  if (!accessToken?.accessToken) return null;
  return accessToken.accessToken;
};

const authConfig = () => ({
  headers: { "x-access-token": `Bearer ${getAccessToken()}` },
});

export const updateQuestion = async (
  id: string,
  question: QuestionRequestType
): Promise<QuestionRequestResultType> => {
  const {
    title,
    variable,
    type,
    minAnswers,
    maxAnswers,
    defaultValue,
    shuffle,
    prioritizeBySelection,
  } = question;
  const result = await api.patch(
    routes_helpers.mountQuestionId(id),
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
    routes_helpers.mountQuestionIdQuestionnaire(idQuestionnaire),
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

export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(routes_helpers.mountQuestionId(id), authConfig());
};
