import http from "@/http";
import type { Entity } from "@/models/entityModel";
import type { CommandData } from "@/models/gridDataModel";
import type { ModuleConfig } from "@/models/moduleConfigModel";
import type { ModuleItem } from "@/models/moduleItemModel";
import type { ResourceType, SecurityItem } from "@/models/SecurityModel";

// 获取模块列表
export async function getModulesList(moduleId: string): Promise<[ModuleItem]> {
  return http.get("/API/application/GetModules",{params:{moduleId},loading:true});
}

// 获取模块配置(包括操作栏和表头信息)
export async function getModuleConfig(entityConfigName: string, showLoading?:boolean): Promise<ModuleConfig> {
  return http.get("/API/application/GetEntityByUser", { params:{entityConfigName} ,loading:showLoading});
}

// 获取实体
export async function getEntity(entityName: string, filterDataId:string): Promise<Entity> {
  return http.get("/API/application/GetEntity", { params:{entityName, filterDataId}});
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
// 执行实体命令   上移下移,设为主助理,移除版本,发布,激活都用这个接口
export async function doEntityCommand(params:CommandData):Promise<any> {
  return http.post(`/API/entity/DoEntityCommand`,params);
}

// 获取权限列表
export async function getSecurityList(resourceType:ResourceType,resourceId:string):Promise<SecurityItem[]> {
  return http.get("/API/security/GetPermissionSetsByResource", { params:{resourceType,resourceId} });
}

// 保存权限
export async function saveSecuritySets(params:any):Promise<any> {
  return http.post("/API/security/SavePermissionSets",  params);
}

// 合并
export async function doMerge(params:any):Promise<any> {
  return http.post("/API/entity/MergeRecords",  params);
}

// 设置权重
export async function updateWeight(params:any):Promise<any> {
  return http.post("/API/entity/UpdateRecords",  params);
}



