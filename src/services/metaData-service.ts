import http from "@/http";
import type { Geography, LovItem } from "@/models/metaDataModel";

// 获取省份
export async function getGeoGraphyList(parentId: string): Promise<[Geography]> {
  return http.get("/API/entity/GetGeographyItem",{params:{parentId}});
}


// 获取lov信息
export async function getLovItems(lovId:string):Promise<[LovItem]>{
  return http.get("/API/entity/GetLovItems",{params:{lovId}});
}
