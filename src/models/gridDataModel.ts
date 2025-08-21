export enum TableLevel{
  MainTable = 1,
  SubTable = 2
}

export enum ANDOR{
  AND = '0',
  OR = '1',
  ANDOR = '2'
}

// 上移下移结果集
export type MoveResult = Array<[{ Name: "IDA" | "IDB"; Value: string }]>;
// 移动方向
export enum MoveDirection{
  Up = 'Up',
  Down = 'Down',
}

// 导出时的选项
export enum ExportType{
  CurrentPage = 1,               // 导出当前页
  AllWithConditions = 2,         // 导出检索条件下的所有
  All = 3                        // 导出所有
}

// 下载时的选项
export enum DownloadType{
  CurrentPage = 1,               // 下载当前页
  AllWithConditions = 2,         // 下载检索条件下的所有
  AllRecords = 3,                // 下载所有
  WithoutRecords = 4,            // 不带数据下载
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

// 下载模板请求
export interface DownloadParams{
  PageSize:number,
  PageIndex:number,
  SortAttributeConfigName?:string|null,
  EntityConfigName:string,
  IsAscending?:boolean,
  SearchCondition?:SearchConditionValue | null,
  MasterCondition?:Record<string, any>|null,
  EntityName:string
}

export interface GridData{
  TotalRecords:number,
  EntityConfigName:string,
  JsonData:any
}
