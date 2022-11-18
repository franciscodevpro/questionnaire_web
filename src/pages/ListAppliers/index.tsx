import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteApplier } from "../../api/appliers";
import { Main } from "../../components/Main";
import MainContext from "../../contexts/questionnaire-context";
import { confirmationPopup } from "../../util/messages";
import { routes_constraints, routes_helpers } from "../../util/route_utils";
import "./styles.css";

type ListAppliersProps = {};

export const ListAppliers = ({}: ListAppliersProps) => {
  const { appliers, restartContext } = useContext(MainContext);
  const handleDeleteApplier = async (id: string) => {
    const result = confirmationPopup(
      'Tem certeza que deseja excluir o entrevistador: "' +
        appliers?.find((q) => q.id === id)?.name +
        '" ?'
    );
    if (!result) return;
    await deleteApplier(id);
    await restartContext?.();
  };
  const navigate = useNavigate();
  useEffect(() => {
    restartContext?.();
  }, []);

  return (
    <Main title="Entrevistadores">
      <h1 className="questionarios-title">Todos ativos</h1>
      <ul className="questionarios-list">
        {appliers?.map((appliers) => (
          <li key={appliers.id}>
            <Link to={routes_helpers.mountApplierId(appliers.id)}>
              <p>{appliers.name}</p>
            </Link>
            <section className="buttons-section">
              <button
                type="button"
                className="update"
                onClick={() =>
                  navigate(routes_helpers.mountApplierId(appliers.id))
                }
              >
                Atualizar
              </button>
              <button
                type="button"
                className="remove"
                onClick={() => handleDeleteApplier(appliers.id)}
              >
                Excluir
              </button>
            </section>
          </li>
        ))}
      </ul>
      <button
        className="add"
        onClick={() => navigate(routes_constraints.APPLIER_CREATE)}
      >
        +
      </button>
    </Main>
  );
};
