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


const handleRouter = (token, command) => {
  let router;
  router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <h1>Hello World!</h1> },

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

        { path: "*", element: <ErrorNotFoundPage /> },
      ],
    },
  ]);
  // if (token && command === "חיל לוגיסטיקה") {
  //   router = createBrowserRouter([
  //     {
  //       path: "/",
  //       element: <RootLayout />,
  //       children: [
  //         { path: "/", element: <h1>Hello World!</h1> },

  //         { path: "/", element: <Navigate to="/login" replace /> },
  //         { path: "/login", element: <LoginPage /> },
  //         { path: "about", element: <AboutPage /> },
  //         {
  //           path: "/halalim",
  //           element: <HalalimPage />,
  //         },
  //         { path: "/manageUsers", element: <ManageUsersPage /> },
  //         { path: "/manageCommands", element: <ManageCommandsPage /> },

  //         { path: "*", element: <ErrorNotFoundPage /> },
  //       ],
  //     },
  //   ]);
  // } else if (token) {
  //   router = createBrowserRouter([
  //     {
  //       path: "/",
  //       element: <RootLayout />,
  //       children: [
  //         { path: "/", element: <Navigate to="/login" replace /> },
  //         { path: "/login", element: <LoginPage /> },
  //         // { path: "about", element: <AboutPage /> },
  //         {
  //           path: "/halalim",
  //           element: <CreateEventPage />,
  //         },

  //         { path: "*", element: <ErrorNotFoundPage /> },
  //       ],
  //     },
  //   ]);
  // } else {
  //   // router = createBrowserRouter([
  //   //   {
  //   //     path: "/",
  //   //     element: <RootLayout />,
  //   //     children: [
  //   //       { path: "/", element: <Navigate to="/login" replace /> },
  //   //       { path: "/login", element: <LoginPage /> },
  //   //       // { path: "about", element: <AboutPage /> },
  //   //       { path: "*", element: <ErrorNotFoundPage /> },
  //   //     ],
  //   //   },
  //   // ]);
  //   router = createBrowserRouter([
  //     {
  //       path: "/",
  //       element: <RootLayout />,
  //       children: [
  //         { path: "/", element: <h1>Hello World!</h1> },

  //         { path: "/", element: <Navigate to="/login" replace /> },
  //         { path: "/login", element: <LoginPage /> },
  //         { path: "about", element: <AboutPage /> },
  //         {
  //           path: "/halalim",
  //           element: <HalalimPage />,
  //         },
  //         { path: "/manageUsers", element: <ManageUsersPage /> },
  //         { path: "/manageGraveyards", element: <ManageGraveyardsPage /> },
  //         { path: "/manageCommands", element: <ManageCommandsPage /> },

  //         { path: "*", element: <ErrorNotFoundPage /> },
  //       ],
  //     },
  //   ]);
  // }

  return router;
};

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
      <RouterProvider router={handleRouter(token, command)} />
    </AuthContext.Provider>
  );
}

export default App;
