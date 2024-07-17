import {
	readAllRqas,
	readDamByDomainStoryId,
	readDomainstoryById,
} from "@/app/analyzer/[domainstory_id]/fetch";
import { DqContextProvider } from "@/app/providers/DqContext";
import Graph from "@/components/analyzer/graph";

export default async function Analyzer({
	params,
}: { params: { domainstory_id: string } }) {
	const domainstory = await readDomainstoryById(params.domainstory_id);
	const rqas = await readAllRqas();
	const dam = await readDamByDomainStoryId(domainstory.id);

	return (
		<DqContextProvider value={{ dam, domainstory, rqas }}>
			<Graph />
		</DqContextProvider>
	);
}
