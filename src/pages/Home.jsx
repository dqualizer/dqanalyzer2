import dqLogo from "../assets/dqualizer_logo.png";
import WerkstattScreenshot from "../assets/werkstatt.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";
import { getAllDams, createDam } from "../queries/dam";
import * as leasingninjadamDto from "../data/leasingninjadamDto.json";

export default function Home() {
  const queryClient = useQueryClient();

  const damsQuery = useQuery({
    queryKey: ["dams"],
    queryFn: getAllDams,
  });

  const createDamMutation = useMutation({
    mutationKey: ["dams"],
    mutationFn: createDam,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["dams"]);
    },
  });

  const createDomainWerkstatt = () => {
    createDamMutation.mutate({ dam: leasingninjadamDto });
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="text-center">
        <img src={dqLogo} alt="" srcset="" class="mx-auto mb-4 w-1/2" />
        <p className="font-bold text-2xl">Welcome to dqAnalyzer 1.0!</p>
        <p className="text-xl">
          First of all: Choose your Demo-Domain or create it first by using
          dqEdit.
        </p>
        <p>
          Hint: You can also use the button as long there´s no dqEdit after some
          fetching retries ;)
        </p>
      </div>
      <div className="flex gap-4 mt-5">
        {damsQuery.data?.length ? (
          damsQuery.data.map((dam) => (
            <Link to={`/analyzer/${dam.id}`}>
              <div className="w-60 h-60 border-2 border-cyan-400 relative hover:scale-110">
                <img
                  src={WerkstattScreenshot}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="text-black text-l font-bold absolute bottom-0 left-0 right-0 text-center mb-2">
                  {dam.context}
                </span>
              </div>
            </Link>
          ))
        ) : damsQuery.isFetching ? (
          <p>Trying to fetch...</p>
        ) : damsQuery.isError ? (
          <p>Seems like there is no connection to the backend...</p>
        ) : (
          <button className="btn btn-sm" onClick={createDomainWerkstatt}>
            Create Domain
          </button>
        )}
      </div>
    </div>
  );
}
