import { createBrowserRouter } from "react-router";

import RootLayout from "./layouts/RootLayout";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import Counsellors from "./pages/Counsellors/Counsellors";
import Dashboard from "./pages/Dashboard/Dashboard";
import Students from "./pages/Students/Students";
import Insights from "./pages/Insights/Insights";

export const router = createBrowserRouter([
  {
    path: "/",

    children: [
      {
        path: "/",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      }

    ],
  },

  {
    Component: RootLayout,
    children: [
      {
        path: "counsellors",
        Component: Counsellors,
      },
      {
        path: "dashboard",
        Component: Dashboard
      },
      {
        path: "students",
        Component: Students
      },
      {
        path: "insights",
        Component: Insights
      }


    ]


  },

  {
    path: "*",
    Component: NotFound,
  },
]);