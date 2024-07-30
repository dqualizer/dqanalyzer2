import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteRQA } from "./actions";

export function DeleteRqaButton({
  rqa,
}: { rqa: RuntimeQualityAnalysisDefinition }) {
  return (
    <button
      type="button"
      className="btn btn-xs w-fit btn-ghost"
      onClick={() => deleteRQA({ rqaId: rqa.id })}
    >
      <DeleteIcon color="error" />
    </button>
  );
}
