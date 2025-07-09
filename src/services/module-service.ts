import http from "@/http";
import type { ModuleConfig } from "@/models/moduleConfigModel";
import type { ModuleItem } from "@/models/moduleItemModel";

// 获取模块列表
export async function getModulesList(moduleId: string,principal:string): Promise<[ModuleItem]> {
  return http.get("/API/api/application/GetModules",{params:{moduleId,principal},loading:true});
}

// 获取模块配置
export async function getModuleConfig(configName: string): Promise<ModuleConfig> {
  return http.post("/moduleConfig", { configName });
}
