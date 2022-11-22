import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { findAllQuestionnaireData } from "../../api/questionnaireData";
import { Main } from "../../components/Main";
import { QuestionnaireDataResponseType } from "../../types/questionnaireData";
import "./styles.css";

export const QuestionnairesMap = () => {
  const { id } = useParams();
  const [center, setCenter] = useState<[number, number] | null>();
  const [questionnaireData, setQuestionnaireData] = useState<
    QuestionnaireDataResponseType[] | null
  >(null);

  const getData = async () => {
    console.log({ id });
    if (!id) return;
    const questionnaireDataResult = await findAllQuestionnaireData(id);
    console.log({ questionnaireDataResult });
    setQuestionnaireData(questionnaireDataResult);
    const responseWithCoord = questionnaireDataResult?.find(
      (elm) => !!elm.lat && !!elm.lon
    );
    console.log({ responseWithCoord });
    if (!responseWithCoord?.lat && !responseWithCoord?.lon) return;
    console.log({
      lat: parseFloat(responseWithCoord.lat),
      lon: parseFloat(responseWithCoord.lon),
    });
    setCenter([
      parseFloat(responseWithCoord.lat),
      parseFloat(responseWithCoord.lon),
    ]);
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <Main title="Mapa do questionário">
      <section className="map-container">
        {center && (
          <div
            style={{
              height: "100%",
              width: "100%",
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
      </section>
    </Main>
  );
};
