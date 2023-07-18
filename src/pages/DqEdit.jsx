import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";

import werkstatt from "../data/werkstatt.json";
import loadtestSpecs from "../data/loadtest-specs.json";
import MenuSidebar from "../components/testing/MenuSidebar";
import Breadcrumb from "../components/testing/Breadcrumb";
import Domains from "./Domains";
import Contexts from "./Contexts";
import { Outlet } from "react-router-dom";

export default function DqEdit() {
  return (
    <div className="flex h-full">
      <div>
        <MenuSidebar />
      </div>

      <div className="flex-grow">
        <Breadcrumb />
        <div className="p-4" id="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
