import React from "react";
import { Toaster } from "react-hot-toast";
import { toastConfig } from "../../utils/notifications";

const ToastHost = () => {
  return <Toaster {...toastConfig} />;
};

export default ToastHost;
