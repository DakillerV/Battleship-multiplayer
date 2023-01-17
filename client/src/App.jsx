import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  Routes,
  Route,
  Outlet,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./views/home";
import Spinner from "@components/loader/Spinner";
import { isUserLoggedIn, getUserData, guidGenerator } from "@utils";
import { setCookie } from "react-use-cookie";
import MainProvider, { MainContext } from "@contexts/main";
import axios from "axios";
import { handleLogin, handleLogout } from "@store/authentication";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import Game from "./views/game";
const ENDPOINT = "http://localhost:5000";
let socket;
const LazyLayout = React.lazy(() => import("@components/layouts/Layout"));
const LazyLeaderboard = React.lazy(() => import("./views/leaderboard"));
const LazyUsers = React.lazy(() => import("./views/users"));
const LazyUser = React.lazy(() => import("./views/users/user"));
const LazyMessages = React.lazy(() => import("./views/messages"));
const LazyProfile = React.lazy(() => import("./views/profile"));
const LazyAdminView = React.lazy(() => import("./views/admin/index"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <LazyLayout />,
    loader: async () => {
      return { success: true, message: "Auth Complete" };
    },
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "leaderboard",
        element: <LazyLeaderboard></LazyLeaderboard>,
      },
      {
        path: "users",
        element: <LazyUsers></LazyUsers>,
      },
      {
        path: "profile",
        element: <LazyProfile></LazyProfile>,
      },
      {
        path: "users/:userId",
        element: <LazyUser></LazyUser>,
      },
      {
        path: "messages/*",
        element: <LazyMessages></LazyMessages>,
      },
      {
        path: "admin/*",
        absolute: true,
        element: <LazyAdminView />,
        loader: () => {
          return { success: true, message: "Game Data res" };
        },
      },
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  },
  {
    path: "/game/*",
    absolute: true,
    element: <Game />,
    loader: () => {
      return { success: true, message: "Game Data res" };
    },
  },
]);
socket = io(ENDPOINT, {
  transports: ["websocket", "polling"],
});
const App = () => {
  const dispatch = useDispatch();
  const firstUpdate = useRef(true);
  const [startingUserData, setStartingUserData] = useState(null);
  const [debugOpen, setDebugOpen] = useState(
    window.localStorage.getItem("debug") === "true" || false
  );
  const [socketData, setSocketData] = useState({
    connected: false,
    latency: 0,
  });

  const [fetchedUserData, setFetchedUserData] = useState(false);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      console.log(window.localStorage.getItem("debug"));
      if (debugOpen !== (window.localStorage.getItem("debug") === "true")) {
        setDebugOpen(window.localStorage.getItem("debug") === "true");
      }
    });
  }, []);
  useEffect(() => {
    if (debugOpen !== (window.localStorage.getItem("debug") === "true")) {
      window.localStorage.setItem("debug", debugOpen);
    }
  }, [debugOpen]);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      console.log(`%cHangman`, "color: #673ab7");
      try {
        axios({
          method: "GET",
          url: "/api/auth/current-session/",
        }).then((res) => {
          const resData = res.data;
          if (resData.login) {
            console.log(resData.userData);
            dispatch(handleLogin(resData.userData));
            setStartingUserData(resData.userData);
            setFetchedUserData(true);
          } else {
            setFetchedUserData(true);
          }
          socket.emit(
            "setup",
            resData.userData
              ? { ...resData.userData }
              : { userData: { id: guidGenerator() }, anon: true }
          );
          socket.on("connected", () =>
            setSocketData((prev) => ({ ...prev, connected: true }))
          );
        });
      } catch (error) {
        console.log(error);
      }
      firstUpdate.current = false;
      return;
    }
    let startTime;
    setInterval(function () {
      if (debugOpen) {
        startTime = Date.now();
        socket.emit("ping");
      }
    }, 1000);

    socket.on("pong", function () {
      const latency = Date.now() - startTime;
      setSocketData((prev) => ({ ...prev, latency }));
    });
  }, []);
  return fetchedUserData ? (
    <div className="App">
      {debugOpen && (
        <div>
          Debug Menu: SocketIo Connection:{" "}
          {socketData.connected ? "Connected" : "Not connected"}, Latency:{" "}
          {socketData.latency},
          <div
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => {
              setDebugOpen(!debugOpen);
            }}
          >
            X
          </div>
        </div>
      )}
      <MainProvider socket={socket} startingUserData={startingUserData}>
        <MainContext.Consumer>
          {(props) => (
            <RouterProvider
              router={router}
              fallbackElement={<Spinner />}
              {...props}
            />
          )}
        </MainContext.Consumer>
      </MainProvider>
    </div>
  ) : (
    <Spinner />
  );
};

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
