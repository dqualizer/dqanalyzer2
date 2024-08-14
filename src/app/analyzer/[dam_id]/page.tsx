import {
  readAllRqas,
  readDamById,
} from "@/app/analyzer/[dam_id]/fetch";
import { DqContextProvider } from "@/app/providers/DqContext";
import { SelectedEdgeProvider } from "@/app/providers/SelectedEdge";
import Graph from "@/components/analyzer/graph";

export default async function Analyzer({
  params,
}: { params: { dam_id: string } }) {
  const dam = await readDamById(params.dam_id);
  const rqas = await readAllRqas();
  const domainstory = dam.domain_story

  return (
    <DqContextProvider value={{ dam, domainstory, rqas }}>
      <SelectedEdgeProvider>
        <Graph />
      </SelectedEdgeProvider>
    </DqContextProvider>
  );
}
