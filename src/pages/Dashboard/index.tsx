import { Chart as ChartJS } from "chart.js/auto";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
const chartJS = ChartJS;

const parseDateTime = (date: string) => {
  return new Date(new Date(date).toLocaleString());
};

const formatDate = (date: Date) => {
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

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
  const [chartByDay, setChartByDay] = useState<{
    labels: string[];
    data: (string | number)[];
  }>({ labels: [], data: [] });
  const [chartByHour, setChartByHour] = useState<{
    labels: (string | number)[];
    data: (string | number)[];
  }>({ labels: [], data: [] });

  const populateChartByHourData = (
    questionnaireDataResult: QuestionnaireDataResponseType[]
  ) => {
    setChartByHour({ labels: [], data: [] });
    if (!questionnaireDataResult?.[0]) return;
    const questionnairesByHour = _.groupBy(questionnaireDataResult, (elm) =>
      parseDateTime(elm.createdAt).getHours()
    );
    const labels = Array.from({ length: 24 }).map((_, k) => k);
    const data = labels.map((elm) => questionnairesByHour[elm]?.length);

    setChartByHour({
      labels,
      data,
    });
  };

  const populateChartByDayData = (
    questionnaireDataResult: QuestionnaireDataResponseType[]
  ) => {
    setChartByDay({ labels: [], data: [] });
    if (!questionnaireDataResult?.[0]) return;
    const questionnairesByDay = _.groupBy(
      questionnaireDataResult,
      (elm) => parseDateTime(elm.createdAt).toLocaleString().split(",")[0]
    );
    const labels = Object.keys(questionnairesByDay);
    const data = labels.map((elm) => questionnairesByDay[elm].length);

    setChartByDay({
      labels: labels
        .filter((_, key) => key < 7)
        .map((elm) => elm.replace(/(\w+)\W(\w+)\W(\w+)/i, "$2/$1/$3")),
      data: data.filter((_, key) => key < 7),
    });
  };

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
        const lastQuestionnaireDate = parseDateTime(elm.createdAt);
        return {
          autor: elm.applier.name,
          data: formatDate(lastQuestionnaireDate),
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
    const questionnairesByDay = _.groupBy(
      questionnaireDataResult,
      (elm) => elm.createdAt.split("T")[0]
    );
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
        (elm) => elm.createdAt.split("T")[0]
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
      const lastQuestionnaireDate = parseDateTime(lastQuestionnaire);
      return {
        autor: applierName,
        total: appliersTotal[applierName].length,
        "coletas por dia": statsByDay,
        "duração média":
          appliersTotal[applierName]
            .map((elm) => elm.duration)
            .reduce((prev, current) => prev + current) /
          appliersTotal[applierName].length,
        "última coleta": lastQuestionnaire && formatDate(lastQuestionnaireDate),
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
    populateChartByDayData(questionnaireDataResult);
    populateChartByHourData(questionnaireDataResult);

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
                marginBottom: 96,
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
              gap: 16,
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
                style={{
                  flex: 1,
                }}
              />
            )}

            {lastQuestionnaires && (
              <Table
                title={"Últimas coletas recebidas"}
                columns={["autor", "data"]}
                data={lastQuestionnaires}
                style={{
                  flex: 1,
                }}
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

          <Bar
            style={{ marginTop: 96 }}
            data={{
              labels: chartByDay.labels,
              datasets: [
                {
                  label: "Questionários por dia",
                  data: chartByDay.data,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                  ],
                  borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgb(153, 102, 255)",
                    "rgb(201, 203, 207)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />

          <Bar
            style={{ marginTop: 96 }}
            data={{
              labels: chartByHour.labels,
              datasets: [
                {
                  label: "Questionários por hora",
                  data: chartByHour.data,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                  ],
                  borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgb(153, 102, 255)",
                    "rgb(201, 203, 207)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
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
