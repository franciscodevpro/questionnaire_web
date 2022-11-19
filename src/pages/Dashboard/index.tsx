import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { getSpecificQuestionnaire } from "../../api/questionnaire";
import { Main } from "../../components/Main";
import { QuestionResponseType } from "../../types/question";
import { QuestionnaireResponseType } from "../../types/questionnaire";
import "./styles.css";

export const Dashboard = () => {
  const { id } = useParams();
  const [data, setData] = useState<
    | (QuestionnaireResponseType & Record<"questions", QuestionResponseType[]>)
    | null
  >(null);
  const getDada = async (id: string) => {
    const questionnaire = await getSpecificQuestionnaire(id);
    setData(questionnaire);
  };
  useEffect(() => {
    if (id) getDada(id);
  }, [id]);
  return (
    <Main title="Dashboard">
      <section className="dashboard-container">
        <section>
          <div
            style={{
              height: 350,
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
              resize: "both",
            }}
          >
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={false}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </section>
        <ul>
          {data?.questions.map((question) => (
            <li key={question.id}>
              <header>{question.title}</header>
            </li>
          ))}
        </ul>
      </section>
    </Main>
  );
};
