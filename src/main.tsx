import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./common/styles/globals.scss";

import { RouterProvider } from "react-router-dom";
import Router from "./routing/Router";

import { Provider } from "react-redux";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { apiSlice } from "./api/apiSlice";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <RouterProvider router={Router} />
    </ApiProvider>
  </React.StrictMode>
);
