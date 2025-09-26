// EntityAttribute 参数
export interface EntityAttribute {
  AllowOverwriteNull: boolean,       //
  AutoGenerateCode: boolean,         // 这个是true   添加和编辑时都不允许编辑
  DataType: string | null,             // 数据类型
  DefaultValue: string | null,
  Description: string | null,
  DigitalPrecision: number,
  DisplayFormat: string | null,
  DisplayName: string,
  EntityID: string,
  EntityName: string,
  ExtControlType: string,
  ID: string,
  IsNullable: boolean,
  IsPrimaryKey: boolean,                 // true时字段不能编辑
  IsSystem: boolean,
  Language: Language,
  Length: number,
  Name: string,
  PhysicalField: string,
  PromptMessage: string | null,
  ReadOnly: boolean,
  RefEntity: string,
  RegExpression: string | null,
  TargetDisplayMemberID: string,
  TargetDisplayMemberName: string | null,
  TargetEntityID: string,
  TargetEntityName: string | null,
  TargetLovID: string,
  TargetLovName: string | null,
  TargetValueMemberID: string,
  TargetValueMemberName: string | null,
}

export interface Entity {
  Language: string,
  UniqueScope: number,
  UniqueScopeError: string,
  AllowEdit: boolean,
  ID: string,
  EntityAttributes: EntityAttribute[],
  Name: string,
  PrimaryKey: string,
  PhysicalView: string,
  Description: string,
  IsSystem: boolean,
  ImportTypeEnum: number,
  DetailTemplateName: string,
  PrimaryConfigID: string,
  PrimaryConfigName: string,
}
