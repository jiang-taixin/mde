import http from "@/http";
import type { ModuleConfig } from "@/models/moduleConfig";
import type { ModuleItem } from "@/models/ModuleItem";

// 获取模块列表
export async function getModulesList(moduleId: string): Promise<[ModuleItem]> {
  return http.post("/modules", { moduleId });
}

// 获取模块配置
export async function getModuleConfig(configName: string): Promise<[ModuleItem]> {
  return http.post("/moduleConfig", { configName });
}
