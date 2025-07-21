import type { ModuleTab } from "@/models/moduleItemModel";

export const useModuleTabsStore = defineStore("moduleTabs", {
  state: () => ({
    moduleTabList: [] as ModuleTab[],
    activeModuleTab: "",
  }),
  actions: {
    addModuleTab(moduleTab: ModuleTab) {
      this.moduleTabList.push(moduleTab);
      this.activeModuleTab = moduleTab.Id as string;
    },
    deleteModuleTab(moduleID: string) {
      const index = this.moduleTabList.findIndex((module) => module.Id === moduleID);
      if (index !== -1) {
        this.moduleTabList.splice(index, 1);
        if (this.activeModuleTab === moduleID) {
          this.activeModuleTab = this.moduleTabList[this.moduleTabList.length - 1].Id as string;
        }
      }
    },
    setActiveModuleTab(activeModuleTab: string) {
      this.activeModuleTab = activeModuleTab;
    },
    clearActiveModuleTab(){
      this.moduleTabList = [];
    }
  },
  getters: {},
});
