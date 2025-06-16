// 模块类型
export enum ComponentType {
  SearchInput = "SearchInput",
  Button = "Button",
}

//
export interface ComponentModel {
  ID: string;
  Type: ComponentType;
  Icon: string;
  Title: string;
  Disable: boolean;
}

export interface SubConfig {
  ID: string;
  TabName: string;
  ComponentModelList: ComponentModel[];
}

// 模块配置信息
export interface ModuleConfig {
  ID: string; // 模块id
  ComponentModelList: ComponentModel[];
  HasSubConfig: boolean;
  SubConfigList: SubConfig[]; //子模块列表
}
