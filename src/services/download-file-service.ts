import type { DownloadParams, ExportParams } from "@/models/gridDataModel";

// 下载excel 模板   不带数据
export async function downloadTemplate(entityName:string): Promise<any> {
  return http.get(`/API/excel/ExportExcelTemplate?entityName=${entityName}`,{responseType:'blob',loading:true,timeout:0});
}

// 下载excel 模板   带数据
export async function downloadTemplateWithData(params: DownloadParams): Promise<any> {
  return http.post('/API/excel/ExportExcelTemplateWithData',params,{responseType:'blob',loading:true,timeout:0});
}



// 导出excel数据
export async function exportExcelData(params:ExportParams):Promise<any> {
  return http.post('/API/excel/ExportExcelData',params,{responseType:'blob',loading:true,timeout:0});
}


// 上传文件时下载检查文件
export async function downloadValidatedExcel(entityName:string,sessionID:string):Promise<any> {
  return http.get(`/API/excel/DownLoadValidatedExcel?entityName=${entityName}&sessionID=${sessionID}`,{responseType:'blob',loading:true,timeout:0});
}
