// windows登录方式
export async function login(): Promise<UserProfile> {

  const localty = import.meta.env.VITE_MODE === 'localty';
  if(localty){
    // 这个接口给本地调试登录使用
    return http.post("/API/auth/LoginTest",{UserName:'APAC\\JIANGT28'},{skipAuth: true});
  }
  return http.get("/API/auth/login",{skipAuth: true, withCredentials:true});

}


