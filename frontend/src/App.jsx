import React, { useState, useEffect } from "react";
import "./App.css";
import { AuthContext } from "./utils/contexts/authContext";
import { useAuth } from "./utils/hooks/useAuth";
import RootLayout from "./pages/RootLayOut/RootLayOut";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ErrorNotFoundPage from "./pages/ErrorNotFound/ErrorNotFoundPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import HalalimPage from "./pages/HalalimPage/HalalimPage";
import ManageUsersPage from "./pages/ManageUsersPage/ManageUsersPage";
import ManageCommandsPage from "./pages/ManageCommandsPage/ManageCommandsPage";
import ManageGraveyardsPage from "./pages/ManageGraveyardsPage/ManageGraveyardsPage";
import { getCommandNameByUserId } from "./utils/api/usersApi";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const handleRouter = (token, command) => {
  let router;
  router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" replace /> },
        { path: "/login", element: <LoginPage /> },
        { path: "about", element: <AboutPage /> },
        { path: "*", element: <ErrorNotFoundPage /> },
      ],
    },
  ]);
  if (token && command === "צפון") {
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { path: "/", element: <Navigate to="/login" replace /> },
          { path: "/login", element: <LoginPage /> },
          { path: "about", element: <AboutPage /> },
          {
            path: "/halalim",
            element: <HalalimPage />,
          },
          { path: "/manageUsers", element: <ManageUsersPage /> },
          { path: "/manageGraveyards", element: <ManageGraveyardsPage /> },
          { path: "/manageCommands", element: <ManageCommandsPage /> },
          { path: "/manageColumns", element: <ManageCommandsPage /> },
          { path: "*", element: <ErrorNotFoundPage /> },
        ],
      },
    ]);
  } else if (token) {
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { path: "/", element: <Navigate to="/login" replace /> },
          { path: "/login", element: <LoginPage /> },
          { path: "about", element: <AboutPage /> },
          {
            path: "/halalim",
            element: <HalalimPage />,
          },
          { path: "*", element: <ErrorNotFoundPage /> },
        ],
      },
    ]);
  }
  return router;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffa726",
    },
    secondary: {
      main: "#3069BE",
    },
  },
});

function App() {
  const { token, login, logout, userId } = useAuth();
  const [command, setCommand] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const commandUser = await getCommandNameByUserId(userId);
        setCommand(commandUser);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <ThemeProvider theme={theme}>
        <RouterProvider router={handleRouter(token, command)} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
