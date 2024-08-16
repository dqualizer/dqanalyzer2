import { useSideBarContext } from "@/app/providers/SidebarContext";
import EditIcon from "@mui/icons-material/Edit";

export function EditLoadTestButton() {
  const {
    loadTestSpecifierState: [, setLoadTestSpecifier],
  } = useSideBarContext();

  return (
    <button
      type="button"
      className="btn btn-xs w-fit btn-ghost"
      onClick={() => setLoadTestSpecifier(true)}
    >
      <EditIcon />
    </button>
  );
}
