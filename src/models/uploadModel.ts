// 上传结果
export interface UploadResponse{
  SessionID:string,
  IsSucceed: boolean,
  Message: string,
}

// 验证类型
export enum ValidationType{
  All = 2,
  Valid = 1,
  Invalid = 0
}

export interface Summary{
  Total?:number,
  Delete:number,
  Insert:number,
  Merge:number,
  Update:number
}

export interface ImpactEntity{
  DisplayName:string,
  EntityName:string,
  EntityConfigID:string,
  EntityConfigName:string,
  EntityConfigDisplayName:string|null,
  ImpactType:number,
  Count:number,
  DataIDs:string[],
}

// 校验结果
export interface ValidateResponse{
  ValidSummary:Summary|null,
  InValidSummary:Summary|null,
  ReportType:number,
  ImpactEntities:ImpactEntity[]|null
}

// 获取预览数据
export interface PreviewRequest{
  SessionID:string,
  EntityConfigName:string,
  IsAscending?:boolean,
  PageIndex:number,
  PageSize:number,
  ValidationType?:ValidationType,
  OperationType?:number
}

