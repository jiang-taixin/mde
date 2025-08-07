import type { Language } from "@/language";

// 按钮点击事件
export enum FeatureName{
  FuzzySearch="FuzzySearch",           // 搜索，这个按钮会被替换成搜索框
  AdvancedSearch="AdvancedSearch",     // 高级搜索
  Delete="Delete",                     // 删除单条记录
  Add="Add",                           // 添加
  Remove="Remove",                     // 批量移除
  History="History",                   // 查看历史
  Detail="Detail",                     // 查看详情
  Upload="Upload",                     // 上传
  Export="Export",                     // 导出
  Download="Download",                 // 下载
  SaveSetting="SaveSetting",           // 保存设置
  ResetSetting="ResetSetting",         // 重置设置
  SwitchVersion="SwitchVersion",       // 切换版本
  Choose="Choose",                     // 选择
}


// 表头参数
export interface Attribute{
  AllowOverwriteNull:boolean,       //
  AttributeID:string,               //
  AttributeName:string,             // 表头显示的名称
  AutoGenerateCode:boolean,         // 这个是true   添加和编辑时都不允许编辑
  DataType:string|null,             // 数据类型
  DefaultValue:string|null,
  Description:string|null,
  DigitalPrecision:number,
  DisplayByDefault:boolean,
  DisplayFormat:string|null,
  DisplayName:string,
  DisplayWidth:number,
  EntityConfigID:string,
  EntityConfigName:string,
  EntityID:string,
  EntityName:string,
  ErrorMessage:string|null,
  ExcelColumn:string|null,
  ExtControlType:string,
  Hidden:boolean,
  ID:string,
  IsAdvancedFilter:boolean,
  IsBusinessPrimaryKey:boolean,         // true时字段不能编辑
  IsDerivedFromOtherEntity:boolean,
  IsExcelMandatory:boolean,
  IsFuzzyFilter:boolean,
  IsNullable:boolean,
  IsPrimaryKey:boolean,                 // true时字段不能编辑
  IsSystem:boolean,
  Language:Language,
  Length:number,
  Name:string,
  PhysicalField:string,
  PhysicalViewAlias:string,
  PromptMessage:string|null,
  ReadOnly:boolean,
  RefEntity:string,
  RegExpression:string|null,
  Sequence:number,
  SortDirection:string|null,
  SortExpression:string|null,
  SortOrder:number|null,
  TargetDisplayMemberID:string,
  TargetDisplayMemberName:string|null,
  TargetEntityID:string,
  TargetEntityName:string|null,
  TargetLovID:string,
  TargetLovName:string|null,
  TargetValueMemberID:string,
  TargetValueMemberName:string|null,
  IsActionColumn?:boolean,
  IconCss?:string,
}

// 操作栏按钮参数
export interface Feature{
  CommandName:string,
  CommandParameter:unknown|null,
  Description:string,
  DisplayName:string,
  EntityConfigID:string,
  EventName:string,
  ExtControlType:string,
  ID:string,
  IconCss:string,
  IsColumnButton:boolean,
  Language:Language,
  MaskFlag:number,
  Name:FeatureName,
  Sequence:number
}

// 模块配置信息
export interface ModuleConfig {
  AllowEdit: boolean;                       // false全部字段不允许编辑
  Attributes: Attribute[];
  ChildEntityConfigs: ModuleConfig[];
  Description: string|null;
  DetailTemplateName:string,
  DialogHeight:number,
  DialogWidth:number,
  DisplayName:string,
  EntityAttributes:string|null,
  EntityID:string,
  EntityName:string,
  ExcelRuntimeVersion:unknown,
  Features:Feature[],
  ForeignKeyID:string,
  ForeignKeyPhysicalViewAlias:unknown,
  GroupingPhysicalViewAlias:unknown,
  ID:string,
  ImportTypeEnum:number,
  IsSystem:boolean,
  Language:Language|null,
  Name:string,
  PageSize:number,
  ParentEntityConfigName:string|null,
  ParentID:string,
  PhysicalView:string,
  PrimaryConfigID:string,
  PrimaryConfigName:string|null,
  PrimaryKey:string,
  ServiceDeleteMethod:unknown,
  ServiceGetMethod:unknown,
  ServiceInsertMethod:unknown,
  ServiceUpdateMethod:unknown,
  UniqueScope:number,
  UniqueScopeError:unknown
}
