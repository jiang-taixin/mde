export enum TableLevel{
  MainTable = 1,
  SubTable = 2
}

export interface RequestGridParams{
  PageSize:number,
  PageIndex:number,
  SortAttributeConfigName:string|null,
  EntityConfigName:string,
  IsAscending:boolean,
  SearchCondition:unknown,
  MasterCondition:unknown
}


export interface GridData{
  TotalRecords:number,
  EntityConfigName:string,
  JsonData:any
}
