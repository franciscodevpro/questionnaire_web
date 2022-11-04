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

  const newQuestionnaire = async () => {
    const appliers = await findAllAppliers();
    setAppliers(appliers);
    setData({
      id: "",
      name: "",
      image: "",
      quantity: "",
      endDate: "",
      link: "",
      exceedsQuantity: false,
      canBeOnline: "",
      devices: [],
      appliers: [],
      questions: [],
    });
  };

  const changeDataValue = (
    key: keyof QuestionnaireResponseType,
    value: any
  ) => {
    if (!!data) setData({ ...data, [key]: value });
  };

  const changeAppliers = (
    { id, name }: { id: string; name: string },
    present: boolean
  ) => {
    const appliers: { id: string; name: string }[] | undefined = present
      ? data?.appliers.find((el) => el.id === id)
        ? data?.appliers
        : [...(data?.appliers || []), { id, name }]
      : data?.appliers.filter((elm) => elm.id !== id);
    if (!!data) setData({ ...data, appliers: appliers || data.appliers });
  };

  const getDada = async (id: string) => {
    if (type === "create") return;
    const questionnaire = await getSpecificQuestionnaire(id);
    setData(questionnaire);
  };
  const addQuestion = () => {
    const newData = { ...data };
    newData.questions?.push({
      id: `new:${crypto.randomUUID()}`,
      idQuestionnaire: "",
      title: "",
      variable: "",
      type: "",
      minAnswers: 0,
      maxAnswers: 0,
      defaultValue: "",
      shuffle: false,
      prioritizeBySelection: false,
      isActive: false,
      answerOptions: [],
    });
    setData(newData as any);
  };
  const removeQuestion = (id: string) => {
    console.log("Removendo questão: " + id);
    const newData = { ...data };
    newData.questions = data?.questions?.filter(
      (question) => question.id !== id
    );
    setData(newData as any);
  };
  useEffect(() => {
    if (id) getDada(id);
    else newQuestionnaire();
  }, []);
  return (
    <Main title="Questionário - salvar">
      <div className="main-button">
        <button
          className="save-questionnaire"
          onClick={() => console.log(JSON.stringify(data, null, 1))}
        >
          Salvar questionário
        </button>
      </div>
      <form className="questionnaire-form">
        <p className="name">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            name="name"
            defaultValue={data?.name}
            onChange={(evt) => changeDataValue("name", evt.target.value)}
          />
        </p>
        <p className="quantity">
          <label htmlFor="quantity">Quantidade limite:</label>
          <input
            type="number"
            name="quantity"
            defaultValue={data?.quantity}
            onChange={(evt) => changeDataValue("quantity", evt.target.value)}
          />
        </p>
        <p className="endDate">
          <label htmlFor="endDate">Data de término:</label>
          <input
            type="text"
            name="endDate"
            defaultValue={data?.endDate}
            onChange={(evt) => changeDataValue("endDate", evt.target.value)}
          />
        </p>
        <p className="exceedsQuantity checkbox-item">
          <label htmlFor="exceedsQuantity">Exeder limite</label>
          <input
            type="checkbox"
            name="exceedsQuantity"
            value="true"
            defaultChecked={data?.exceedsQuantity}
            onChange={(evt) =>
              changeDataValue("exceedsQuantity", evt.target.checked)
            }
          />
        </p>
        <p className="canBeOnline checkbox-item">
          <label htmlFor="canBeOnline">Pode ser respondido online</label>
          <input
            type="checkbox"
            name="canBeOnline"
            value="true"
            defaultChecked={!!data?.canBeOnline}
            onChange={(evt) =>
              changeDataValue("canBeOnline", evt.target.checked)
            }
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
                  onChange={(evt) =>
                    changeAppliers(
                      { id: applier.id, name: applier.name },
                      evt.target.checked
                    )
                  }
                />
              </p>
            ))}
          </>
        </fieldset>
        <fieldset className="questions-section">
          <legend>Perguntas</legend>
          {data?.questions?.map?.((question) => (
            <Question
              {...question}
              key={question.id}
              onClickInRemove={() => removeQuestion(question.id)}
            />
          ))}
        </fieldset>
      </form>
      <button className="add" onClick={() => addQuestion()}>
        +
      </button>
    </Main>
  );
};
