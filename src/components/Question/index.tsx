import { FiXCircle } from "@react-icons/all-files/fi/FiXCircle";
import { useState } from "react";
import { QuestionResponseType } from "../../types/question";
import "./styles.css";

type QuestionProps = Partial<QuestionResponseType> & {};

export const Question = ({
  id,
  idQuestionnaire,
  title = "",
  variable = "",
  type = "",
  minAnswers,
  maxAnswers,
  defaultValue,
  shuffle,
  prioritizeBySelection,
  isActive,
  answerOptions = [],
}: QuestionProps) => {
  const [questinData, setQuestionData] = useState({
    id,
    idQuestionnaire,
    title,
    variable,
    type,
    minAnswers,
    maxAnswers,
    defaultValue,
    shuffle,
    prioritizeBySelection,
    isActive,
    answerOptions,
  });
  const changeOneOfValues = (key: keyof QuestionResponseType, value: any) =>
    setQuestionData({ ...questinData, [key]: value });
  const handleChangeValue =
    (key: keyof QuestionResponseType) => (value: any) => {
      console.log({ key, value });
      changeOneOfValues(key, value);
    };
  return (
    <section className="question-section">
      <p className="title">
        <label htmlFor="title">Pergunta:</label>
        <input type="text" name="title" defaultValue={title} />
      </p>
      <p className="type">
        <label htmlFor="type">Tipo:</label>
        <select
          name="type"
          defaultValue={type}
          onChange={handleChangeValue("type")}
        >
          <option defaultValue={1}>Escolha única</option>
          <option defaultValue={2}>Multipla escolha</option>
          <option defaultValue={3}>Subjetiva</option>
        </select>
      </p>
      <p className="variable">
        <label htmlFor="variable">Nome da variável:</label>
        <input type="text" name="variable" defaultValue={variable} />
      </p>
      {type !== "3" && (
        <section>
          <label>Opções de resposta:</label>
          {answerOptions.map?.((answerOption) => (
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
      )}
      <div className="buttons">
        <button className="remove">Remover</button>
      </div>
    </section>
  );
};
