import { FiXCircle } from "@react-icons/all-files/fi/FiXCircle";
import { useState } from "react";
import { QuestionResponseType } from "../../types/question";
import "./styles.css";

type QuestionProps = Partial<QuestionResponseType> & {
  onChangeValue?: (value: Partial<QuestionResponseType>) => void;
  onClickInRemove?: () => void;
};

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
  onChangeValue,
  onClickInRemove,
}: QuestionProps) => {
  const [questinData, setQuestionData] = useState<
    Partial<QuestionResponseType>
  >({
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
  const changeOneOfValues = (
    key: keyof QuestionResponseType | string,
    value: any
  ) => {
    if (/.+\[.+\]\./.test(key)) {
      const ke = key.replace(/\[.+/, "") as "answerOptions";
      const id = key.replace(/.+\[/, "").replace(/\].+/, "");
      const k = key.replace(/.+\]\./, "");
      const newArray = questinData[ke]?.map((e: any) => {
        if (e.id !== id) return e;
        else return { ...e, [k]: value };
      });
      setQuestionData({
        ...questinData,
        [ke]: newArray,
      });
    } else setQuestionData({ ...questinData, [key]: value });
  };

  const handleChangeValue =
    (key: keyof QuestionResponseType | string) => (evt: any) => {
      if (!evt?.target?.value) return;
      changeOneOfValues(key, evt.target.value);
      onChangeValue?.(questinData);
    };

  const createNewAnswerOption = (evt: any) => {
    const value = evt?.target?.value;
    if (!value) return;
    const newQuestionData = { ...questinData };
    newQuestionData.answerOptions?.push({
      id: `new:${crypto.randomUUID()}`,
      idQuestion: questinData?.id as string,
      isActive: true,
      status: true,
      title: value,
    });
    setQuestionData(newQuestionData);
    onChangeValue?.(questinData);
  };

  const excludeAnswerOption = (id: string) => {
    const newQuestionData = { ...questinData };
    newQuestionData.answerOptions = questinData.answerOptions?.filter(
      (elm) => elm.id !== id
    );
    setQuestionData(newQuestionData);
    onChangeValue?.(questinData);
  };
  return (
    <section className="question-section">
      <p className="title">
        <label htmlFor="title">Pergunta:</label>
        <input
          type="text"
          name="title"
          defaultValue={questinData.title}
          onChange={handleChangeValue("title")}
        />
      </p>
      <p className="type">
        <label htmlFor="type">Tipo:</label>
        <select
          name="type"
          defaultValue={questinData.type}
          onChange={handleChangeValue("type")}
        >
          <option value="1">Escolha única</option>
          <option value="2">Multipla escolha</option>
          <option value="3">Subjetiva</option>
        </select>
      </p>
      <p className="variable">
        <label htmlFor="variable">Nome da variável:</label>
        <input
          type="text"
          name="variable"
          defaultValue={questinData.variable}
          onChange={handleChangeValue("variable")}
        />
      </p>
      {questinData.type !== "3" && (
        <section>
          <label>Opções de resposta:</label>
          {questinData?.answerOptions?.map?.((answerOption) => (
            <p className="answerOptions" key={answerOption.id}>
              <input
                type="text"
                name="answerOptions"
                defaultValue={answerOption.title}
                onChange={handleChangeValue(
                  `answerOptions[${answerOption.id}].title`
                )}
              />
              <button
                type="button"
                onClick={() => excludeAnswerOption(answerOption.id)}
              >
                <FiXCircle size={20} />
              </button>
            </p>
          ))}
          <p className="answerOptions">
            <input
              type="text"
              name="answerOptions"
              onBlur={createNewAnswerOption}
            />
          </p>
        </section>
      )}
      <div className="buttons">
        <button className="remove" type="button" onClick={onClickInRemove}>
          Remover
        </button>
      </div>
    </section>
  );
};
