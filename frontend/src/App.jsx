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
import { getCommandNameByUserId, getUserById } from "./utils/api/usersApi";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ManageColumnsPage from "./pages/ManageColumns/ManageColumnsPage";
import ManageLeftOversPage from "./pages/ManageLeftOversPage/ManageLeftOversPage";
import ManageSoldierAccompaniedPage from "./pages/ManageSoldierAccompaniedPage/ManageSoldierAccompaniedPage";

const handleRouter = (token, managePerm) => {
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
  if (token && managePerm) {
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
          { path: "/manageColumns", element: <ManageColumnsPage /> },
          {
            path: "/manageSoldierAccompanied",
            element: <ManageSoldierAccompaniedPage />,
          },
          { path: "/manageLeftOvers", element: <ManageLeftOversPage /> },
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
          {
            path: "/manageSoldierAccompanied",
            element: <ManageSoldierAccompaniedPage />,
          },
          { path: "/manageLeftOvers", element: <ManageLeftOversPage /> },
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
  // const [command, setCommand] = useState("");
  const [editPerm, setEditPerm] = useState("");
  const [managePerm, setManagePerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        // const commandUser = await getCommandNameByUserId(userId);
        // setCommand(commandUser);
        const user = await getUserById(userId);
        setEditPerm(user.editPerm);
        setManagePerm(user.managePerm);
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
        <RouterProvider router={handleRouter(token, managePerm)} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
