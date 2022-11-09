import { AnswerOptionResponseType } from "./answerOption";

export type QuestionRequestType = {
  idQuestionnaire: string;
  title: string;
  variable: string;
  type: string;
  minAnswers: number;
  maxAnswers: number;
  defaultValue: string;
  shuffle: boolean;
  prioritizeBySelection: boolean;
};

export type QuestionRequestResultType = {
  id: string;
  idQuestionnaire: string;
  title: string;
  variable: string;
  type: string;
  minAnswers: number;
  maxAnswers: number;
  defaultValue: string;
  shuffle: boolean;
  prioritizeBySelection: boolean;
};

export type QuestionResponseType = {
  id: string;
  idQuestionnaire: string;
  title: string;
  variable: string;
  type: string;
  minAnswers: number;
  maxAnswers: number;
  defaultValue: string;
  shuffle: boolean;
  prioritizeBySelection: boolean;
  isActive: boolean;
  answerOptions: AnswerOptionResponseType[];
};
