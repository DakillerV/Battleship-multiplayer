import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Spinner from "@components/loader/Spinner";
import SocketProvider from "@contexts/main";
import { BrowserRouter } from "react-router-dom";
import LogRocket from "logrocket";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./assets/css/index.css";
import { Toaster } from "react-hot-toast";
LogRocket.init("1qhhcb/hangman");

const root = ReactDOM.createRoot(document.getElementById("root"));
const LazyApp = React.lazy(() => import("./App"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <React.Suspense fallback={<Spinner />}>
          <LazyApp />
          <Toaster />
        </React.Suspense>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
