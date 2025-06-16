import type { Language } from "@/language";

// 模块类型
export enum ModuleType {
  Root = "Root",
  Module = "Module",
  Page = "Page",
}

// 激活模块列表
export interface ModuleTab {
  DisplayName: string;
  Url: string;
  closable: boolean;
  loading: boolean;
  menuPath: string[];
  ID: string;
}

// 模块
export interface ModuleItem {
  ID: string; // 模块id
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
