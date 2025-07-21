import Settings from "@/assets/images/menu/settings.png";
import DB from "@/assets/images/menu/db.png";
import Folder from "@/assets/images/menu/folder.png";
import Documents from "@/assets/images/menu/document.png";
import Home from "@/assets/images/button/home.png";
import Add from "@/assets/images/button/add.png";
import Delete from "@/assets/images/button/delete.png";
import Search from "@/assets/images/button/advanced-search.png";
import Save from "@/assets/images/button/save.png";

// icon 映射列表
const iconMap: Record<string, string> = {
  "mdm-icon": DB,
  "config-icon": Settings,
  null: Folder,
  "home": Home,
  "grid-header-icon": Documents,
  "add-icon": Add,
  "delete-icon": Delete,
  "search-icon": Search,
  "save-icon": Save,
  "query-icon":Add,
  "query-Advanced-icon":Search,
  "history-icon":Add,
  "detail-icon":Add,
  "export-icon":Add,
  "savesetting-icon":Save,
  "resetsetting-icon":Add,
  "remove-icon":Delete
};

export function getIcon(iconName: string | null): string {
  return iconMap[iconName as string];
}
