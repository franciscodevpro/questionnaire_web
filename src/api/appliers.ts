import { ApplierResponseType } from "../types/applier";
import { routes_constraints } from "../util/route_utils";
import api from "./index";

export const findAllAppliers = async (): Promise<ApplierResponseType[]> => {
  const result = await api.get(routes_constraints.APPLIER);
  return result.data;
};
