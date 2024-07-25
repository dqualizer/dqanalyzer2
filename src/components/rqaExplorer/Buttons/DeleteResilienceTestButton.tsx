import { deleteResilienceTest } from "@/queries/rqa";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteResilienceTestButtonProps {
  rqaId: string;
  resilienceTestDefinition: ResilienceTestDefinition;
}

export function DeleteResilienceTestButton({
  rqaId,
  resilienceTestDefinition: resiliendceTestDefinition
}: DeleteResilienceTestButtonProps) {
  return (
    <button
      className="btn btn-xs w-fit btn-ghost"
      onClick={() => deleteResilienceTest({ rqaId, resilienceTestId: resiliendceTestDefinition.name })}
    >
      <DeleteIcon color="error" />
    </button>
  );
}
