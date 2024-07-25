import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteLoadtest } from "./actions";

interface DeleteLoadTestButtonProps {
  loadTestDefinition: LoadTestDefinition;
  rqaId: string;
  parentMenuRef: any;
}

export function DeleteLoadTestButton({
  loadTestDefinition,
  rqaId,
  parentMenuRef,
}: DeleteLoadTestButtonProps) {
  const handleDelete = () => {
    deleteLoadtest({ rqaId, loadTestId: loadTestDefinition.id });
  };

  return (
    <button
      type="button"
      className="btn btn-xs w-fit btn-ghost"
      onClick={handleDelete}
    >
      <DeleteIcon color="error" />
    </button>
  );
}
