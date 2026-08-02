import { createBrowserRouter } from "react-router";

import RootLayout from "./layouts/RootLayout";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,

    children: [ 
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);