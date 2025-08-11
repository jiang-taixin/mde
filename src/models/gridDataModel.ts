export enum TableLevel{
  MainTable = 1,
  SubTable = 2
}

export enum ANDOR{
  AND = '0',
  OR = '1',
  ANDOR = '2'
}

export enum ExportType{
  CurrentPage = 1,               // 导出当前页
  AllWithConditions = 2,         // 导出检索条件下的所有
  All = 3                        // 导出所有
}

export interface SearchConditionValue{
  AndOr: ANDOR,
  Conditions:Record<string, any>
}

// 请求列表数据
export interface RequestGridParams{
  PageSize:number,
  PageIndex:number,
  SortAttributeConfigName?:string|null,
  EntityConfigName:string,
  IsAscending?:boolean,
  SearchCondition?:SearchConditionValue | null,
  MasterCondition?:Record<string, any>|null,
}

// 请求历史列表数据
export interface RequestHistoryParams extends RequestGridParams{
  OperationOnStart:string,
  OperationOnEnd:string,
  DataID:string
}



// 导出数据请求
export interface ExportParams{
  PageSize:number,
  PageIndex:number,
  SortAttributeConfigName?:string|null,
  EntityConfigName:string,
  IsAscending?:boolean,
  SearchCondition?:SearchConditionValue | null,
  MasterCondition?:Record<string, any>|null,
  AttributeConfigNames:string[],
  ChildEntityConfigNames:string[]
}

export interface GridData{
  TotalRecords:number,
  EntityConfigName:string,
  JsonData:any
}
