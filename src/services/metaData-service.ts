import http from "@/http";
import type { Geography } from "@/models/metaDataModel";

// 获取省份
export async function getGeoGraphyList(parentId: string): Promise<[Geography]> {
  return http.get("/API/api/entity/GetGeographyItem",{params:{parentId}});
}
