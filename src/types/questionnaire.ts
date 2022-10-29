export type QuestionnaireRequestType = {
  name: string;
  image: string;
  quantity: string;
  endDate: string;
  link: string;
  exceedsQuantity: boolean;
  canBeOnline: boolean;
  deviceIds: string[];
  applierIds: string[];
};

export type QuestionnaireRequestResultType = {
  id: string;
  name: string;
  image: string;
  quantity: string;
  endDate: string;
  link: string;
  exceedsQuantity: boolean;
  canBeOnline: string;
};

export type QuestionnaireResponseType = {
  id: string;
  name: string;
  image: string;
  quantity: string;
  endDate: string;
  link: string;
  exceedsQuantity: boolean;
  canBeOnline: string;
  devices: {
    id: string;
    name: string;
    pin: string;
  }[];
  appliers: {
    id: string;
    name: string;
  }[];
};
