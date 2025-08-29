import type { PreviewRequest, UploadResponse, ValidateResponse } from "@/models/uploadModel";

// 上传文件
export async function uploadFile(entityName:string, importType:number, formData:any):Promise<UploadResponse> {
  return http.post(`/API/excel/Upload?entity=${entityName}&importtype=${importType}`,formData,{formData:true,loading:true,timeout:0});
}

// 校验文件
export async function validateFile(entityName:string, sessionID:string, incrementFlag:boolean):Promise<ValidateResponse> {
  return http.get(`/API/excel/Validate?entityName=${entityName}&sessionID=${sessionID}&incrementFlag=${incrementFlag}`,{loading:true});
}


// 获取预览数据
export async function getExcelValidationPreview(params:PreviewRequest):Promise<any> {
  return http.post(`/API/entity/GetExcelValidationPreview`,params);
}

