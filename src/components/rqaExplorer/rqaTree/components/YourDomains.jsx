import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllDomains } from "../../../queries/domain";
export default function YourDomains() {
  const domainQuery = useQuery({
    queryKey: ["domains"],
    queryFn: getAllDomains,
  });

  console.log(domainQuery.data);
  return <div>YourProjects</div>;
}
