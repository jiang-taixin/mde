if (Constants) {
  Constants.USER_ROLE_GUEST_NAME = "访客";
  Constants.TRUE_STRING = "是";
  Constants.FALSE_STRING = "否";
  Constants.NULLVALUE_STRING = "<空>";
  Constants.ERR_NO_ENTITY_CONFIG = "请求的实体找不到或者没有权限访问!";
  Constants.STATUS_ACTIVE_STRING = "正常";
  Constants.STATUS_DELETED_STRING = "已删除";
  Constants.MSG_VALID_MAXLENGTH = "长度超过{0}";
  Constants.MSG_VALID_MAXVALUE = "允许最大值为{0}";
  Constants.MSG_VALID_MINVALUE = "允许最小值为{0}";
  Constants.MSG_VALID_FORMAT = "格式错误, 正确的格式是{0}";
  Constants.MSG_VALID_FROM = "内容验证失败，请查看相关控件的错误提示图标";
  Constants.MSG_TITLE_WARNING = "警告";
  Constants.MSG_TITLE_ERROR = "错误";
  Constants.MSG_TITLE_FAILURE = "失败";
  Constants.MSG_TITLE_SUCCESS = "成功";
  Constants.MSG_TITLE_INFO = "信息";
  Constants.MSG_PAGE_LOADING = "页面加载中...";
  Constants.MSG_DELETEREORDS = "确定删除选中记录？";
  Constants.MSG_AutoCalculateWeight = "确定要自动计算权重吗？";
  Constants.MSG_BODY_CLOSETAB_WARNING = "Tab页面正在加载数据，此时不能关闭！";
  Constants.MSG_BODY_SCRIPT_ERROR =
    "<b>发生了错误.</b><p>错误描述: {0}<br>错误行: {1}<br>地址: {2}<br>";
  Constants.MSG_BODY_FRIENDLY_ERROR = "系统异常，请刷新页面或联系管理员";
  Constants.MSG_BODY_NOPRINCIPAL_ERROR = "没有可用的安全身份";
  Constants.FEEDBACK_SUBJECT =
    "%5BMDE-%D6%F7%CA%FD%BE%DD%B9%DC%C0%ED%CF%B5%CD%B3%5D%A3%AD%B2%D9%D7%F7%2F%CE%CA%CC%E2%C3%E8%CA%F6";
  Constants.FEEDBACK_BODY =
    "%CE%CA%CC%E2%B7%B4%D3%B3%C8%CBNTID%3A%0a%0d%0a%0d%C3%E8%CA%F6%3A%0a%0d%0a%0d%CE%CA%CC%E2%BD%D8%CD%BC%3A";
}
if (WebApplication) {
  WebApplication.prototype.desktopCaption = "我的桌面";
  WebApplication.prototype.navigateExplorerCaption = "系统导航";
  WebApplication.prototype.tabMenuItemCloseCaption = "关闭当前页";
  WebApplication.prototype.tabMenuItemCloseAllCaption = "关闭除本页外的所有页.";
  WebApplication.prototype.tabMenuItemRefreshCaption = "刷新当前页";
  (WebApplication.prototype.tabOpenWarningText =
    "页面打开过多会导致系统变慢，建议关闭一些，确定要继续打开新的页面吗?"),
    (WebApplication.prototype.weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
  WebApplication.prototype.statusLabelDateCaption = "今天是";
  WebApplication.prototype.statusButtonAboutCaption = "关于";
  WebApplication.prototype.statusButtonFeedbackCaption = "反馈";
  WebApplication.prototype.toolbarItemLogoutPrompt = "确定要切换用户吗?";
  WebApplication.prototype.toolbarItemLogoutTooltip = "点击这里切换用户";
  WebApplication.prototype.toolbarItemHelpTooltip = "帮助";
  WebApplication.prototype.toolbarItemCollapseTooltip = "收起/展开顶部区域";
  WebApplication.prototype.toolbarItemSwitchOtherAccountCaption = "以其他域用户帐号登录系统";
  WebApplication.prototype.toolbarItemSwitchOtherAccountTooltip = "请选择其他域用户帐号登录系统";
}
if (_BaseApp) {
  _BaseApp.prototype.signinDialogTitle = "登录系统";
  _BaseApp.prototype.principalListLabel = "以身份";
  _BaseApp.prototype.rememberPrincipalLabel = "记住我";
  _BaseApp.prototype.noPrincipalSelectedMessage = "没有任何可用的身份!";
  _BaseApp.prototype.signinDialogSignBtnText = "登录";
  _BaseApp.prototype.signinDialogCloseBtnText = "关闭";
}
if (Ext.ux.ModuleTreePanel) {
  Ext.ux.ModuleTreePanel.prototype.refreshBtnTooltip = "刷新菜单";
}
if (Ext.ux.UploadDialog) {
  Ext.ux.UploadDialog.prototype.defaultText = "请选择Excel文件";
  (Ext.ux.UploadDialog.prototype.excelValidateResultMessage =
    "共: <a href=\"#\" style=\"cursor:hand; text-decoration:underline; color: blue;\" onclick=\"Ext.WindowMgr.get('{3}').previewExcel('2','{4}',{6},'{5}',{0});\"><b>{0}</b></a>条记录; 验证通过: <a href=\"#\" onclick=\"Ext.WindowMgr.get('{3}').previewExcel('1','{4}',{6},'{5}',{1});\" style=\"cursor:hand; text-decoration:underline; color: green;\"><b>{1}</b></a>条; 未通过: <a href=\"#\" onclick=\"Ext.WindowMgr.get('{3}').previewExcel('0','{4}',{6},'{5}',{2});\" style=\"cursor:hand; text-decoration:underline; color: red;\"><b>{2}</b></a>条."),
    (Ext.ux.UploadDialog.prototype.uploadSuccess = "上传成功，请点击验证按钮进行验证");
  Ext.ux.UploadDialog.prototype.uploadFail = "上传失败，请检查具体的错误信息";
  Ext.ux.UploadDialog.prototype.uploadCongratulate = "恭喜你上传成功。";
  Ext.ux.UploadDialog.prototype.btnUploadText = "上传";
  Ext.ux.UploadDialog.prototype.validataSuccess = "验证成功，请点击导入进行下一步操作";
  Ext.ux.UploadDialog.prototype.importSuccess = "恭喜您已经成功导入";
  Ext.ux.UploadDialog.prototype.dataValidate =
    '请点击<a href="#" style="cursor:hand; text-decoration:underline; color: blue;" onclick="Ext.WindowMgr.get(\'{0}\').downLoadExcel();">下载</a>查看';
  Ext.ux.UploadDialog.prototype.IsIncremental = "是否是增量数据";
  Ext.ux.UploadDialog.prototype.windowTitle = "Excel 上传";
  Ext.ux.UploadDialog.prototype.btnProceed = "继续";
  Ext.ux.UploadDialog.prototype.btnImportText = "导入";
  Ext.ux.UploadDialog.prototype.btnCloseText = "关闭";
  Ext.ux.UploadDialog.prototype.btnUploadValidateText = "验证";
  (Ext.ux.UploadDialog.prototype.filedLableOperationTipsText = "操作提示"),
    (Ext.ux.UploadDialog.prototype.fieldLabelResultsText = "处理结果");
  Ext.ux.UploadDialog.prototype.fieldLabelExcelText = "Excel 文件";
  Ext.ux.UploadDialog.prototype.msgLableValidate = "请稍等，系统正在处理您的请求......";
  Ext.ux.UploadDialog.prototype.msgLableInvalidText = "上传文件格式错误！";
  Ext.ux.UploadDialog.prototype.msgResultUploadSuccess = "验证数据成功。";
  Ext.ux.UploadDialog.prototype.msgResultUploadFailed = "验证数据失败。";
  Ext.ux.UploadDialog.prototype.msgTipsUploadSuccess = "请点击导入按钮导入数据";
  Ext.ux.UploadDialog.prototype.msgTipsUploadFailed = "请点击上面的数字链接检查验证结果。";
}
if (Ext.ux.UploadPreviewDialog) {
  Ext.ux.UploadPreviewDialog.prototype.loadMessage = "加载数据......";
  Ext.ux.UploadPreviewDialog.prototype.preview = "数据预览";
  Ext.ux.UploadPreviewDialog.prototype.excelNUDMessage =
    "共: <a href=\"#\" style=\"cursor:hand; text-decoration:underline; color: blue;\" onclick=\"FeatureLibrary.loadPreviewExcelData('{5}','{6}','0','{7}',{0},'{4}');\"><b>{0}</b></a>条; 新增: <a href=\"#\" onclick=\"FeatureLibrary.loadPreviewExcelData('{5}','{6}','1','{7}',{1},'{4}');\" style=\"cursor:hand; text-decoration:underline; color: green;\"><b>{1}</b></a>条; 更新: <a href=\"#\" onclick=\"FeatureLibrary.loadPreviewExcelData('{5}','{6}','2','{7}',{2},'{4}');\" style=\"cursor:hand; text-decoration:underline; color: red;\"><b>{2}</b></a>条;删除: <a href=\"#\" onclick=\"FeatureLibrary.loadPreviewExcelData('{5}','{6}','3','{7}',{3},'{4}');\" style=\"cursor:hand; text-decoration:underline; color: red;\"><b>{3}</b></a>条.";
}
if (Ext.ux.ChooseRecordsDialog) {
  Ext.ux.ChooseRecordsDialog.prototype.lblValidateMsg = "请稍等，系统正在处理您的请求......";
  Ext.ux.ChooseRecordsDialog.prototype.winTitle = "添加_";
  Ext.ux.ChooseRecordsDialog.prototype.lackEntityConfigMessage = "缺少Entity";
  Ext.ux.ChooseRecordsDialog.prototype.selectMessage = "至少选择一条数据";
  Ext.ux.ChooseRecordsDialog.prototype.errMessage = "捕捉到异常";
  Ext.ux.ChooseRecordsDialog.prototype.btnSaveText = "保存";
  Ext.ux.ChooseRecordsDialog.prototype.btnCloseText = "关闭";
}
if (Ext.ux.HospitalStrengthWeighDialog) {
  Ext.ux.HospitalStrengthWeighDialog.prototype.lTotalMessage = "权重之和小于1，您确定要提交吗？";
  Ext.ux.HospitalStrengthWeighDialog.prototype.mTotalMessage = "权重之和大于1.";
  Ext.ux.HospitalStrengthWeighDialog.prototype.errMessage = "捕捉到异常";
  Ext.ux.HospitalStrengthWeighDialog.prototype.selectMessage = "至少选择一条数据";
  Ext.ux.HospitalStrengthWeighDialog.prototype.btnAverageText = "平均";
  Ext.ux.HospitalStrengthWeighDialog.prototype.btnSaveText = "保存";
  Ext.ux.HospitalStrengthWeighDialog.prototype.btnCloseText = "关闭";
}
if (Ext.ux.DrugstoreStrengthWeightDialog) {
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.lTotalMessage = "权重之和小于1，您确定要提交吗？";
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.mTotalMessage = "权重之和大于1.";
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.errMessage = "捕捉到异常";
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.selectMessage = "至少选择一条数据";
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.btnAverageText = "平均";
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.btnSaveText = "保存";
  Ext.ux.DrugstoreStrengthWeightDialog.prototype.btnCloseText = "关闭";
}
if (Ext.ux.AccountStrengthWeightDialog) {
  Ext.ux.AccountStrengthWeightDialog.prototype.lTotalMessage = "权重之和小于1，您确定要提交吗？";
  Ext.ux.AccountStrengthWeightDialog.prototype.mTotalMessage = "权重之和大于1.";
  Ext.ux.AccountStrengthWeightDialog.prototype.errMessage = "捕捉到异常";
  Ext.ux.AccountStrengthWeightDialog.prototype.selectMessage = "至少选择一条数据";
  Ext.ux.AccountStrengthWeightDialog.prototype.btnAverageText = "平均";
  Ext.ux.AccountStrengthWeightDialog.prototype.btnSaveText = "保存";
  Ext.ux.AccountStrengthWeightDialog.prototype.btnCloseText = "关闭";
}
if (Ext.ux.AdvancedGridPanel) {
  Ext.ux.AdvancedGridPanel.prototype.loadMessage = "加载数据......";
  Ext.ux.AdvancedGridPanel.prototype.lackEntityConfigMessage = "缺少Entity";
  Ext.ux.AdvancedGridPanel.prototype.emptyRecords = "没有记录";
  Ext.ux.AdvancedGridPanel.prototype.groupingShowDetail = "详细";
}
if (Ext.ux.AdvancedPagingToolBar) {
  Ext.ux.AdvancedPagingToolBar.prototype.emptyMsg = "没有记录";
  Ext.ux.AdvancedPagingToolBar.prototype.firstText = "第一页";
  Ext.ux.AdvancedPagingToolBar.prototype.prevText = "上一页";
  Ext.ux.AdvancedPagingToolBar.prototype.nextText = "下一页";
  Ext.ux.AdvancedPagingToolBar.prototype.lastText = "最后一页";
  Ext.ux.AdvancedPagingToolBar.prototype.refreshText = "刷新";
  Ext.ux.AdvancedPagingToolBar.prototype.pageSizeText = "页大小";
  Ext.ux.AdvancedPagingToolBar.prototype.pageSizeText = "总记录:{0}";
  Ext.ux.AdvancedPagingToolBar.prototype.valSelectionsMsg =
    "选中项没有进行保存，点击YES所选数据将会丢失，要继续吗？";
}
if (Ext.ux.ExcelBaseDialog) {
  Ext.apply(Ext.ux.ExcelBaseDialog.prototype, {
    closeButtonText: "关闭",
    allRecordsWithParentRecordInfo: "导出 {0} 所有记录并关联 {1} 中相关数据",
    allRecordsWithoutParentRecordInfo: "导出 {0} 中当前搜索条件下所有记录",
    currentPageRecords: "只导出 {0} 中当前页记录",
    allRecords: "导出 {0} 中当前搜索条件下所有记录",
  });
}
if (Ext.ux.ExportExcelDialog) {
  Ext.apply(Ext.ux.ExportExcelDialog.prototype, {
    exportTitle: "导出到Excel文件 -- ",
    exportOption: "选择要导出的数据",
    childrenTitle: "子记录:",
    exportButtonText: "导出",
  });
}
if (Ext.ux.DownloadExcelTemplateDialog) {
  Ext.apply(Ext.ux.DownloadExcelTemplateDialog.prototype, {
    downloadTemplateButtonText: "下载模板",
    downloadDialogTitle: "下载Excel模板 -- {0}",
    templateWithoutRecords: "只下载 {0} 模板(不包含记录)",
    dialogInfo: "此Entity不支持Excel的导入!",
  });
}
if (Ext.ux.form.ProvinceCityField) {
  Ext.apply(Ext.ux.form.ProvinceCityField.prototype, {
    provinceLabel: "省",
    cityLabel: "市",
    empText: "--请选择--",
  });
}
if (Ext.ux.form.AutoComboBox) {
  Ext.apply(Ext.ux.form.AutoComboBox.prototype, { emptyText: "--请选择--" });
}
if (Ext.ux.form.LovField) {
  Ext.apply(Ext.ux.form.LovField.prototype, { emptyItemText: "--请选择--" });
}
if (Ext.ux.form.EntityDataField) {
  Ext.apply(Ext.ux.form.EntityDataField.prototype, { emptyItemText: "--请选择--" });
}
if (DetailDialog) {
  Ext.apply(DetailDialog, {
    insertTitle: "添加{0}记录",
    updateTitle: "修改{0}记录",
    copyToAddTitle: "复制添加{0}记录",
    saveButtonText: "保存",
    closeButtonText: "关闭",
  });
}
if (Ext.ux.AdvancedDetailDialog) {
  Ext.apply(Ext.ux.AdvancedDetailDialog.prototype, {
    titleTemplates: {
      InsertRecords: "添加{0}记录",
      UpdateRecords: "修改{0}记录",
      DoEntityCommand: "复制添加{0}记录",
    },
    saveButtonText: "保存",
    closeButtonText: "关闭",
  });
}
if (Ext.ux.MergeDialog) {
  Ext.apply(Ext.ux.MergeDialog.prototype, {
    title: "合并{0}记录",
    mergeButtonText: "确定",
    closeButtonText: "关闭",
    maskMessage: "正在加载。。。",
    mergeSuccess: "记录合并成功！",
    canNotGetDataAddedJustNow: "系统发生了异常，服务没有返回需要的数据",
    mergeFailed: "记录合并失败。",
    attriteNameHeader: "字段",
    record1Header: "记录1",
    record2Header: "记录2",
    newRecordHeader: "合并结果",
  });
}
if (Ext.ux.HistoryDialog) {
  Ext.ux.HistoryDialog.prototype.histroyTitle = "历史";
  Ext.ux.HistoryDialog.prototype.searchMsg = "请稍等，正在为你检索......";
  Ext.ux.HistoryDialog.prototype.btnSearchText = "检索";
  Ext.ux.HistoryDialog.prototype.lblempty = "请选择";
  Ext.ux.HistoryDialog.prototype.lblfrom = "从";
  Ext.ux.HistoryDialog.prototype.lblto = "到";
  Ext.ux.HistoryDialog.prototype.OperatedBy = "操作人";
  Ext.ux.HistoryDialog.prototype.OperatedOn = "操作时间";
  Ext.ux.HistoryDialog.prototype.OperatedType = "操作类型";
  Ext.ux.HistoryDialog.prototype.endTimeLessStartTime = "结束日期小于开始日期";
  Ext.ux.HistoryDialog.prototype.startTimeMoreEndTime = "开始日期大于结束日期";
}
if (Ext.ux.DateSearchDialog) {
  Ext.ux.DateSearchDialog.prototype.dateTitle = "日期选择";
  Ext.ux.DateSearchDialog.prototype.searchMsg = "请稍等，正在为你检索......";
  Ext.ux.DateSearchDialog.prototype.btnSearchText = "检索";
  Ext.ux.DateSearchDialog.prototype.lblempty = "请选择";
  Ext.ux.DateSearchDialog.prototype.lblfrom = "从";
  Ext.ux.DateSearchDialog.prototype.lblto = "到";
  Ext.ux.DateSearchDialog.prototype.endTimeIsNull = "结束日期不能为空";
  Ext.ux.DateSearchDialog.prototype.startTimeIsNuLL = "开始日期不能为空";
  Ext.ux.DateSearchDialog.prototype.endTimeLessStartTime = "结束日期小于开始日期";
  Ext.ux.DateSearchDialog.prototype.startTimeMoreEndTime = "开始日期大于结束日期";
}
if (Ext.ux.form.InputCheckField) {
  Ext.ux.form.InputCheckField.prototype.buttonText = "查询";
  Ext.ux.form.InputCheckField.prototype.buttonOkText = "确定";
  Ext.ux.form.InputCheckField.prototype.buttonCloseText = "关闭";
  Ext.ux.form.InputCheckField.prototype.lblwaitMsg = "检索中。。。。";
  Ext.ux.form.InputCheckField.prototype.defaulttValue = "请输入";
  Ext.ux.form.InputCheckField.prototype.warningMsg = "请输入关键词";
  Ext.ux.form.InputCheckField.prototype.getConfigFail = "获取配置失败！";
  Ext.ux.form.InputCheckField.prototype.result = "结果:";
  Ext.ux.form.InputCheckField.prototype.resultInfo = "没有匹配到相关数据";
  Ext.ux.form.InputCheckField.prototype.searchTitle = "检索";
  Ext.ux.form.InputCheckField.prototype.angerSigns = "输入内容包含危险字符";
  Ext.ux.form.InputCheckField.prototype.selectOneAtLeast = "请选择一条记录";
  Ext.ux.form.InputCheckField.prototype.emptyText = "请输入检索内容";
}
if (Ext.ux.form.TerritoryVersion) {
  Ext.ux.form.TerritoryVersion.prototype.fieldLabel = "当前区域版本:";
  Ext.ux.form.TerritoryVersion.prototype.empText = "--请选择--";
}
if (Ext.ux.FuzzySearchPanel) {
  Ext.ux.FuzzySearchPanel.prototype.btnSearchText = "查询";
}
if (Ext.ux.AdvancedSearchPanel) {
  Ext.ux.AdvancedSearchPanel.prototype.btnSearchText = "高级查询";
  Ext.ux.AdvancedSearchPanel.prototype.btnSubmitText = "查询";
  Ext.ux.AdvancedSearchPanel.prototype.advancedSearchPanelTitle = "高级查询选项";
}
if (Ext.ux.DeletionImpactDialog) {
  Ext.ux.DeletionImpactDialog.prototype.panelTitle = "影响实体";
  Ext.ux.DeletionImpactDialog.prototype.winTitle = "删除影响";
  Ext.ux.DeletionImpactDialog.prototype.toolTipInfo = "请先删除影响数据";
  Ext.ux.DeletionImpactDialog.prototype.lblwaitMsg = "请稍等，正在处理中.....";
  Ext.ux.DeletionImpactDialog.prototype.waiting = "等待...";
  Ext.ux.DeletionImpactDialog.prototype.impactTypeDirect = "可以直接删除相关的子数据";
  Ext.ux.DeletionImpactDialog.prototype.impactTypeIndirect =
    "存在相关的子数据，不能直接删除，需要联系相关数据的业务人员进行确认";
  Ext.ux.DeletionImpactDialog.prototype.btnProcessText = "导入";
  Ext.ux.DeletionImpactDialog.prototype.btnCloseText = "关闭";
}
if (Ext.ux.DeletionDataPreviewDialog) {
  Ext.ux.DeletionDataPreviewDialog.prototype.title = "数据预览";
}
if (Ext.ux.FuzzySearchPanel) {
  Ext.ux.FuzzySearchPanel.prototype.keyWordsTip = "请输入关键字";
}
if (Ext.ux.form.BoolValueCombox) {
  Ext.ux.form.BoolValueCombox.prototype.empText = "--请选择--";
  Ext.ux.form.BoolValueCombox.prototype.yesText = "是";
  Ext.ux.form.BoolValueCombox.prototype.noText = "否";
}
if (Ext.ux.ContactRequestDetailForm) {
  Ext.apply(Ext.ux.ContactRequestDetailForm.prototype, {
    AcceptRequestContent: "请求已接受。",
    RejectRequestContent: "错误的请求，请检查。",
    AcceptDuplicateRequestContent: "请求已接受。",
    RejectDuplicateRequestContent: "医院[{0}]已经有同拼音姓名客户[{1}]存在,请再次核对。",
  });
}
if (FeatureLibrary) {
  Ext.apply(FeatureLibrary, {
    deleteVersionTitle: "确认信息",
    deleteVersionMessage: "此操作会删除所有和此版本相关的数据，且无法恢复，确认删除此版本？",
    deleteVersionSuccess: "成功",
    shouldNotMergeMessage: "不能对临时医院进行合并操作!",
    notSupportExcel: "当前实体不支持导入功能",
    methodUndefinied: "方法为定义",
    deleteSuccess: "删除成功",
    dangerPrompt: "此操作可能有风险，确认要继续吗？",
    setPrimaryAssistantPrompt: "确定要设置当前选中记录为主助理吗？",
    saveSuccess: "保存设置成功",
    publishSuccess: "发布成功",
    selectOneMessage: "请至少选择一条记录",
    ErrorCode: "错误代码",
    ErrorMessage: "错误信息",
  });
}
if (FormHelper) {
  Ext.apply(FormHelper, { processMessageTitle: "提示", processMessage: "正在处理数据，请稍候..." });
}
if (Ext.ux.AdvancedContactRequestGridPanel) {
  Ext.ux.AdvancedContactRequestGridPanel.prototype.acceptContencts = "请求已接受。";
  Ext.ux.AdvancedContactRequestGridPanel.prototype.rejectContencts = "错误的请求，请检查。";
  Ext.ux.AdvancedContactRequestGridPanel.prototype.resendTooltip = "重派记录";
}
if (Ext.ux.PrincipalDialog) {
  Ext.apply(Ext.ux.PrincipalDialog.prototype, {
    title: "安全身份",
    userLabelText: "用户",
    groupLabelText: "用户组",
    organizationLabelText: "部门",
    titleLabelText: "职位",
    okButtonText: "确定",
    cancelButtonText: "取消",
    noSelectionError: "至少选择一条数据.",
  });
}
if (Ext.ux.SecurityPrincipalDialog) {
  Ext.apply(Ext.ux.SecurityPrincipalDialog.prototype, {
    resource: {
      security: "授权",
      entityName: {
        Entity: "实体对象",
        Module: "模块",
        RowFilter: "实体对象行过滤",
        RowFilterAttribute: "实体对象行过滤属性",
      },
      header: {
        PrincipalName: "主体名称",
        PrincipalType: "主体类型",
        Scope: "范围",
        Create: "新增",
        Read: "查看",
        Update: "更新",
        Delete: "删除",
        DenyUpdate: "禁止更新",
        DenyRead: "禁止查看",
      },
      button: { Remove: "移除", Add: "添加", Save: "保存", Close: "关闭" },
      Messages: {
        Remove: "点击保存后这些要移除的授权记录将无法恢复，确认要继续吗？",
        Save: "没有对新添加的授权记录进行任何授权操作，继续后将不会保存相关的授权，确认要继续吗？",
      },
    },
  });
}
if (Ext.ux.PyDuplicatePromptingDialog) {
  Ext.apply(Ext.ux.PyDuplicatePromptingDialog.prototype, {
    title: "重复医生提醒",
    btnContinueText: "继续执行",
    btnCancelText: "取消",
    warnning: "你确认要创建这个医生么？请点击“继续执行”进行创建，或点击“取消”按钮返回创建界面",
  });
}
