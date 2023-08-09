import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import DomainTabs from "../components/testing/components/DomainTabs";
import DomainList from "../components/testing/components/DomainList";
export default function Domains() {
  return (
    <div className="content">
      <div className="flex justify-between">
        {" "}
        <h1 className="text-2xl font-bold">Domains</h1>
        <div className="flex gap-2">
          <Link to="/dqedit/domain/explore/">
            {" "}
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Explore Domains
            </button>
          </Link>
          <Link to="/dqedit/domains/new">
            <button
              type="button"
              class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              New Domain
            </button>
          </Link>
        </div>
      </div>
      <DomainList />
      <div className="p-4" id="content">
        <Outlet />
      </div>
    </div>
  );
}
