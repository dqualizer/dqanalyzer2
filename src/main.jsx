import React from "react";
import ReactDOM from "react-dom/client";

import App, { damLoader, offlineDomainstoryLoader } from "./pages/App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import DqEdit from "./pages/DqEdit";
import Domains from "./pages/Domains";
import { Link } from "react-router-dom";
import NewDomain from "./pages/NewDomain";
import CreateBlankDomain from "./pages/CreateBlankDomain";
import DomainDetails, { domainLoader } from "./pages/DomainDetails";
import NewContext from "./pages/NewContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/analyzer",
    element: <App />,
    loader: offlineDomainstoryLoader,
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
        path: "/dqedit/domains/:domainName",
        element: <DomainDetails />,
        handle: {
          crumb: () => (
            <Link
              to="/dqedit/domains/:domainName"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
            >
              Domains
            </Link>
          ),
        },
        loader: domainLoader,
      },
      {
        path: "/dqedit/domains/new",
        element: <NewDomain />,
        handle: {
          crumb: () => (
            <Link
              to="/dqedit/domains/new"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
            >
              New Domain
            </Link>
          ),
        },
      },
      {
        path: "/dqedit/domains/new/blank_domain",
        element: <CreateBlankDomain />,
        handle: {
          crumb: () => (
            <Link
              to="/dqedit/domains/new/blank_domain"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
            >
              Create Blank Domain
            </Link>
          ),
        },
      },
      {
        path: "/dqedit/domains/:domainName/contexts/new",
        element: <NewContext />,
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
