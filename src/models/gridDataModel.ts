export enum TableLevel{
  MainTable = 1,
  SubTable = 2
}

export enum ANDOR{
  AND = '0',
  OR = '1',
  ANDOR = '2'
}

export interface SearchConditionValue{
  AndOr: ANDOR,
  Conditions:Record<string, any>
}

export interface RequestGridParams{
  PageSize:number,
  PageIndex:number,
  SortAttributeConfigName?:string|null,
  EntityConfigName:string,
  IsAscending?:boolean,
  SearchCondition?:SearchConditionValue | null,
  MasterCondition?:Record<string, any>|null,
}


export interface GridData{
  TotalRecords:number,
  EntityConfigName:string,
  JsonData:any
}
