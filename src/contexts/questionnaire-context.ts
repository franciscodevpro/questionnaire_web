import { createContext } from "react";
import { QuestionnaireRequestResultType } from "../types/questionnaire";

const MainContext = createContext<{
  questionnaires: QuestionnaireRequestResultType[];
  setQuestionnaires?: (params: QuestionnaireRequestResultType[]) => void;
  restartContext?: () => Promise<void>;
  openedMenuItems?: [{ [key: string]: boolean }, string?];
  setOpenedMenuItems?: (items: [{ [key: string]: boolean }, string?]) => void;
}>({ questionnaires: [] });

export const MainContextProvider = MainContext.Provider;
export const MainContextConsumer = MainContext.Consumer;

export default MainContext;
