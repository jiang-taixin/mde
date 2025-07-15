import type { Language } from "@/language";


// 表头参数
export interface Attribute{
  AllowOverwriteNull:boolean,       //
  AttributeID:string,               //
  AttributeName:string,             // 表头显示的名称
  AutoGenerateCode:boolean,         //
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
  IsBusinessPrimaryKey:boolean,
  IsDerivedFromOtherEntity:boolean,
  IsExcelMandatory:boolean,
  IsFuzzyFilter:boolean,
  IsNullable:boolean,
  IsPrimaryKey:boolean,
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
  SortOrder:number,
  TargetDisplayMemberID:string,
  TargetDisplayMemberName:string|null,
  TargetEntityID:string,
  TargetEntityName:string|null,
  TargetLovID:string,
  TargetLovName:string|null,
  TargetValueMemberID:string,
  TargetValueMemberName:string|null
}

// 操作栏那妞参数
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
  Name:string,
  Sequence:number
}

// 模块配置信息
export interface ModuleConfig {
  AllowEdit: boolean;
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
