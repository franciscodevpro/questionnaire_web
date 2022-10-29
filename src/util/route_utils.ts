export const routes_constraints = {
  LOGIN: "/",
  QUESTIONNAIRE_LIST: "/questionnaires",
  QUESTIONNAIRE_CREATE: "/questionnaires/create",
  QUESTIONNAIRE_GET: "/questionnaires/:id",
  QUESTION_LIST: "/questions",
  APPLIER_LIST: "/appliers",
};

export const routes_helpers = {
  mountQuestionnaireGet: (id: string) =>
    routes_constraints.QUESTIONNAIRE_GET.replace(":id", id),
  mountQuestionGet: (idQuestionnaire: string) =>
    `${routes_constraints.QUESTION_LIST}?idQuestionnaire=${idQuestionnaire}`,
};
