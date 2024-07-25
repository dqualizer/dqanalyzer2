import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllDomains } from "../../../queries/domain";

import DomainListItem from "./DomainListItem";
export default function DomainList() {
  const domainQuery = useQuery({
    queryKey: ["domains"],
    queryFn: getAllDomains,
  });

  return (
    <div>
      <ul>
        {domainQuery.data?.map((domain) => {
          return <DomainListItem domain={domain} key={domain.id} />;
        })}
      </ul>
    </div>
  );
}
