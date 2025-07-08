import type { Principal, UserProfile } from "@/models/userProfileModel";

interface UserProfileState {
  userProfile: UserProfile | null;
  activePrincipal: Principal|null;
  rememberMe:boolean;
}

export const useUserProfileStore = defineStore("userProfile", {
  state: (): UserProfileState => ({
    userProfile: null,
    activePrincipal: null,
    rememberMe:false,
  }),

  actions: {
    setUserProfile(userProfile: UserProfile) {
      this.userProfile = userProfile;
    },

    clearUserProfile() {
      this.userProfile = null;
    },

    setActivePrincipal(principalID:string){
      this.activePrincipal = this.userProfile?.Principals.find(item => item.ID === principalID) as Principal;
    },
    clearActivePrincipal(){
      this.activePrincipal = null;
    },
    setRememberMe(rememberMe: boolean){
      this.rememberMe = rememberMe;
    },
    setLanguage(lang:string){
      (this.userProfile as UserProfile).Language = lang as string;
    }

  },
  getters: {
    isAuthenticated: (state) => state.userProfile !== null,
    hasActivePrincipal:(state) => state.activePrincipal !== null && !!state.userProfile?.Principals.find(item => item.ID === state.activePrincipal?.ID),
  },

  persist:{
    key:"userProfileStore",
    storage:localStorage,
    pick:['userProfile','activePrincipal','rememberMe']
  }
});
