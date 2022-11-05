import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import { QuestionResponseType } from "../types/question";
import {
  QuestionnaireRequestResultType,
  QuestionnaireRequestType,
  QuestionnaireResponseType,
} from "../types/questionnaire";
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

export const saveQuestionnaire = async (
  questionnaire: QuestionnaireRequestType
): Promise<QuestionnaireRequestResultType> => {
  const result = await api.post(
    routes_constraints.QUESTIONNAIRE,
    questionnaire,
    authConfig()
  );
  return result.data;
};

export const findAllQuestionnaire = async (): Promise<
  QuestionnaireResponseType[]
> => {
  const result = await api.get(routes_constraints.QUESTIONNAIRE, authConfig());
  return result.data;
};

export const getSpecificQuestionnaire = async (
  id: string
): Promise<
  QuestionnaireResponseType & Record<"questions", QuestionResponseType[]>
> => {
  const result = await api.get(
    routes_helpers.mountQuestionnaireGet(id),
    authConfig()
  );
  const questions = await api.get(
    routes_helpers.mountQuestionGet(id),
    authConfig()
  );
  return { ...result.data, questions: questions.data };
};
