import React from "react";
import ReactDOM from "react-dom/client";
import App, { damLoader } from "./pages/App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import DqEdit from "./pages/DqEdit";
import { getDomainById } from "./queries/dam.js";
import Domains from "./pages/Domains";
import Contexts from "./pages/Contexts";
import { Link } from "react-router-dom";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/analyzer/:damId",
    element: <App />,
    loader: damLoader,
  },
  {
    path: "/dqedit/",
    element: <DqEdit />,
    handle: {
      crumb: () => (
        <Link
          to="/dqedit/"
          className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
        >
          dqEdit
        </Link>
      ),
    },
    children: [
      {
        path: "/dqedit/domains",
        element: <Domains />,
        handle: {
          crumb: () => (
            <Link
              to="/dqedit/domains"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
            >
              Domains
            </Link>
          ),
        },
      },
      {
        path: "/dqedit/contexts",
        element: <Contexts />,
        handle: {
          crumb: () => (
            <Link
              to="/dqedit/contexts"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
            >
              Contexts
            </Link>
          ),
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
