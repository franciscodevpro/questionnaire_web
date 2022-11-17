import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import { ApplierRequestType, ApplierResponseType } from "../types/applier";
import { routes_constraints, routes_helpers } from "../util/route_utils";
import api from "./index";

const getAccessToken = (): string | null => {
  const accessToken = getAccessTokenRepository();
  if (!accessToken?.accessToken) return null;
  return accessToken.accessToken;
};

const authConfig = () => ({
  headers: { "x-access-token": `Bearer ${getAccessToken()}` },
});

export const findAllAppliers = async (): Promise<ApplierResponseType[]> => {
  const result = await api.get(routes_constraints.APPLIER);
  return result.data;
};

export const saveApplier = async (data: ApplierRequestType): Promise<void> => {
  await api.post(routes_constraints.APPLIER, data, authConfig());
};

export const updateApplier = async (
  id: string,
  data: ApplierRequestType
): Promise<void> => {
  await api.patch(routes_helpers.mountApplierId(id), data, authConfig());
};

export const deleteApplier = async (id: string): Promise<void> => {
  await api.delete(routes_helpers.mountApplierId(id), authConfig());
};
