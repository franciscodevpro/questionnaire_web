import { Link } from "react-router-dom";
import { Main } from "../../components/Main";
import "./styles.css";

type CreateQuestionnaireProps = {};

export const CreateQuestionnaire = ({}: CreateQuestionnaireProps) => {
  return (
    <Main title="Questionário - salvar">
      <div className="main-button">
        <button className="save-questionnaire">Salvar questionário</button>
      </div>
      <form className="questionnaire-form">
        <p className="name">
          <label htmlFor="name">Nome:</label>
          <input type="text" name="name" value="Eleições para presidente" />
        </p>
        <p className="quantity">
          <label htmlFor="quantity">Quantidade limite:</label>
          <input type="number" name="quantity" />
        </p>
        <p className="endDate">
          <label htmlFor="endDate">Data de término:</label>
          <input type="text" name="endDate" />
        </p>
        <p className="exceedsQuantity checkbox-item">
          <label htmlFor="exceedsQuantity">Exeder limite</label>
          <input type="checkbox" name="exceedsQuantity" value="true" />
        </p>
        <p className="canBeOnline checkbox-item">
          <label htmlFor="canBeOnline">Pode ser respondido online</label>
          <input type="checkbox" name="canBeOnline" value="true" />
        </p>
        <fieldset className="appliers-section">
          <legend>Entrevistadores</legend>
          <p className="appliers checkbox-item">
            <label htmlFor="appliers">Daniel Pereira</label>
            <input type="checkbox" name="appliers" value="54614164" />
          </p>
          <p className="appliers checkbox-item">
            <label htmlFor="appliers">Gabriel Pereira</label>
            <input type="checkbox" name="appliers" value="54614165" />
          </p>
        </fieldset>
        <fieldset className="questions-section">
          <legend>Perguntas</legend>
          <section>
            <p className="title">
              <label htmlFor="title">Pergunta:</label>
              <input type="text" name="title" />
            </p>
            <p className="type">
              <label htmlFor="type">Tipo:</label>
              <input type="text" name="type" />
            </p>
            <p className="variable">
              <label htmlFor="variable">Nome da variável:</label>
              <input type="text" name="variable" />
            </p>
            <section>
              <label>Opções de resposta:</label>
              <p className="answerOptions">
                <input type="text" name="answerOptions" value="Masculino" />
              </p>
              <p className="answerOptions">
                <input type="text" name="answerOptions" value="Feminino" />
              </p>
              <p className="answerOptions">
                <input
                  type="text"
                  name="answerOptions"
                  value="Não identificado"
                />
              </p>
              <p className="answerOptions">
                <input type="text" name="answerOptions" />
              </p>
            </section>
            <div className="buttons">
              <button className="remove">Remover</button>
            </div>
          </section>
        </fieldset>
      </form>
      <button className="add">+</button>
    </Main>
  );
};
