import Toast from "react-native-toast-message";

const TOAST_DURATION = 2500;

export const showSuccess = (message: string) => {
  Toast.show({
    type: "success",
    text1: message,
    position: "bottom",
    visibilityTime: TOAST_DURATION,
  });
};

export const showError = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "bottom",
    visibilityTime: TOAST_DURATION,
  });
};

export const showWarning = (message: string) => {
  Toast.show({
    type: "warning",
    text1: message,
    position: "bottom",
    visibilityTime: TOAST_DURATION,
  });
};
