import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllDomains } from "../../../queries/domain";
import { Table } from "flowbite-react";

import DomainListItem from "./DomainListItem";
export default function DomainList() {
  const domainQuery = useQuery({
    queryKey: ["domains"],
    queryFn: getAllDomains,
  });

  console.log(domainQuery);
  return (
    <div>
      <ul>
        {domainQuery.data?.map((domain) => {
          return <DomainListItem domain={domain} />;
        })}
      </ul>
    </div>
  );
}
