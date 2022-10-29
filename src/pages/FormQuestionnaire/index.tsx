import { FiXCircle } from "@react-icons/all-files/fi/FiXCircle";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findAllAppliers } from "../../api/appliers";
import { getSpecificQuestionnaire } from "../../api/questionnaire";
import { Main } from "../../components/Main";
import { Question } from "../../components/Question";
import { ApplierResponseType } from "../../types/applier";
import { QuestionResponseType } from "../../types/question";
import { QuestionnaireResponseType } from "../../types/questionnaire";
import "./styles.css";

type FormQuestionnaireProps = {
  type?: "create" | "update";
};

export const FormQuestionnaire = ({
  type = "create",
}: FormQuestionnaireProps) => {
  const { id } = useParams();
  const [data, setData] = useState<
    | (QuestionnaireResponseType & Record<"questions", QuestionResponseType[]>)
    | null
  >(null);
  const [appliers, setAppliers] = useState<ApplierResponseType[] | null>(null);

  const getDada = async (id: string) => {
    if (type === "create") return;
    const questionnaire = await getSpecificQuestionnaire(id);
    const appliers = await findAllAppliers();
    setData(questionnaire);
    setAppliers(appliers);
  };
  useEffect(() => {
    if (id) getDada(id);
  }, []);
  return (
    <Main title="Questionário - salvar">
      <div className="main-button">
        <button className="save-questionnaire">Salvar questionário</button>
      </div>
      <form className="questionnaire-form">
        <p className="name">
          <label htmlFor="name">Nome:</label>
          <input type="text" name="name" defaultValue={data?.name} />
        </p>
        <p className="quantity">
          <label htmlFor="quantity">Quantidade limite:</label>
          <input type="number" name="quantity" defaultValue={data?.quantity} />
        </p>
        <p className="endDate">
          <label htmlFor="endDate">Data de término:</label>
          <input type="text" name="endDate" defaultValue={data?.endDate} />
        </p>
        <p className="exceedsQuantity checkbox-item">
          <label htmlFor="exceedsQuantity">Exeder limite</label>
          <input
            type="checkbox"
            name="exceedsQuantity"
            value="true"
            defaultChecked={data?.exceedsQuantity}
          />
        </p>
        <p className="canBeOnline checkbox-item">
          <label htmlFor="canBeOnline">Pode ser respondido online</label>
          <input
            type="checkbox"
            name="canBeOnline"
            value="true"
            defaultChecked={!!data?.canBeOnline}
          />
        </p>
        <fieldset className="appliers-section">
          <legend>Entrevistadores</legend>
          <>
            {appliers?.map?.((applier) => (
              <p className="appliers checkbox-item" key={applier.id}>
                <label htmlFor="appliers">{applier.name}</label>
                <input
                  type="checkbox"
                  name="appliers"
                  value={applier.id}
                  defaultChecked={
                    !!data?.appliers.find((appl) => appl.id === applier.id)
                  }
                />
              </p>
            ))}
          </>
        </fieldset>
        <fieldset className="questions-section">
          <legend>Perguntas</legend>
          {data?.questions?.map?.((question) => (
            <section key={question.id}>
              <p className="title">
                <label htmlFor="title">Pergunta:</label>
                <input type="text" name="title" defaultValue={question.title} />
              </p>
              <p className="type">
                <label htmlFor="type">Tipo:</label>
                <select name="type" defaultValue={question.type}>
                  <option defaultValue={1}>Escolha única</option>
                  <option defaultValue={2}>Multipla escolha</option>
                  <option defaultValue={3}>Subjetiva</option>
                </select>
              </p>
              <p className="variable">
                <label htmlFor="variable">Nome da variável:</label>
                <input
                  type="text"
                  name="variable"
                  defaultValue={question.variable}
                />
              </p>
              <section>
                <label>Opções de resposta:</label>
                {question.answerOptions.map?.((answerOption) => (
                  <p className="answerOptions" key={answerOption.id}>
                    <input
                      type="text"
                      name="answerOptions"
                      defaultValue={answerOption.title}
                    />
                    <button type="button">
                      <FiXCircle size={20} />
                    </button>
                  </p>
                ))}
                <p className="answerOptions">
                  <input type="text" name="answerOptions" />
                </p>
              </section>
              <div className="buttons">
                <button className="remove">Remover</button>
              </div>
            </section>
          ))}
          <Question />
        </fieldset>
      </form>
      <button className="add">+</button>
    </Main>
  );
};
