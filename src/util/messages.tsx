export const errorMessagePopup = (message: string) => {
  alert(message);
};

export const successMessagePopup = (message: string) => {
  alert(message);
};

export const confirmationPopup = (message: string): boolean => {
  return confirm(message);
};
