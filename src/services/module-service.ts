import http from "@/http";
import type { ModuleConfig } from "@/models/moduleConfigModel";
import type { ModuleItem } from "@/models/moduleItemModel";

// 获取模块列表
export async function getModulesList(moduleId: string): Promise<[ModuleItem]> {
  return http.get("/API/application/GetModules",{params:{moduleId},loading:true});
}

// 获取模块配置(包括操作栏和表头信息)
export async function getModuleConfig(entityConfigName: string): Promise<ModuleConfig> {
  return http.get("/API/application/GetEntityByUser", { params:{entityConfigName} });
}

// 重置配置
export async function resetUserSetting(entityConfigID:string):Promise<ModuleConfig> {
  return http.post(`/API/application/ResetUserSetting?entityConfigID=${entityConfigID}`,{entityConfigID});
}
// 保存配置
export async function saveUserSetting(params:ModuleConfig):Promise<any> {
  return http.post(`/API/application/SaveUserEntityConfig`,params);
}

// 删除--单条删除   批量删除
export async function deleteRecords(EntityName:string,DataIDs:string[]):Promise<any> {
  return http.post(`/API/entity/TryDeleteRecords`,{EntityName,DataIDs});
}
