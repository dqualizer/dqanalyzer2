import React from "react";
import { useLoaderData, useParams, Link } from "react-router-dom";
import { getDomainByName } from "../queries/domain";

export function domainLoader({ params }) {
  return getDomainByName(params.domainName);
}

export default function DomainDetails() {
  let params = useParams();

  const domain = useLoaderData().data;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{domain.name}</h1>
          <p>Domain Id: {domain.id}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/dqedit/domains/${domain.name}/contexts/new`}>
            <button
              type="button"
              class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              New Context
            </button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <p>Recent Activities</p>
          <p className="font-bold">Last 30 days</p>
        </div>
        <div>
          <p>Created Domain Stories</p>
          <p className="font-bold text-xl">3</p>
        </div>
        <div>
          <p>Executed Rqas</p>
          <p className="font-bold text-xl">5</p>
        </div>
        <div>
          <p>Added Domain Objects</p>
          <p className="font-bold text-xl">7</p>
        </div>
      </div>
      <div className="tabs">
        <a className="tab tab-lg tab-bordered tab-active">Contexts</a>
        <a className="tab tab-lg tab-bordered">Subdomains</a>
      </div>
    </div>
  );
}
