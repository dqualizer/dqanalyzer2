import React, { useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { BiRightArrow, BiDownArrow } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteDomainByName,
  deleteSubdomainByName,
} from "../../../queries/domain";

export default function DomainListItem({ domain, isSubdomain, parent }) {
  const [subdomainsOpen, setSubDomainsOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteDomainMutation = useMutation({
    mutationKey: ["domains"],
    mutationFn: deleteDomainByName,
    onSuccess: () => queryClient.invalidateQueries(["domains"]),
  });
  const deleteSubDomainMutation = useMutation({
    mutationKey: ["domains"],
    mutationFn: deleteSubdomainByName,
    onSuccess: () => queryClient.invalidateQueries(["domains"]),
  });
  const openSubDomains = (e) => {
    setSubDomainsOpen((prevState) => !prevState);
  };

  const handleDelete = (parent, domain) => {
    if (!isSubdomain) deleteDomainMutation.mutate(domain);
    else {
      console.log(isSubdomain);
      deleteSubDomainMutation.mutate({ parent, domain });
    }
  };
  return (
    <>
      <li className={isSubdomain && "ml-8"}>
        <div className="p-2 flex border-b items-center justify-between">
          <div className="flex items-center gap-2">
            {domain.subdomains.length > 0 && (
              <div className="hover:cursor-pointer" onClick={openSubDomains}>
                {!subdomainsOpen ? <BiRightArrow /> : <BiDownArrow />}
              </div>
            )}
            <FaLayerGroup />
            <span>{domain.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <FaTrash
              className="hover:cursor-pointer"
              onClick={() => handleDelete(parent?.name, domain.name)}
              data-tooltip-content="Delete"
              data-tooltip-id="delete-tooltip"
            />
            <FaEllipsisVertical
              className="hover:cursor-pointer"
              data-tooltip-content="Options"
              data-tooltip-id="options-tooltip"
            />
            <Tooltip id="delete-tooltip" />
            <Tooltip id="options-tooltip" />
          </div>
        </div>
      </li>
      {subdomainsOpen &&
        domain.subdomains.map((subdomain) => {
          return (
            <DomainListItem parent={domain} domain={subdomain} isSubdomain />
          );
        })}
    </>
  );
}
