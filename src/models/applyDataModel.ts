// 医生申请里面的销售单元下拉
export interface ContactRequestQueue{
  Code:string,
  ID:string,
  IsMine:boolean,
  Name:string
}

// 医生申请预览数据
export interface ContactRequestSummary{
  Expired:number,
  Expiring:number,
  Finished:number,
  New:number,
  Type:number,
  Summary?:number,
  TypeName:string
}

// 获取医生申请列表
export interface RequestContactParam{
  RType:number,
  Status:number|null,
  Queues:string[],
  PageIndex:number,
  PageSize:number,
  IsAscending:boolean
}
