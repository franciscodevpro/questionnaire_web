import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { getSpecificQuestionnaire } from "../../api/questionnaire";
import { findAllQuestionnaireData } from "../../api/questionnaireData";
import { Main } from "../../components/Main";
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
  const getDada = async (id: string) => {
    const questionnaireResult = await getSpecificQuestionnaire(id);
    setQuestionnaire(questionnaireResult);
    const questionnaireDataResult = await findAllQuestionnaireData(id);
    setQuestionnaireData(questionnaireDataResult);
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

          <div>
            {questionnaireData
              ?.filter((element) => !!element.audioPath)
              .map((elm) => (
                <p key={elm.id}>
                  {elm.audioPath}
                  <audio controls autoPlay={false}>
                    <source src={elm.audioPath} />
                  </audio>
                </p>
              ))}
          </div>
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
