import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveDevice, updateDevice } from "../../api/devices";
import { PopUp } from "../../components/PopUp";
import MainContext from "../../contexts/questionnaire-context";
import { DeviceRequestResultType, DeviceRequestType } from "../../types/device";
import { successMessagePopup } from "../../util/messages";
import { routes_constraints } from "../../util/route_utils";
import { ListDevices } from "../ListDevices";
import "./styles.css";

export const FormDevice = () => {
  const { id } = useParams();
  const { devices } = useContext(MainContext);
  const navigate = useNavigate();
  const [device, setDevice] = useState<Partial<DeviceRequestResultType> | null>(
    null
  );

  const createDevice = async (data: DeviceRequestType) => {
    await saveDevice(data);
    successMessagePopup("Aparelho criado com sucesso!");
  };

  const alterDeviceName = async (data: DeviceRequestResultType) => {
    await updateDevice(data.id, { name: data.name, pin: data.pin });
    successMessagePopup("Aparelho salvo com sucesso!");
  };

  const handleSaveDevice = async () => {
    if (!device?.name || !device?.pin) return;
    if (!device?.id)
      return createDevice({ name: device.name, pin: device.pin });
    return alterDeviceName({
      id: device.id,
      name: device.name,
      pin: device.pin,
    });
  };

  const getDada = async (id: string) => {
    if (!id) return;
    const currentDevice = devices.find((elm) => elm.id === id);
    setDevice(currentDevice || null);
  };

  useEffect(() => {
    if (id) getDada(id);
  }, [id]);
  return (
    <>
      <ListDevices />
      <PopUp onClose={() => navigate(routes_constraints.DEVICE)}>
        <form className="form-device">
          <p>
            <label>Nome do aparelho:</label>
            <input
              type="text"
              defaultValue={device?.name}
              onChange={(elm) =>
                setDevice({ ...device, name: elm.target.value })
              }
            />
          </p>
          <p>
            <label>Pin do aparelho:</label>
            <input
              type="text"
              defaultValue={device?.pin}
              onChange={(elm) =>
                setDevice({ ...device, pin: elm.target.value })
              }
            />
          </p>
          <button type="button" onClick={handleSaveDevice}>
            Salvar aparelho
          </button>
        </form>
      </PopUp>
    </>
  );
};
