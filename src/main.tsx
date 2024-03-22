import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Home from "./pages/Home";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Route,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Analyzer, { domainstoryLoader } from "./pages/Analyzer";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/analyzer/:damId",
    element: <Analyzer />,
    loader: domainstoryLoader,
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
