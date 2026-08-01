import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        richColors
        position="top-right"
        closeButton
      />
    </AuthProvider>
  </React.StrictMode>
);