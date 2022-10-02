import { Link } from "react-router-dom";
import { Main } from "../../components/Main";
import "./styles.css";

type ListQuestionnairesProps = {};

export const ListQuestionnaires = ({}: ListQuestionnairesProps) => {
  return (
    <Main title="Questionários">
      <h1 className="questionarios-title">Todos ativos</h1>
      <ul className="questionarios-list">
        <li>
          <Link to={""}>
            <p>Eleições para presidente</p>
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
        <li>
          <Link to={""}>
            <p>Eleições para presidente</p>
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
        <li>
          <Link to={""}>
            <p>Eleições para presidente</p>
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
      </ul>
      <button className="add">+</button>
    </Main>
  );
};
