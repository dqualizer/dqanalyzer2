import EditIcon from "@mui/icons-material/Edit";

interface EditLoadTestButtonProps {
  loadTestSpecifier: any;
}

export function EditLoadTestButton({
  loadTestSpecifier,
}: EditLoadTestButtonProps) {
  const handleEdit = () => {
    loadTestSpecifier(true);
  };

  return (
    <button
      type="button"
      className="btn btn-xs w-fit btn-ghost"
      onClick={handleEdit}
    >
      <EditIcon />
    </button>
  );
}
