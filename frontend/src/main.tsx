import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./common/styles/globals.scss";

import { RouterProvider } from "react-router-dom";
import Router from "./routing/Router";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import Modal from "react-modal";

import { Provider } from "react-redux";

import { store } from "./store/store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalStorageKeys } from "./common/constants/lsConstants";
import EN from "./common/i18n/languages/en.json";
import TR from "./common/i18n/languages/tr.json";
import io from "socket.io-client";

Modal.setAppElement("#root");

const LANGUAGES = {
  en: { translation: EN },
  tr: { translation: TR },
};

export type Language = keyof typeof LANGUAGES;

const defaultLanguage = "tr";

const broswerLanguage = navigator.language;
const browserLanguageConverted =
  broswerLanguage === "en-GB"
    ? "en"
    : broswerLanguage === "tr-TR"
    ? "tr"
    : "tr";

i18n.init({
  resources: LANGUAGES,
  interpolation: { escapeValue: false },
  lng: localStorage.getItem(LocalStorageKeys.language)
    ? localStorage.getItem(LocalStorageKeys.language)
    : browserLanguageConverted
    ? browserLanguageConverted
    : defaultLanguage,
  fallbackLng: defaultLanguage,
});

/*
const SocketIOComponent: React.FC = () => {
  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    // Listen for Socket.io events
    socket.on("bookingUpdated", (data) => {
      console.log("Booking updated:", data);
      // Update your UI or perform other actions here
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("bookingUpdated");
    };
  }, []);
  return null; // No need to render anything for this component
};
*/

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ToastContainer className="toast.container" autoClose={1000} />
        <RouterProvider router={Router} />
        {/*  <SocketIOComponent /> */}
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
