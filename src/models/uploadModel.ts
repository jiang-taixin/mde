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

// 校验结果
export interface ValidateResponse{
  ValidSummary:Summary|null,
  InValidSummary:Summary|null,
  ReportType:number,
  ImpactEntities:[]|null
}

// 获取预览数据
export interface PreviewRequest{
  SessionID:string,
  EntityConfigName:string,
  IsAscending:boolean,
  PageIndex:number,
  PageSize:number,
  ValidationType:ValidationType,
  OperationType:number
}

