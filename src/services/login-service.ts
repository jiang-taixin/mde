// windows登录方式
export async function login(switchAccount: boolean): Promise<UserProfile> {
  const localty = import.meta.env.VITE_MODE === 'localty';
  if(localty){
    // 这个接口给本地调试登录使用
    return http.post("/API/auth/LoginTest",{UserName:'APAC\\JIANGT28'},{skipAuth: true,loading:true});
  }
  return http.get("/API/auth/login",{skipAuth: true, withCredentials:switchAccount?false:true,loading:true});
}
// 设置语言
export async function setLanuguage(LanguageCode:string):Promise<any> {
  return http.post("/API/culture/language",{LanguageCode});
}

// 切换角色
export async function setPrincipal(activePrincipalId:string):Promise<any> {
  return http.post(`/API/auth/SignAs`,{activePrincipalId});
}

// 获取权限组
export async function getPrincipals():Promise<any> {
  return http.get(`/API/auth/GetPrincipalbyUser`);
}
