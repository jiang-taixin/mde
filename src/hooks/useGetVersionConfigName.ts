export function useGetVersionConfigName() {
  const entityConfigMapping:Record<string, string> = {
    HospitalStrengthWeightConfig: 'SfeTerritoryVersionConfig',
    DrugstoreStrengthWeightConfig: 'RsfeTerritoryVersionConfig',
    AccountStrengthWeightConfig: 'RsfeTerritoryVersionConfig',
    RegionContactConfig: 'SfeTerritoryVersionConfig',
    TerritoryStrengthPackageConfig: 'SfeTerritoryVersionConfig',
    HospitalSplitConfig: 'SfeTerritoryVersionConfig',
    PKAMPortfolioConfig: 'KATerritoryVersionConfig',
    COTerritoryVersionConfig: 'COTerritoryVersionConfig',
    NonSalesPositionConfig: 'RsfeTerritoryVersionConfig',
    RsfePrefix: 'Rsfe',
    SfePrefix: 'Sfe',
    TMEDPrefix: 'TMED',
    PKAMPrefix: 'PKAM',
    COPrefix: 'CO'
  }
  const getConfigName = (entityConfigName: string) => {
    let versionCfgName = entityConfigMapping[entityConfigName];
    if (!versionCfgName) {
      if (entityConfigName.startsWith(entityConfigMapping.SfePrefix)
        || entityConfigName.indexOf(entityConfigMapping.SfePrefix) > 0) {
        versionCfgName = 'SfeTerritoryVersionConfig';
      }
      else if (entityConfigName.startsWith(entityConfigMapping.RsfePrefix)
        || entityConfigName.indexOf(entityConfigMapping.RsfePrefix) > 0) {
        versionCfgName = 'RsfeTerritoryVersionConfig';
      }
      else if (entityConfigName.startsWith(entityConfigMapping.TMEDPrefix)
        || entityConfigName.indexOf(entityConfigMapping.TMEDPrefix) > 0) {
        versionCfgName = 'TMEDTerritoryVersionConfig';
      }
      else if (entityConfigName.startsWith(entityConfigMapping.PKAMPrefix)
        || entityConfigName.indexOf(entityConfigMapping.PKAMPrefix) > 0) {
        versionCfgName = 'KATerritoryVersionConfig';
      }
      else if (entityConfigName.startsWith(entityConfigMapping.COPrefix)
        || entityConfigName.indexOf(entityConfigMapping.COPrefix) > 0) {
        versionCfgName = 'COTerritoryVersionConfig';
      }
      else { versionCfgName = 'TMKTTerritoryVersionConfig'; }
    }
    return versionCfgName;
  }
  return {
    getConfigName
  }
};
