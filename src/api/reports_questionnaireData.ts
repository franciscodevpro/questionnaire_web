import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import { AnswerResponseType } from "../types/answer";
import { QuestionResponseType } from "../types/question";
import { QuestionnaireResponseType } from "../types/questionnaire";
import { QuestionnaireDataResponseType } from "../types/questionnaireData";
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

export const getReportsQuestionnaireData = async (
  id: string
): Promise<{
  questionnaire: QuestionnaireResponseType;
  questionnaireData: QuestionnaireDataResponseType[];
  questions: QuestionResponseType[];
  answers: AnswerResponseType[];
}> => {
  const result = await api.get(
    routes_helpers.mountReportsQuestionnaireData(id),
    authConfig()
  );
  return result.data;
};
