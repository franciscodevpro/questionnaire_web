export type AnswerRequestType = {
  idQuestion: string;
  idAnswerOption: string;
  value: string;
  duration: number;
  createdAt: string;
};

export type AnswerRequestResultType = {
  id: string;
  idQuestionnaireData: string;
  idQuestion: string;
  idAnswerOption: string;
  value: string;
  duration: number;
  createdAt: string;
};

export type AnswerResponseType = {
  id: string;
  idQuestionnaireData: string;
  question: {
    id: string;
    idQuestionnaire: string;
    title: string;
    variable: string;
    type: string;
    minAnswers: number;
    maxAnswers: number;
    defaultValue: string;
    shuffle: true;
    prioritizeBySelection: true;
    answerOptions: [
      {
        id: string;
        idQuestion: string;
        title: string;
        status: true;
      }
    ];
  };
  answerOption: {
    id: string;
    idQuestion: string;
    title: string;
    status: true;
  };
  value: string;
  duration: number;
  createdAt: string;
};
