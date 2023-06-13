import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root, { loader as homeLoader } from './pages/Home';
import { loader as analyzerLoader } from './pages/App';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: homeLoader,
  },
  {
    path: "/analyzer/:domainId",
    element: <App />,
    loader: analyzerLoader
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
