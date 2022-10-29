import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findAllQuestionnaire } from "../../api/questionnaire";
import { Main } from "../../components/Main";
import { QuestionnaireResponseType } from "../../types/questionnaire";
import { routes_constraints, routes_helpers } from "../../util/route_utils";
import "./styles.css";

type ListQuestionnairesProps = {};

export const ListQuestionnaires = ({}: ListQuestionnairesProps) => {
  const [questionnaires, setQuestionnaires] = useState<
    QuestionnaireResponseType[]
  >([]);
  const startComponent = async () => {
    const questionnaireResult = await findAllQuestionnaire();
    setQuestionnaires(questionnaireResult);
  };
  const navigate = useNavigate();
  useEffect(() => {
    startComponent();
  }, []);
  return (
    <Main title="Questionários">
      <h1 className="questionarios-title">Todos ativos</h1>
      <ul className="questionarios-list">
        {questionnaires.map((questionnaire) => (
          <li key={questionnaire.id}>
            <Link to={routes_helpers.mountQuestionnaireGet(questionnaire.id)}>
              <p>{questionnaire.name}</p>
            </Link>
            <section className="buttons-section">
              <button type="button" className="clone">
                Duplicar
              </button>
              <button type="button" className="update">
                Atualizar
              </button>
              <button type="button" className="remove">
                Excluir
              </button>
            </section>
          </li>
        ))}
      </ul>
      <button
        className="add"
        onClick={() => navigate(routes_constraints.QUESTIONNAIRE_CREATE)}
      >
        +
      </button>
    </Main>
  );
};
