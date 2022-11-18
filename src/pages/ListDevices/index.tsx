import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDevice } from "../../api/devices";
import { Main } from "../../components/Main";
import MainContext from "../../contexts/questionnaire-context";
import { confirmationPopup } from "../../util/messages";
import { routes_constraints, routes_helpers } from "../../util/route_utils";
import "./styles.css";

type ListDevicesProps = {};

export const ListDevices = ({}: ListDevicesProps) => {
  const { devices, restartContext } = useContext(MainContext);
  const handleDeleteDevice = async (id: string) => {
    const result = confirmationPopup(
      'Tem certeza que deseja excluir o aparelho: "' +
        devices?.find((q) => q.id === id)?.name +
        '" ?'
    );
    if (!result) return;
    await deleteDevice(id);
    await restartContext?.();
  };
  const navigate = useNavigate();
  useEffect(() => {
    restartContext?.();
  }, []);

  return (
    <Main title="Aparelhos">
      <h1 className="devices-title">Todos ativos</h1>
      <ul className="devices-list">
        {devices?.map((devices) => (
          <li key={devices.id}>
            <Link to={routes_helpers.mountDeviceId(devices.id)}>
              <p>{devices.name}</p>
            </Link>
            <section className="buttons-section">
              <button type="button" className="clone">
                Duplicar
              </button>
              <button
                type="button"
                className="update"
                onClick={() =>
                  navigate(routes_helpers.mountDeviceId(devices.id))
                }
              >
                Atualizar
              </button>
              <button
                type="button"
                className="remove"
                onClick={() => handleDeleteDevice(devices.id)}
              >
                Excluir
              </button>
            </section>
          </li>
        ))}
      </ul>
      <button
        className="add"
        onClick={() => navigate(routes_constraints.DEVICE_CREATE)}
      >
        +
      </button>
    </Main>
  );
};
