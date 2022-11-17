import { PopUp } from "../PopUp";
import "./styles.css";

export const Alert = () => {
  return (
    <PopUp>
      <section className="alert-content">
        <header>
          Tem certeza que deseja excluir a pergunta:
          <br />
          <strong>A qual dos gêneros abaixo você se identifica?</strong>
        </header>
        <main>
          <button className="ok" type="button">
            Sim
          </button>
          <button className="cancel" type="button">
            Cancelar
          </button>
        </main>
      </section>
    </PopUp>
  );
};
