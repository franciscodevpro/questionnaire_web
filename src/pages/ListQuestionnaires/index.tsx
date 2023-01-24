import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteQuestionnaire } from "../../api/questionnaire";
import { Main } from "../../components/Main";
import MainContext from "../../contexts/questionnaire-context";
import { confirmationPopup } from "../../util/messages";
import { routes_constraints, routes_helpers } from "../../util/route_utils";
import "./styles.css";

type ListQuestionnairesProps = {};

export const ListQuestionnaires = ({}: ListQuestionnairesProps) => {
  const { questionnaires, restartContext } = useContext(MainContext);
  const handleDeleteQuestionnaire = async (id: string) => {
    const result = confirmationPopup(
      'Tem certeza que deseja excluir o questionário: "' +
        questionnaires?.find((q) => q.id === id)?.name +
        '" ?'
    );
    if (!result) return;
    await deleteQuestionnaire(id);
    await restartContext?.();
  };
  const navigate = useNavigate();
  useEffect(() => {
    restartContext?.();
  }, []);

  return (
    <Main title="Questionários">
      <div className="questionnaires-container">
        <h1 className="questionarios-title">Todos ativos</h1>
        <ul className="questionarios-list">
          {questionnaires?.map((questionnaire) => (
            <li key={questionnaire.id}>
              <Link
                to={routes_helpers.mountQuestionnaireDashboard(
                  questionnaire.id
                )}
              >
                <p>{questionnaire.name}</p>
              </Link>
              <section className="buttons-section">
                <button type="button" className="clone">
                  Duplicar
                </button>
                <button
                  type="button"
                  className="update"
                  onClick={() =>
                    navigate(
                      routes_helpers.mountQuestionnaireId(questionnaire.id)
                    )
                  }
                >
                  Atualizar
                </button>
                <button
                  type="button"
                  className="remove"
                  onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                >
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
      </div>
    </Main>
  );
};
