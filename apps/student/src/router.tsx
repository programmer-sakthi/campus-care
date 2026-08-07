import { createBrowserRouter } from "react-router";

import RootLayout from "./layouts/RootLayout";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import Booking from "./pages/book-appointment/Booking";
import Chat from "./pages/book-appointment/Chat";

export const router = createBrowserRouter([
  {
    path: "/",

    children: [ 
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      }
    ],
  },
  {
    path: "/",
    Component: RootLayout,

    children: [ 
      {
        path: "book-appointment",
        Component: Booking,
      },
      {
        path: "chat",
        Component: Chat,
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);