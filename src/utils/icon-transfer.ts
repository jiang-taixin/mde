import Settings from "@/assets/images/menu/settings.png";
import DB from "@/assets/images/menu/db.png";
import Folder from "@/assets/images/menu/folder.png";
import Documents from "@/assets/images/menu/document.png";
import Home from "@/assets/images/button/home.png";
import Add from "@/assets/images/button/add.png";
import Delete from "@/assets/images/button/delete.png";
import Search from "@/assets/images/button/advanced-search.png";
import Save from "@/assets/images/button/save.png";
import Access from "@/assets/images/button/access.png";
import Detail from "@/assets/images/button/detail.png";
import Export from "@/assets/images/button/export.png";
import Filter from "@/assets/images/button/filter.png";
import History from "@/assets/images/button/history.png";
import Reset from "@/assets/images/button/reset.png";
import Temp from "@/assets/images/button/temp.png";
import ToUp from "@/assets/images/button/toup.png";
import ToDown from "@/assets/images/button/todown.png";
import Upload from "@/assets/images/button/upload.png";

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
  "history-icon":History,
  "detail-icon":Detail,
  "export-icon":Export,
  "savesetting-icon":Save,
  "resetsetting-icon":Reset,
  "remove-icon":Delete,
  "filter":Filter,
  "upload-icon":Upload,
  "download-icon":Temp
};

export function getIcon(iconName: string | null): string {
  return iconMap[iconName as string];
}
