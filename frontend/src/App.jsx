import React, { useEffect, useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RootLayout from "./pages/RootLayOut/RootLayOut";
import AuthContext from "./utils/contexts/authContext";
import { useAuth } from "./utils/hooks/useAuth";
import { getCommandNameByUserId } from "./utils/api/usersApi";
import ErrorNotFoundPage from "./pages/ErrorNotFound/ErrorNotFoundPage";
import LoginPage from "./pages/Login/LoginPage";
import { SideBar } from "./components/sideBar/SideBar";

// const handleRouter = (token, command) => {
//   let router;

//   if (token && command === "חיל לוגיסטיקה") {
//     router = createBrowserRouter([
//       {
//         path: "/",
//         element: <RootLayout />,
//         children: [
//           { path: "/", element: <Navigate to="/login" replace /> },
//           { path: "/login", element: <LoginPage /> },
//           // { path: "about", element: <AboutPage /> },
//           {
//             path: "/halalim",
//             element: <CreateEventPage />,
//           },
//           { path: "/manageUsers", element: <ManageUsersPage /> },
//           { path: "/manageCommands", element: <ManageCommandsPage /> },

//           { path: "*", element: <ErrorNotFoundPage /> },
//         ],
//       },
//     ]);
//   } else if (token) {
//     router = createBrowserRouter([
//       {
//         path: "/",
//         element: <RootLayout />,
//         children: [
//           { path: "/", element: <Navigate to="/login" replace /> },
//           { path: "/login", element: <LoginPage /> },
//           // { path: "about", element: <AboutPage /> },
//           {
//             path: "/halalim",
//             element: <CreateEventPage />,
//           },

//           { path: "*", element: <ErrorNotFoundPage /> },
//         ],
//       },
//     ]);
//   } else {
//     router = createBrowserRouter([
//       {
//         path: "/",
//         element: <RootLayout />,
//         children: [
//           { path: "/", element: <Navigate to="/login" replace /> },
//           { path: "/login", element: <LoginPage /> },
//           // { path: "about", element: <AboutPage /> },
//           { path: "*", element: <ErrorNotFoundPage /> },
//         ],
//       },
//     ]);
//   }

//   return router;
// };

function App() {
  // const { token, login, logout, userId } = useAuth();
  // const [command, setCommand] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (userId) {
  //       const commandUser = await getCommandNameByUserId(userId);
  //       setCommand(commandUser);
  //     }
  //   };

  //   fetchData();
  // }, [userId]);

  // return (
  //   // <AuthContext.Provider
  //   //   value={{
  //   //     isLoggedIn: !!token,
  //   //     token: token,
  //   //     userId: userId,
  //   //     login: login,
  //   //     logout: logout,
  //   //   }}
  //   // >
  //   //   <RouterProvider router={handleRouter(token, command)} />
  //   // </AuthContext.Provider>
  // );

  return <SideBar></SideBar>;
}

export default App;
