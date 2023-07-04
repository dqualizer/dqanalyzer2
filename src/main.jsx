import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as homeLoader } from "./pages/Home";
import { loader as analyzerLoader } from "./pages/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Testing from "./pages/Testing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: homeLoader,
  },
  {
    path: "/analyzer/:domainId",
    element: <App />,
    loader: analyzerLoader,
  },
  {
    path: "/testing/",
    element: <Testing />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
