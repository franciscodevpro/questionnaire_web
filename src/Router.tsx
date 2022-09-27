import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateQuestionnaire } from "./pages/CreateQuestionnaire";
import Login from "./pages/Login";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route
            path="create-questionnaire"
            element={<CreateQuestionnaire />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
