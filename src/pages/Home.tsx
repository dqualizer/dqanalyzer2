import dqLogo from "../assets/dqualizer_logo.png";
import WerkstattScreenshot from "../assets/werkstatt.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";
import { exampleDomainstory } from "../data/domainstories/exampleDomainstory";
import { DomainStory } from "../types/dam/domainstory/DomainStory";
import {
  createDomainstoryMock,
  getAllDomainstoriesMock,
} from "../queries/domainstory";

export default function Home() {
  const queryClient = useQueryClient();

  const { data, isSuccess, isFetching, isError } = useQuery({
    queryKey: ["domainstories"],
    // This will be changed to actual getAllDomainstories
    queryFn: getAllDomainstoriesMock,
  });

  const createDomainstoryMutation = useMutation({
    mutationFn: createDomainstoryMock,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["domainstories"]);
      console.log(data);
    },
  });

  const createDomainstorySubmit = (domainstory: DomainStory) => {
    createDomainstoryMutation.mutate(domainstory);
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="text-center">
        <img src={dqLogo} alt="" className="mx-auto mb-4 w-1/2" />
        <p className="font-bold text-2xl">Welcome to dqAnalyzer 1.0!</p>
        <p className="text-xl">
          First of all: Choose your Demo-Domain or create it first by using
          dqEdit.
        </p>
        <p className="text-xl">
          Currently there are two Demo-Domains available. Use the
          Werkstattauftrag-Domain to try the manual mode. The Leasing Ninja
          shows a more domain-centric view to specify rqas with a generative
          scenario editor.
        </p>
        <p>Hint: You can also use the buttons as long there´s no dqEdit</p>
      </div>
      <div className="flex gap-4 mt-5">
        {data?.length ? (
          data.map((domainstory: DomainStory) => (
            <Link to={`/analyzer/${domainstory._id}`}>
              <div className="w-60 h-60 border-2 border-cyan-400 relative hover:scale-110">
                <img
                  src={WerkstattScreenshot}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="text-black text-l font-bold absolute bottom-0 left-0 right-0 text-center mb-2">
                  {domainstory._id}
                </span>
              </div>
            </Link>
          ))
        ) : isFetching ? (
          <p>Trying to fetch...</p>
        ) : (
          isError && (
            <>
              <p>Seems like there is no connection to the backend...</p>
            </>
          )
        )}
      </div>

      <div className="flex gap-2 mt-5">
        {isSuccess &&
          !data?.find(
            (domainstory: DomainStory) => domainstory._id == "id"
          ) && (
            <button
              className="btn btn-sm"
              onClick={() => createDomainstorySubmit(exampleDomainstory)}
            >
              Create Example Domainstory
            </button>
          )}
      </div>
    </div>
  );
}
