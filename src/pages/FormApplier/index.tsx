import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveApplier, updateApplier } from "../../api/appliers";
import { PopUp } from "../../components/PopUp";
import MainContext from "../../contexts/questionnaire-context";
import {
  ApplierRequestResultType,
  ApplierRequestType,
} from "../../types/applier";
import { successMessagePopup } from "../../util/messages";
import { routes_constraints } from "../../util/route_utils";
import { ListAppliers } from "../ListAppliers";
import "./styles.css";

export const FormApplier = () => {
  const { id } = useParams();
  const { appliers } = useContext(MainContext);
  const navigate = useNavigate();
  const [applier, setApplier] =
    useState<Partial<ApplierRequestResultType> | null>(null);

  const createApplier = async (data: ApplierRequestType) => {
    await saveApplier(data);
    successMessagePopup("Entrevistador criado com sucesso!");
  };

  const alterApplierName = async (data: ApplierRequestResultType) => {
    await updateApplier(data.id, { name: data.name });
    successMessagePopup("Entrevistador salvo com sucesso!");
  };

  const handleSaveApplier = async () => {
    if (!applier?.name) return;
    if (!applier?.id) return createApplier({ name: applier.name });
    return alterApplierName({ id: applier.id, name: applier.name });
  };

  const getDada = async (id: string) => {
    if (!id) return;
    const currentApplier = appliers.find((elm) => elm.id === id);
    setApplier(currentApplier || null);
  };

  useEffect(() => {
    if (id) getDada(id);
  }, [id]);
  return (
    <>
      <ListAppliers />
      <PopUp onClose={() => navigate(routes_constraints.APPLIER)}>
        <form className="form-applier">
          <p>
            <label>Nome do entrevistador:</label>
            <input
              type="text"
              defaultValue={applier?.name}
              onChange={(elm) =>
                setApplier({ ...applier, name: elm.target.value })
              }
            />
          </p>
          <button type="button" onClick={handleSaveApplier}>
            Salvar entrevistador
          </button>
        </form>
      </PopUp>
    </>
  );
};
