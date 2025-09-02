//entity/GetRefEntityConfig
//entity/GetChooseGridData

import type { ChooseParams } from "@/models/chooseModel";

// 获取配置
export async function getRefEntityConfig(entityConfigName:string,relEntityConfigName:string): Promise<ModuleConfig> {
  return http.get(`/API/entity/GetRefEntityConfig?entityConfigName=${entityConfigName}&relEntityConfigName=${relEntityConfigName}`);
}

// 获取选择列表的数据
export async function getChooseGridData(params:ChooseParams):Promise<any> {
  return http.post("/API/entity/GetChooseGridData",params);
}
