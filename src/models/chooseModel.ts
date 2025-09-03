// 选择数据请求
export interface ChooseParams{
  PageSize:number,
  PageIndex:number,
  SortAttributeConfigName:string|null,
  EntityConfigName:string,
  IsAscending:boolean,
  SearchCondition:SearchConditionValue | null,
  MasterCondition:Record<string, any>|null,
  RelationshipEntityConfigName:string,
  RelationshipFilterDataID:string
}

// 选择插入数据
export interface InsertParams{
  EntityName:string,
  Records:any[]
}
