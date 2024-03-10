import React from "react";
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
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ToastContainer className="toast.container" autoClose={1000} />
        <RouterProvider router={Router} />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
