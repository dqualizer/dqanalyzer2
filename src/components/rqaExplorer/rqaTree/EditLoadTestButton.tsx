import EditIcon from "@mui/icons-material/Edit";

interface EditLoadTestButtonProps {
  loadTestSpecifier: any;
  parentMenuRef: any;
}

export function EditLoadTestButton({
  loadTestSpecifier,
  parentMenuRef,
}: EditLoadTestButtonProps) {
  const handleDelete = () => {
    loadTestSpecifier(true);
  };

  return (
    <button
      type="button"
      className="btn btn-xs w-fit btn-ghost"
      onClick={handleDelete}
    >
      <EditIcon />
    </button>
  );
}
