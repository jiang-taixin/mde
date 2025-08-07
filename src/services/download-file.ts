import type { ExportParams } from "@/models/gridDataModel";

// 下载excel 模板
export async function ExportExcelTemplate(entityName: string): Promise<any> {
  return http.get(`/API/excel/ExportExcelTemplate?entityName=${entityName}`,{responseType:'blob',loading:true,timeout:0});
}


// 导出excel数据
export async function ExportExcelData(params:ExportParams):Promise<any> {
  return http.post('/API/excel/ExportExcelData',params,{responseType:'blob',loading:true,timeout:0});
}
