import _ from "lodash";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { getSpecificQuestionnaire } from "../../api/questionnaire";
import { findAllQuestionnaireData } from "../../api/questionnaireData";
import { Main } from "../../components/Main";
import { Table } from "../../components/Table";
import { QuestionResponseType } from "../../types/question";
import { QuestionnaireResponseType } from "../../types/questionnaire";
import { QuestionnaireDataResponseType } from "../../types/questionnaireData";
import "./styles.css";

export const Dashboard = () => {
  const { id } = useParams();
  const [questionnaire, setQuestionnaire] = useState<
    | (QuestionnaireResponseType & Record<"questions", QuestionResponseType[]>)
    | null
  >(null);
  const [questionnaireData, setQuestionnaireData] = useState<
    QuestionnaireDataResponseType[] | null
  >(null);
  const [center, setCenter] = useState<[number, number] | null>();
  const [appliersStats, setAppliersStats] = useState<
    | {
        autor: string;
        total: string;
        "coletas por dia": string;
        "duração média": string;
        "última coleta": string;
      }[]
    | null
  >([
    {
      autor: "",
      total: "",
      "coletas por dia": "",
      "duração média": "",
      "última coleta": "",
    },
  ]);
  const [generalStats, setGeneralStats] = useState<
    [string | number, string | number, string | number] | null
  >(["", "", ""]);
  const [lastQuestionnaires, setLastQuestionnaires] = useState<
    { data: string; autor: string }[]
  >([
    { data: "", autor: "" },
    { data: "", autor: "" },
    { data: "", autor: "" },
  ]);

  const populateLastQuestionnaire = (
    questionnaireDataResult: QuestionnaireDataResponseType[]
  ) => {
    setLastQuestionnaires([
      { data: "", autor: "" },
      { data: "", autor: "" },
      { data: "", autor: "" },
    ]);
    const lastQuestionnairesData = _.orderBy(
      questionnaireDataResult,
      "createdAt",
      "desc"
    );
    const resultData = lastQuestionnairesData
      .filter((_, key) => key < 3)
      .map((elm) => {
        const lastQuestionnaireDate = new Date(
          new Date(elm.createdAt).toISOString()
        );
        return {
          autor: elm.applier.name,
          data: `${lastQuestionnaireDate.getDate()}/${
            lastQuestionnaireDate.getMonth() + 1
          }/${lastQuestionnaireDate.getFullYear()} ${lastQuestionnaireDate.getHours()}:${lastQuestionnaireDate.getMinutes()}`,
        };
      });
    setLastQuestionnaires(resultData);
  };

  const populateGeneralData = (
    questionnaireDataResult: QuestionnaireDataResponseType[]
  ) => {
    setGeneralStats(["", "", ""]);
    if (!questionnaireDataResult?.[0]) return;
    const total = questionnaireDataResult.length;
    const questionnairesByDay = _.groupBy(questionnaireDataResult, "createdAt");
    const questionnairesByDayKeys = Object.keys(questionnairesByDay);
    const statsByDay =
      questionnairesByDayKeys
        .map((elm) => questionnairesByDay[elm].length)
        .reduce((prev, current) => prev + current) /
      questionnairesByDayKeys.length;
    const statsDuration =
      questionnaireDataResult
        .map((elm) => elm.duration)
        .reduce((prev, current) => prev + current) /
      questionnaireDataResult.length;

    setGeneralStats([total, statsByDay, statsDuration]);
  };

  const populateAppliersData = (
    questionnaireDataResult: QuestionnaireDataResponseType[]
  ) => {
    setAppliersStats([
      {
        autor: "",
        total: "",
        "coletas por dia": "",
        "duração média": "",
        "última coleta": "",
      },
    ]);
    let resultData: any = [];
    const appliersTotal = _.groupBy(questionnaireDataResult, "applier.name");
    const applierNames = Object.keys(appliersTotal);
    resultData = applierNames.map((applierName) => {
      const questionnairesByDay = _.groupBy(
        appliersTotal[applierName],
        "createdAt"
      );
      const questionnairesByDayKeys = Object.keys(questionnairesByDay);
      const statsByDay =
        questionnairesByDayKeys
          .map((elm) => questionnairesByDay[elm].length)
          .reduce((prev, current) => prev + current) /
        questionnairesByDayKeys.length;
      const lastQuestionnaire = _.orderBy(
        appliersTotal[applierName],
        "createdAt",
        "desc"
      )[0].createdAt;
      const lastQuestionnaireDate = new Date(
        new Date(lastQuestionnaire).toISOString()
      );
      return {
        autor: applierName,
        total: appliersTotal[applierName].length,
        "coletas por dia": statsByDay,
        "duração média":
          appliersTotal[applierName]
            .map((elm) => elm.duration)
            .reduce((prev, current) => prev + current) /
          appliersTotal[applierName].length,
        "última coleta":
          lastQuestionnaire &&
          `${lastQuestionnaireDate.getDate()}/${
            lastQuestionnaireDate.getMonth() + 1
          }/${lastQuestionnaireDate.getFullYear()} ${lastQuestionnaireDate.getHours()}:${lastQuestionnaireDate.getMinutes()}`,
      };
    });
    setAppliersStats(resultData);
  };

  const getDada = async (id: string) => {
    const questionnaireResult = await getSpecificQuestionnaire(id);
    setQuestionnaire(questionnaireResult);
    const questionnaireDataResult = await findAllQuestionnaireData(id);
    setQuestionnaireData(questionnaireDataResult);

    populateAppliersData(questionnaireDataResult);
    populateGeneralData(questionnaireDataResult);
    populateLastQuestionnaire(questionnaireDataResult);

    const responseWithCoord = questionnaireDataResult?.find(
      (elm) => !!elm.lat && !!elm.lon
    );
    if (!responseWithCoord?.lat && !responseWithCoord?.lon) return;
    setCenter([
      parseFloat(responseWithCoord.lat),
      parseFloat(responseWithCoord.lon),
    ]);
  };

  useEffect(() => {
    if (!id) return;
    getDada(id);
  }, [id]);
  return (
    <Main title="Dashboard">
      <section className="dashboard-container">
        <section>
          {center && (
            <div
              style={{
                minHeight: 300,
                width: 600,
                maxWidth: "100%",
                borderRadius: 16,
                overflow: "hidden",
                resize: "both",
                marginBottom: 24,
              }}
            >
              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {questionnaireData
                  ?.filter((element) => !!element.lat && !!element.lon)
                  .map((elm) => (
                    <Marker
                      position={[parseFloat(elm.lat), parseFloat(elm.lon)]}
                      key={elm.id}
                    >
                      <Popup>
                        <strong>{elm.id}</strong>
                        <p>{elm.applier.name}</p>
                        <span>aparelho: {elm.device.name}</span>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              boxSizing: "border-box",
              padding: 10,
            }}
          >
            {generalStats && (
              <Table
                title={"Performce geral"}
                columns={["-", "Performce geral"]}
                hideColumns={true}
                data={[
                  {
                    "-": "Total de respostas",
                    "Performce geral": generalStats[0],
                  },
                  { "-": "Média por dia", "Performce geral": generalStats[1] },
                  { "-": "Tempo médio", "Performce geral": generalStats[2] },
                ]}
                style={{ display: "inline" }}
              />
            )}

            {lastQuestionnaires && (
              <Table
                title={"Últimas coletas recebidas"}
                columns={["autor", "data"]}
                data={lastQuestionnaires}
                style={{ display: "inline" }}
              />
            )}
          </div>

          {appliersStats && (
            <Table
              columns={[
                "autor",
                "total",
                "coletas por dia",
                "duração média",
                "última coleta",
              ]}
              data={appliersStats}
              style={{ width: "calc(100% - 16px)" }}
            />
          )}
        </section>
        <ul>
          {questionnaire?.questions.map((question) => (
            <li key={question.id}>
              <header>{question.title}</header>
            </li>
          ))}
        </ul>
      </section>
    </Main>
  );
};
