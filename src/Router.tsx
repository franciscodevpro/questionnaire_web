import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { findAllAppliers } from "./api/appliers";
import { findAllQuestionnaire } from "./api/questionnaire";
import { MainContextProvider } from "./contexts/questionnaire-context";
import { FormQuestionnaire } from "./pages/FormQuestionnaire";
import { ListAppliers } from "./pages/ListAppliers";
import { ListQuestionnaires } from "./pages/ListQuestionnaires";
import Login from "./pages/Login";
import { ApplierRequestResultType } from "./types/applier";
import { QuestionnaireRequestResultType } from "./types/questionnaire";
import { isLoggedIn } from "./util/login";
import { routes_constraints } from "./util/route_utils";

export const Router = () => {
  const [questionnaires, setQuestionnaires] = useState<
    QuestionnaireRequestResultType[]
  >([]);
  const [appliers, setAppliers] = useState<ApplierRequestResultType[]>([]);
  const [openedMenuItems, setOpenedMenuItems] = useState<
    [{ [key: string]: boolean }, string?]
  >([{}]);

  const startContext = async () => {
    const questionnaireResult = await findAllQuestionnaire();
    setQuestionnaires(questionnaireResult);
    const appliersResult = await findAllAppliers();
    setAppliers(appliersResult);
  };

  const goIfLoggedIn = (ChildComponent: JSX.Element) => {
    return (
      <>
        {!isLoggedIn() ? (
          <Navigate to={routes_constraints.LOGIN} />
        ) : (
          ChildComponent
        )}
      </>
    );
  };
  return (
    <MainContextProvider
      value={{
        questionnaires,
        setQuestionnaires: (params: QuestionnaireRequestResultType[]) =>
          setQuestionnaires(params),
        restartContext: async () => startContext(),
        openedMenuItems,
        setOpenedMenuItems: (params: [{ [key: string]: boolean }, string?]) =>
          setOpenedMenuItems(params),
        appliers,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <>
                  {isLoggedIn() ? (
                    <Navigate to={routes_constraints.QUESTIONNAIRE} />
                  ) : (
                    <Login />
                  )}
                </>
              }
            />
            <Route
              path={routes_constraints.QUESTIONNAIRE}
              element={goIfLoggedIn(<ListQuestionnaires />)}
            />
            <Route
              path={routes_constraints.QUESTIONNAIRE_CREATE}
              element={goIfLoggedIn(<FormQuestionnaire />)}
            />
            <Route
              path={routes_constraints.QUESTIONNAIRE_ID}
              element={goIfLoggedIn(<FormQuestionnaire type="update" />)}
            />
            <Route
              path={routes_constraints.APPLIER}
              element={goIfLoggedIn(<ListAppliers />)}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </MainContextProvider>
  );
};
