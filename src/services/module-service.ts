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
