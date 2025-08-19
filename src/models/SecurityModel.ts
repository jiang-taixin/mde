/** 自定义表头列    前端固定
 * 涉及模块：模块管理--模块      元数据管理--行过滤规则
 * 对应操作  ---    权限
 */
export interface CustomColumn{
  Name: string,
  DisplayName:string,
  SortOrder:number|null,
  DefaultWidth:number
}

// 请求权限数据的资源类型    目前只有Module和RowFilter用到了
export enum ResourceType{
  Module = 0,
  Entity = 1,
  Attribute = 2,
  RowFilter = 3,
  RowFilterAttribute = 4
}
// 权限的角色类型
export enum SecurityPrincipalType{
  User = 1,
  Group = 2,
  Organization = 3,
  Title = 4
}

// Scope
export enum PrincipalScope{
  Current = 0,
  Child = 1,
  All = 2,
}

export enum PermissionFlagType{
  Create = 1,
  Read = 2,
  Update = 3,
  Delete = 4,
}

export interface PermissionFlag{
  ID:string,
  PermissionFlag:PermissionFlagType
}

// 权限
export interface SecurityItem{
  ID:string,
  PermissionFlag:PermissionFlagType,
  PrincipalID:string,
  PrincipalName:string,
  ResourceID:string,
  ResourceName:string|null,
  ResourceType:ResourceType,
  Scope:number,
  PermissionFlags:PermissionFlag[];
  PrincipalType:SecurityPrincipalType
}


// 权限变化   如新增删除等
export interface SecurityRacItem{
  ID:string,
  PermissionFlag:PermissionFlagType,
  PrincipalID:string,
  PrincipalName:string,
  PrincipalType:SecurityPrincipalType,
  ResourceID:string,
  ResourceType:ResourceType,
}
