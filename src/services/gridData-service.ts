import type { GridData, RequestGridParams, RequestHistoryParams } from "@/models/gridDataModel";

// 获取表格数据
export async function getGridData(params: RequestGridParams): Promise<GridData> {
  return http.post("/API/entity/GetGridData",params);
}


// 获取历史数据
export async function getHistoryData(params: RequestHistoryParams): Promise<GridData> {
  return http.post("/API/entity/GetHistoryData",params);
}
