import { getAccessToken as getAccessTokenRepository } from "../repositories/tokenRepository";
import { DeviceRequestType, DeviceResponseType } from "../types/device";
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

export const findAllDevices = async (): Promise<DeviceResponseType[]> => {
  const result = await api.get(routes_constraints.DEVICE);
  return result.data;
};

export const saveDevice = async (data: DeviceRequestType): Promise<void> => {
  await api.post(routes_constraints.DEVICE, data, authConfig());
};

export const updateDevice = async (
  id: string,
  data: DeviceRequestType
): Promise<void> => {
  await api.patch(routes_helpers.mountDeviceId(id), data, authConfig());
};

export const deleteDevice = async (id: string): Promise<void> => {
  await api.delete(routes_helpers.mountDeviceId(id), authConfig());
};
