import { createBrowserRouter } from "react-router";

import RootLayout from "./layouts/RootLayout";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import NavBar from "./layouts/NavBar";
import Chat from "./pages/chat/Chat";
import Appointments from "./pages/appointments/Appointments";
import Institutions from "./pages/institutions/Institutions";

export const router = createBrowserRouter([
  // Guest routes
  {
    children: [
      {
        index: true, // "/"
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },

  // Protected routes
   {
    Component: NavBar,
    children: [
      {
        path: "chat",
        Component: Chat,
      },
      {
        path: "appointments",
        Component: Appointments,
      },
      {
        path: "institutions",
        Component: Institutions,
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);