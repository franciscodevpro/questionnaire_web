import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  deleteAnswerOption,
  saveAnswerOption,
  updateAnswerOption,
} from "../../api/answerOption";
import { findAllAppliers } from "../../api/appliers";
import { saveQuestion, updateQuestion } from "../../api/question";
import {
  getSpecificQuestionnaire,
  saveQuestionnaire,
  updateQuestionnaire,
} from "../../api/questionnaire";
import { Main } from "../../components/Main";
import { Question } from "../../components/Question";
import {
  AnswerOptionRequestType,
  AnswerOptionResponseType,
} from "../../types/answerOption";
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
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [deletedAnswerOptions, setDeletedAnswerOptions] = useState<string[]>(
    []
  );
  const [appliers, setAppliers] = useState<ApplierResponseType[] | null>(null);

  const deleteRemovedData = () => {
    return new Promise(async (resolve) => {
      if (!!deletedAnswerOptions.length)
        await Promise.all(
          deletedAnswerOptions.map(async (id) => {
            await deleteAnswerOption(id);
          })
        );
      if (!!deletedQuestions.length)
        await Promise.all(
          deletedQuestions.map(async (id) => {
            await deleteAnswerOption(id);
          })
        );
      return resolve(null);
    });
  };

  const createAnswerOptions = (answerOptions: AnswerOptionRequestType[]) =>
    new Promise(async (resolve) => {
      await Promise.all(
        answerOptions.map(async (answerOption) => {
          const { idQuestion, title, status } = answerOption;
          await saveAnswerOption({
            idQuestion,
            title,
            status,
          });
        })
      );
      return resolve(null);
    });

  const changeAnswerOptions = (answerOptions: AnswerOptionResponseType[]) =>
    new Promise(async (resolve) => {
      await Promise.all(
        answerOptions.map(async (answerOption) => {
          const { id, idQuestion, title, status } = answerOption;
          if (id.includes("new:"))
            await saveAnswerOption({
              idQuestion,
              title,
              status,
            });
          else if (id.includes("update:"))
            await updateAnswerOption(id.split(":")[1], {
              idQuestion,
              title,
              status,
            });
        })
      );
      return resolve(null);
    });

  const createQuestions = async (questions: QuestionResponseType[]) =>
    new Promise(async (resolve) => {
      await Promise.all(
        questions.map(async (question) => {
          const {
            idQuestionnaire,
            title,
            variable,
            type,
            minAnswers,
            maxAnswers,
            defaultValue,
            shuffle,
            prioritizeBySelection,
            answerOptions,
          } = question;
          const questionResponse = await saveQuestion({
            idQuestionnaire,
            title,
            variable,
            type,
            minAnswers,
            maxAnswers,
            defaultValue,
            shuffle,
            prioritizeBySelection,
          });
          await createAnswerOptions(
            answerOptions.map((el) => ({
              ...el,
              idQuestion: questionResponse.id,
            }))
          );
          return;
        })
      );
      return resolve(null);
    });

  const changeQuestions = async (questions: QuestionResponseType[]) =>
    new Promise(async (resolve) => {
      await Promise.all(
        questions.map(async (question) => {
          let {
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
            answerOptions,
          } = question;
          if (id.includes("new:")) {
            const result = await updateQuestion(id.split(":")[1], {
              idQuestionnaire,
              title,
              variable,
              type,
              minAnswers,
              maxAnswers,
              defaultValue,
              shuffle,
              prioritizeBySelection,
            });
            id = result.id;

            await createAnswerOptions(
              answerOptions.map((el) => ({
                ...el,
                idQuestion: id,
              }))
            );
          } else if (id.includes("update:")) {
            await updateQuestion(id.split(":")[1], {
              idQuestionnaire,
              title,
              variable,
              type,
              minAnswers,
              maxAnswers,
              defaultValue,
              shuffle,
              prioritizeBySelection,
            });

            await changeAnswerOptions(
              answerOptions.map((el) => ({
                ...el,
                idQuestion: id,
              }))
            );
          }

          await changeAnswerOptions(
            answerOptions.map((el) => ({
              ...el,
              idQuestion: id,
            }))
          );

          return;
        })
      );
      return resolve(null);
    });

  const createQuestionnaire = async () => {
    if (!data) return;
    const {
      name,
      image,
      quantity,
      endDate,
      link,
      exceedsQuantity,
      canBeOnline,
      devices,
      appliers,
      questions,
    } = data;
    const questionnaire = await saveQuestionnaire({
      name,
      image,
      quantity,
      endDate,
      link,
      exceedsQuantity,
      canBeOnline,
      deviceIds: devices.map((el) => el.id),
      applierIds: appliers.map((el) => el.id),
    });
    await createQuestions(
      questions.map((el) => ({ ...el, idQuestionnaire: questionnaire.id }))
    );
    alert("Questionário criado com sucesso!");
  };

  const changeQuestionnaire = async () => {
    if (!data) return;
    const {
      id,
      name,
      image,
      quantity,
      endDate,
      link,
      exceedsQuantity,
      canBeOnline,
      devices,
      appliers,
      questions,
    } = data;
    if (id.includes("update:"))
      await updateQuestionnaire(id.split(":")[1], {
        name,
        image,
        quantity,
        endDate,
        link,
        exceedsQuantity,
        canBeOnline,
        deviceIds: devices.map((el) => el.id),
        applierIds: appliers.map((el) => el.id),
      });
    console.log({ deletedAnswerOptions, deletedQuestions });
    await deleteRemovedData();
    await changeQuestions(
      questions.map((el) => ({ ...el, idQuestionnaire: id }))
    );
    alert("Questionário atualizado com sucesso!");
  };

  const handleSaveQuestionnaire = async () => {
    console.log(data);
    if (!data?.id) return await createQuestionnaire();
    return await changeQuestionnaire();
  };

  const newQuestionnaire = async () => {
    const appliers = await findAllAppliers();
    setAppliers(appliers);
    setData({
      id: "",
      name: "",
      image: "",
      quantity: 0,
      endDate: "",
      link: "",
      exceedsQuantity: false,
      canBeOnline: false,
      devices: [],
      appliers: [],
      questions: [],
    });
  };

  const changeDataValue = (
    key: keyof QuestionnaireResponseType,
    value: any
  ) => {
    let questionnaireId = data?.id || "";
    if (!!questionnaireId && !questionnaireId.includes(":"))
      questionnaireId = "update:" + data?.id;
    if (!!data) setData({ ...data, [key]: value, id: questionnaireId });
  };

  const changeAppliers = (
    { id, name }: { id: string; name: string },
    present: boolean
  ) => {
    let questionnaireId = data?.id || "";
    if (!!questionnaireId && !questionnaireId.includes(":"))
      questionnaireId = "update:" + data?.id;
    const appliers: { id: string; name: string }[] | undefined = present
      ? data?.appliers.find((el) => el.id === id)
        ? data?.appliers
        : [...(data?.appliers || []), { id, name }]
      : data?.appliers.filter((elm) => elm.id !== id);
    if (!!data)
      setData({
        ...data,
        appliers: appliers || data.appliers,
        id: questionnaireId,
      });
  };

  const getDada = async (id: string) => {
    if (type === "create") return;
    const appliers = await findAllAppliers();
    setAppliers(appliers);
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
    const newData = { ...data };
    newData.questions = data?.questions?.filter(
      (question) => question.id !== id
    );
    setDeletedQuestions([...deletedQuestions, id]);
    setData(newData as any);
  };
  const removeAnswerOption = (id: string) => {
    if (id.includes(":") || deletedAnswerOptions.find((elm) => elm === id))
      return;
    setDeletedAnswerOptions([...deletedAnswerOptions, id]);
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
          onClick={handleSaveQuestionnaire}
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
            checked={data?.exceedsQuantity}
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
            checked={!!data?.canBeOnline}
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
                  checked={
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
              onRemoveAnswerOption={(id) => removeAnswerOption(id)}
              onChangeValue={(question) => {
                setData({
                  ...data,
                  questions: data.questions.map((quest) => {
                    if (
                      quest.id === question.id ||
                      "update:" + quest.id === question.id
                    )
                      return question;
                    return quest;
                  }),
                });
              }}
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
