import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import { AnswerResponseType } from "../types/answer";
import {
  QuestionnaireDataRequestResultType,
  QuestionnaireDataRequestType,
  QuestionnaireDataResponseType,
} from "../types/questionnaireData";
import { routes_constraints, routes_helpers } from "../util/route_utils";
import api from "./index";
const getAccessToken = (): string | null => {
  const accessToken = getAccessTokenRepository();
  if (!accessToken?.accessToken) return null;
  return accessToken.accessToken;
};

const authConfig = () => ({
  headers: { "x-access-token": `Bearer ${getAccessToken()}` },
});

export const saveQuestionnaireData = async (
  questionnaireData: QuestionnaireDataRequestType
): Promise<QuestionnaireDataRequestResultType> => {
  const result = await api.post(
    routes_constraints.QUESTIONNAIRE,
    questionnaireData,
    authConfig()
  );
  return result.data;
};

export const updateQuestionnaireData = async (
  id: string,
  questionnaireData: QuestionnaireDataRequestType
): Promise<QuestionnaireDataRequestResultType> => {
  const result = await api.patch(
    routes_helpers.mountQuestionnaireDataId(id),
    questionnaireData,
    authConfig()
  );
  return result.data;
};

export const findAllQuestionnaireData = async (
  questionnaireId: string
): Promise<QuestionnaireDataResponseType[]> => {
  const result = await api.get(
    routes_helpers.mountQuestionnaireDataIdQuestionnaire(questionnaireId),
    authConfig()
  );
  return result.data;
};

export const getSpecificQuestionnaireData = async (
  id: string
): Promise<
  QuestionnaireDataResponseType & Record<"answers", AnswerResponseType[]>
> => {
  const result = await api.get(
    routes_helpers.mountQuestionnaireDataId(id),
    authConfig()
  );
  const answersResult = await api.get(
    routes_helpers.mountAnswerIdQuestionnaireData(result.data.id),
    authConfig()
  );
  return { ...result.data, answers: answersResult.data };
};

export const deleteQuestionnaireData = async (id: string): Promise<void> => {
  await api.delete(routes_helpers.mountQuestionnaireDataId(id), authConfig());
};
