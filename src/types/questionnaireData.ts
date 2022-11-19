export type QuestionnaireDataRequestType = {
  audioPath: string;
  lat: string;
  lon: string;
  duration: number;
};

export type QuestionnaireDataRequestResultType = {
  id: string;
  idApplier: string;
  idDevice: string;
  idQuestionnaire: string;
  audioPath: string;
  lat: string;
  lon: string;
  duration: number;
};

export type QuestionnaireDataResponseType = {
  id: string;
  applier: {
    id: string;
    name: string;
  };
  device: {
    id: string;
    name: string;
    pin: string;
  };
  idQuestionnaire: string;
  audioPath: string;
  lat: string;
  lon: string;
  duration: number;
};
