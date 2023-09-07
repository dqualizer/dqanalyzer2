import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import LoadtestSpecifier from "../components/testing/loadtest/LoadtestSpecifier";
import { getAllRqas } from "../queries/rqa";
import werkstatt from "../data/werkstatt.json";
import loadtestSpecs from "../data/loadtest-specs.json";

export default function Testing() {
  const rqaQuery = useQuery({
    queryKey: ["rqas"],
    queryFn: getAllRqas,
  });
  return (
    <div>
      <LoadtestSpecifier
        rqas={rqaQuery.data}
        domain={werkstatt}
        loadtestSpecs={loadtestSpecs}
      />
    </div>
  );
}
