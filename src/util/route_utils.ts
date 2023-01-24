export const routes_constraints = {
  LOGIN: "/",
  QUESTIONNAIRE: "/questionnaires",
  QUESTIONNAIRE_ID: "/questionnaires/:id",
  QUESTIONNAIRE_CREATE: "/questionnaires/create",
  QUESTIONNAIRE_DASHBOARD: "/questionnaires/:id/dashboard",
  QUESTIONNAIRE_MAP: "/questionnaires/:id/map",
  QUESTIONNAIRE_DATA: "/questionnaire_data",
  QUESTIONNAIRE_DATA_ID: "/questionnaire_data/:id",
  QUESTION: "/questions",
  QUESTION_ID: "/questions/:id",
  APPLIER: "/appliers",
  APPLIER_ID: "/appliers/:id",
  APPLIER_CREATE: "/appliers/create",
  ANSWER_OPTION: "/answer_options",
  ANSWER_OPTION_ID: "/answer_options/:id",
  ANSWER: "/answers",
  ANSWER_ID: "/answers/:id",
  DEVICE: "/devices",
  DEVICE_ID: "/devices/:id",
  DEVICE_CREATE: "/devices/create",
  REPORTS_QUESTIONNAIRE_DATA: "/reports/questionnaire_data/:id",
  REPORTS_QUESTIONNAIRE_DATA_SELECT: "/reports/questionnaire_data",
};

export const routes_helpers = {
  mountQuestionnaireId: (id: string) =>
    routes_constraints.QUESTIONNAIRE_ID.replace(":id", id),
  mountQuestionnaireDashboard: (id: string) =>
    routes_constraints.QUESTIONNAIRE_DASHBOARD.replace(":id", id),
  mountQuestionnaireMap: (id: string) =>
    routes_constraints.QUESTIONNAIRE_MAP.replace(":id", id),
  mountQuestionIdQuestionnaire: (idQuestionnaire: string) =>
    `${routes_constraints.QUESTION}?idQuestionnaire=${idQuestionnaire}`,
  mountQuestionnaireDataIdQuestionnaire: (idQuestionnaire: string) =>
    `${routes_constraints.QUESTIONNAIRE_DATA}?idQuestionnaire=${idQuestionnaire}`,
  mountQuestionnaireDataId: (id: string) =>
    routes_constraints.QUESTIONNAIRE_DATA_ID.replace(":id", id),
  mountQuestionId: (id: string) =>
    `${routes_constraints.QUESTION_ID.replace(":id", id)}`,
  mountAnswerOptionId: (id: string) =>
    routes_constraints.ANSWER_OPTION_ID.replace(":id", id),
  mountAnswerIdQuestionnaireData: (idQuestionnaireData: string) =>
    `${routes_constraints.ANSWER}?idQuestionnaireData=${idQuestionnaireData}`,
  mountApplierId: (id: string) =>
    routes_constraints.APPLIER_ID.replace(":id", id),
  mountDeviceId: (id: string) =>
    routes_constraints.DEVICE_ID.replace(":id", id),
  mountReportsQuestionnaireData: (id: string) =>
    routes_constraints.REPORTS_QUESTIONNAIRE_DATA.replace(":id", id),
};
