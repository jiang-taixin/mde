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
