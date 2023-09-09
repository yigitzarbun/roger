import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./common/styles/globals.scss";

import { RouterProvider } from "react-router-dom";
import Router from "./routing/Router";

import Modal from "react-modal";

import { Provider } from "react-redux";

import { store } from "./store/store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer className="toast.container" autoClose={1000} />
      <RouterProvider router={Router} />
    </Provider>
  </React.StrictMode>
);
