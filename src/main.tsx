import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./common/styles/globals.scss";

import { RouterProvider } from "react-router-dom";
import Router from "./routing/Router";

import { Provider } from "react-redux";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { apiSlice } from "./store/auth/apiSlice";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={Router} />
    </Provider>
  </React.StrictMode>
);

//       <ApiProvider api={apiSlice}>  </ApiProvider>
