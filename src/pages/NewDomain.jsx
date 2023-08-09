import React from "react";
import { Link } from "react-router-dom";
export default function NewDomain() {
  return (
    <div className="p-8 ">
      <div className="flex justify-center mb-8 ">
        <h1 className="text-2xl">Create a new Domain</h1>
      </div>
      <div className="flex justify-between gap-8 mb-8 ">
        <Link to="/dqedit/domains/new/blank_domain">
          <div className="flex border border-black border-1 p-4 w-full hover:cursor-pointer">
            Create Blank Domain
          </div>
        </Link>
        <div className="flex border border-black border-1 p-4 w-full hover:cursor-pointer">
          Create From DST
        </div>
      </div>
      <div className="flex justify-between gap-8">
        <div className="flex border border-black border-1 p-4 w-full hover:cursor-pointer">
          Create From Existing Architecture Mapping
        </div>
        <div className="flex border border-black border-1 p-4 w-full hover:cursor-pointer">
          {" "}
          Clone existing Domain
        </div>
      </div>
    </div>
  );
}
