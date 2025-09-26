import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { AppRouter } from "./router";
import "./index.css";
import "antd/dist/reset.css";
import { store } from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);
