import type { Language } from "@/language";

// 模块类型
export enum ModuleType {
  Root = "Root",
  Module = "Module",
  Page = "Page",
}

// 被选择的模块
export interface ModuleTab {
  Url: string;
  Closable: boolean;
  MenuPath: string[];
  Loading:boolean;
  Id: string;
}

// 模块（菜单）
export interface ModuleItem {
  Id: string; // 模块id
  Description: string; // 描述
  DisplayName: string; // 显示名
  EntityConfigID: string; // 实体对应ID
  Icon: string | null;
  IsSystem: boolean; // 是否为系统模块
  Language: Language | string; // 语言类型
  ModuleType: ModuleType | string;
  Name: string;
  ParentID: string; // 父模块ID
  Sequence: number;
  Url: string | null; //
  SubModulesList: ModuleItem[] | null; //子模块列表
}
