import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FormQuestionnaire } from "./pages/FormQuestionnaire";
import { ListQuestionnaires } from "./pages/ListQuestionnaires";
import Login from "./pages/Login";
import { isLoggedIn } from "./util/login";
import { routes_constraints } from "./util/route_utils";

export const Router = () => {
  const goIfLoggedIn = (ChildComponent: JSX.Element) => (
    <>
      {!isLoggedIn() ? (
        <Navigate to={routes_constraints.LOGIN} />
      ) : (
        ChildComponent
      )}
    </>
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <>
                {isLoggedIn() ? (
                  <Navigate to={routes_constraints.QUESTIONNAIRE_LIST} />
                ) : (
                  <Login />
                )}
              </>
            }
          />
          <Route
            path={routes_constraints.QUESTIONNAIRE_LIST}
            element={goIfLoggedIn(<ListQuestionnaires />)}
          />
          <Route
            path={routes_constraints.QUESTIONNAIRE_CREATE}
            element={goIfLoggedIn(<FormQuestionnaire />)}
          />
          <Route
            path={routes_constraints.QUESTIONNAIRE_GET}
            element={goIfLoggedIn(<FormQuestionnaire type="update" />)}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
