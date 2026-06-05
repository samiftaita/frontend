import toast from "react-hot-toast";

const defaultOptions = {
  duration: 3500,
  position: "top-right",
};

export const getApiMessage = (
  payload,
  fallback = "Une erreur est survenue",
) => {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload.message) {
    return payload.message;
  }

  if (payload.errors && typeof payload.errors === "object") {
    const firstErrorGroup = Object.values(payload.errors).find(Boolean);
    if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
      return firstErrorGroup[0];
    }
  }

  if (payload.error && typeof payload.error === "string") {
    return payload.error;
  }

  return fallback;
};

export const notifySuccess = (message, options = {}) => {
  if (!message) return null;
  return toast.success(message, { ...defaultOptions, ...options });
};

export const notifyError = (message, options = {}) => {
  const resolvedMessage = message || "Une erreur est survenue";
  return toast.error(resolvedMessage, { ...defaultOptions, ...options });
};

export const notifyApiResponse = (
  payload,
  fallback = "Opération effectuée",
) => {
  const message = getApiMessage(payload, fallback);
  const isSuccess =
    Boolean(payload?.success) || Boolean(payload?.error === false);

  return isSuccess ? notifySuccess(message) : notifyError(message);
};

export const toastConfig = defaultOptions;
