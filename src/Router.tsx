import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateQuestionnaire } from "./pages/CreateQuestionnaire";
import { ListQuestionnaires } from "./pages/ListQuestionnaires";
import Login from "./pages/Login";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="questionnaires" element={<ListQuestionnaires />} />
          <Route
            path="questionnaires/create"
            element={<CreateQuestionnaire />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
