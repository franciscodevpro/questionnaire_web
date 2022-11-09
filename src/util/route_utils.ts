export const routes_constraints = {
  LOGIN: "/",
  QUESTIONNAIRE: "/questionnaires",
  QUESTIONNAIRE_CREATE: "/questionnaires/create",
  QUESTIONNAIRE_ID: "/questionnaires/:id",
  QUESTION: "/questions",
  APPLIER: "/appliers",
  ANSWER_OPTION: "/answer_options",
  ANSWER_OPTION_ID: "/answer_options/:id",
};

export const routes_helpers = {
  mountQuestionnaireId: (id: string) =>
    routes_constraints.QUESTIONNAIRE_ID.replace(":id", id),
  mountQuestionIdQuestionnaire: (idQuestionnaire: string) =>
    `${routes_constraints.QUESTION}?idQuestionnaire=${idQuestionnaire}`,
};
