import type { Language } from "@/language"

// 角色类型
export enum PrincipalType {
  Group = "Group",
}

// 角色
export interface Principal{
  ID:string,
  Name: string,
  Type: PrincipalType,
  IsActive: boolean
}

// 用户信息
export interface UserProfile{
  LogonName:string,
  Principals: Principal[],
  AppVersion:string,
  Token:string,
  Language:Language | string;
}
