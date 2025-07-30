// 省市
export interface Geography{
  ID:string,
  PYCode:string,                      // 省份编码
  PYAbbr:string,                      // 编码缩写
  ParentID:string,
  ChineseName:string,
  TypeLovItemValue:number,            // ？
  Name:string|null,                   // ？
  CategoryLOVItemName:string|null     // ？
}


// LOV
export interface LovItem{
  LOVID:string,
  LOVName: string,
  LovDisplayName:string|null,
  Name:string,
  Value:number,
  Squeue:number,
  IsDefault:boolean,
  Language:Language|null,
  ID:string
}
