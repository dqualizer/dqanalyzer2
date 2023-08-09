import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createDomain } from "../queries/domain";
import { Navigate } from "react-router-dom";

export default function CreateBlankDomain() {
  const queryClient = useQueryClient();
  const [domainName, setDomainName] = useState("");

  const createDomainMutation = useMutation({
    mutationKey: ["domains"],
    mutationFn: createDomain,
    onSuccess: () => queryClient.invalidateQueries("domains"),
  });

  const handleDomainNameChange = (e) => {
    setDomainName(e.target.value);
  };

  const submitForm = () => {
    createDomainMutation.mutate(domainName);
  };
  if (createDomainMutation.isSuccess)
    return <Navigate to={`/dqedit/domains/` + domainName} />;
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Create Blank Domain</h1>
        <p>
          Define a Domain in which your Domain-Driven Work belongs to. This
          could be your organization, a project or any other object which is
          seperated into bounded contexts.
        </p>
      </div>
      <div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-bold">Domain Name</span>
          </label>
          <input
            type="text"
            placeholder="My awesoman ddd-domain"
            className="input input-bordered w-full max-w-xs"
            value={domainName}
            onChange={handleDomainNameChange}
          />
          <label className="label">
            <span className="label-text-alt">
              Must start with a lowercase or uppercase letter, digit, emoji, or
              underscore. Can also contain dots, pluses, dashes, or spaces.
            </span>
          </label>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-sm btn-primary" onClick={submitForm}>
            Create
          </button>
          <button className="btn btn-sm">Cancle</button>
        </div>
      </div>
    </div>
  );
}
