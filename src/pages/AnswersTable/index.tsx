import { BiX } from "@react-icons/all-files/bi/BiX";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getReportsQuestionnaireData } from "../../api/reports_questionnaireData";
import { Main } from "../../components/Main";
import { PopUp } from "../../components/PopUp";
import MainContext from "../../contexts/questionnaire-context";
import { AnswerResponseType } from "../../types/answer";
import { QuestionResponseType } from "../../types/question";
import { QuestionnaireResponseType } from "../../types/questionnaire";
import { QuestionnaireDataResponseType } from "../../types/questionnaireData";
import { routes_helpers } from "../../util/route_utils";
import "./styles.css";

export const AnswersTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { questionnaires } = useContext(MainContext);
  const [reportsQuestionnaireData, setReportsQuestionnaireData] = useState<{
    questionnaire: QuestionnaireResponseType;
    questionnaireData: (QuestionnaireDataResponseType & {
      answers?: AnswerResponseType[];
    })[];
    questions: QuestionResponseType[];
    answers: AnswerResponseType[];
  } | null>(null);
  let answOpts: string[] = [];

  const getData = async () => {
    console.log({ id });
    if (!id) return;
    const reportsQuestionnaireDataResult = await getReportsQuestionnaireData(
      id
    );
    console.log({ reportsQuestionnaireDataResult });
    const questionnaireData =
      reportsQuestionnaireDataResult.questionnaireData.map(
        (elementData) =>
          ({
            ...elementData,
            answers: reportsQuestionnaireDataResult.answers.filter(
              (ans) => ans.idQuestionnaireData === elementData.id
            ),
          } as
            | (QuestionnaireDataResponseType & {
                answers?: AnswerResponseType[];
              })
            | any)
      );
    console.log({ questionnaireData });
    setReportsQuestionnaireData({
      ...reportsQuestionnaireDataResult,
      questionnaireData,
    });
  };

  useEffect(() => {
    getData();
  }, [id]);

  const getColumnTotal = () => {
    let totalAnswOpts = 1;
    reportsQuestionnaireData?.questions?.forEach((question) => {
      if (question.type == "1") totalAnswOpts++;
      else if (question.type == "2")
        question.answerOptions?.forEach(() => {
          totalAnswOpts++;
        });
      else totalAnswOpts++;
    });
    return totalAnswOpts;
  };

  return (
    <>
      {!id ? (
        <>
          <Main title=""></Main>
          <PopUp onClose={() => navigate(-1)}>
            <form className="form-applier">
              <button
                type="button"
                className="close-button"
                onClick={() => navigate(-1)}
              >
                <BiX />
              </button>
              <p>
                <label>Escolha o questionário:</label>
                <details className="questionnaireSelect">
                  <summary style={{ cursor: "pointer" }}>
                    <span>Questionários</span>

                    <div className="summary-chevron-up">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-chevron-down"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </summary>
                  <section className="questionnaireSelectContent">
                    {questionnaires.map((questionnaire) => (
                      <Link
                        to={routes_helpers.mountReportsQuestionnaireData(
                          questionnaire.id
                        )}
                      >
                        <p className="questionnaireSelectItem">
                          {questionnaire.name}
                        </p>
                      </Link>
                    ))}
                  </section>
                </details>
              </p>
            </form>
          </PopUp>
        </>
      ) : (
        <Main title="Todas as respostas">
          <section className="reports-questionnaire-data">
            {!!reportsQuestionnaireData && (
              <table>
                <thead>
                  <tr>
                    <th colSpan={getColumnTotal()}>
                      {reportsQuestionnaireData?.questionnaire.name}
                    </th>
                  </tr>
                  <tr>
                    <>
                      <th></th>
                      {reportsQuestionnaireData?.questions?.map((question) => {
                        if (question.type == "1") {
                          const customId = `${
                            question.id
                          }:${question.answerOptions
                            ?.map((answerOption) => answerOption.id)
                            .join(",")}`;
                          answOpts.push(customId);
                          return <th key={customId}>{question.variable}</th>;
                        } else if (question.type == "2") {
                          return question.answerOptions?.map((answerOption) => {
                            answOpts.push(answerOption.id);
                            return (
                              <th key={answerOption.id}>
                                {question.variable}-{answerOption.title}
                              </th>
                            );
                          });
                        } else {
                          answOpts.push(`${question.id}>`);
                          return <th key={question.id}>{question.variable}</th>;
                        }
                      })}
                    </>
                  </tr>
                </thead>
                <tbody>
                  {reportsQuestionnaireData?.questionnaireData.map(
                    (questionnaireDataItem, questionnaireDataKey) => (
                      <tr key={questionnaireDataItem.id}>
                        <td>{questionnaireDataKey + 1}</td>
                        {answOpts.map((answOpt) => (
                          <td key={answOpt}>
                            {new RegExp(":").test(answOpt)
                              ? questionnaireDataItem?.answers?.find((elm) =>
                                  new RegExp(elm?.answerOption?.id).test(
                                    answOpt
                                  )
                                )?.answerOption?.title
                              : !new RegExp(">").test(answOpt)
                              ? questionnaireDataItem?.answers?.find((elm) =>
                                  new RegExp(elm?.answerOption?.id).test(
                                    answOpt
                                  )
                                )?.answerOption && "X"
                              : questionnaireDataItem?.answers?.find((elm) =>
                                  new RegExp(elm?.question.id).test(answOpt)
                                )?.value}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </section>
        </Main>
      )}
    </>
  );
};
