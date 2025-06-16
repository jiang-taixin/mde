import Setting from "@/assets/images/menu/setting.svg";

// icon 映射列表
const iconMap: Record<string, string> = {
  "mdm-icon": Setting,
  "config-icon": Setting,
  null: Setting,
  "grid-header-icon": Setting,
  "add-icon": Setting,
  "delete-icon": Setting,
  "search-icon": Setting,
  "save-icon": Setting,
};

export function getIcon(iconName: string | null): string {
  return iconMap[iconName as string];
}
