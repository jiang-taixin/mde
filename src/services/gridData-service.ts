import type { GridData, RequestGridParams } from "@/models/gridDataModel";

// 获取表格数据
export async function getGridData(params: RequestGridParams): Promise<GridData> {
  return http.post("/API/entity/GetGridData",params);
}
