export const routes_constraints = {
  LOGIN: "/",
  QUESTIONNAIRE: "/questionnaires",
  QUESTIONNAIRE_CREATE: "/questionnaires/create",
  QUESTIONNAIRE_ID: "/questionnaires/:id",
  QUESTION: "/questions",
  QUESTION_ID: "/questions/:id",
  APPLIER: "/appliers",
  APPLIER_ID: "/appliers/:id",
  APPLIER_CREATE: "/appliers/create",
  ANSWER_OPTION: "/answer_options",
  ANSWER_OPTION_ID: "/answer_options/:id",
};

export const routes_helpers = {
  mountQuestionnaireId: (id: string) =>
    routes_constraints.QUESTIONNAIRE_ID.replace(":id", id),
  mountQuestionIdQuestionnaire: (idQuestionnaire: string) =>
    `${routes_constraints.QUESTION}?idQuestionnaire=${idQuestionnaire}`,
  mountQuestionId: (id: string) =>
    `${routes_constraints.QUESTION_ID.replace(":id", id)}`,
  mountAnswerOptionId: (id: string) =>
    routes_constraints.ANSWER_OPTION_ID.replace(":id", id),
  mountApplierId: (id: string) =>
    routes_constraints.APPLIER_ID.replace(":id", id),
};
