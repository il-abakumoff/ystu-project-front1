import { useState } from "react";

export const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showAlert = (message: string, timeout = 4900) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), timeout);
  };

  return {
    alertMessage,
    showAlert,
    closeAlert: () => setAlertMessage(null),
  };
};
