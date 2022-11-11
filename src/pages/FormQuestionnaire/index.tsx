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
      console.log("Removendo dados deletados...");
      if (!!deletedAnswerOptions.length)
        await Promise.all(
          deletedAnswerOptions.map(async (id) => {
            console.log("Deletando opção de resposta: " + id);
            await deleteAnswerOption(id);
          })
        );
      if (!!deletedQuestions.length)
        await Promise.all(
          deletedQuestions.map(async (id) => {
            console.log("Deletando pergunta: " + id);
            await deleteAnswerOption(id);
          })
        );
      return resolve(null);
    });
  };

  const createAnswerOptions = (answerOptions: AnswerOptionRequestType[]) =>
    new Promise(async (resolve) => {
      console.log("Adicionando opções...");
      await Promise.all(
        answerOptions.map(async (answerOption) => {
          console.log("Adicionando opção: " + answerOption?.title);
          const { idQuestion, title, status } = answerOption;
          await saveAnswerOption({
            idQuestion,
            title,
            status,
          });
        })
      );
      console.log("Opções adicionadas");
      return resolve(null);
    });

  const changeAnswerOptions = (answerOptions: AnswerOptionResponseType[]) =>
    new Promise(async (resolve) => {
      console.log("Alterando opções...");
      await Promise.all(
        answerOptions.map(async (answerOption) => {
          console.log("Alterando opção: " + answerOption?.title);
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
      console.log("Opções adicionadas");
      return resolve(null);
    });

  const createQuestions = async (questions: QuestionResponseType[]) =>
    new Promise(async (resolve) => {
      console.log("Salvando perguntas");
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
          console.log("Salvando pergunta: " + title);
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
          console.log("Opções já salvas!!!!");
          return;
        })
      );
      console.log("Perguntas salvas com sucesso!");
      return resolve(null);
    });

  const changeQuestions = async (questions: QuestionResponseType[]) =>
    new Promise(async (resolve) => {
      console.log("Atualizando perguntas");
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
          console.log("Salvando pergunta: " + title);
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

          console.log("Opções já salvas!!!!");
          return;
        })
      );
      console.log("Perguntas salvas com sucesso!");
      return resolve(null);
    });

  const createQuestionnaire = async () => {
    console.log("Criando questionário...");
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
  };

  const changeQuestionnaire = async () => {
    console.log("Atualizando questionário...");
    if (!data) return;
    console.log(data);
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
    console.log("Foi: 1");
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
    console.log("Foi: 2");
    await deleteRemovedData();
    console.log("Foi: 3");
    await changeQuestions(
      questions.map((el) => ({ ...el, idQuestionnaire: id }))
    );
  };

  const handleSaveQuestionnaire = async () => {
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
    const appliers = await findAllAppliers();
    setAppliers(appliers);
    const questionnaire = await getSpecificQuestionnaire(id);
    setData(questionnaire);
    console.log(questionnaire);
    console.log(appliers);
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
