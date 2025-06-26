///<reference path="vswd-ext_2.0.2.js" />
/// Note: do not remove above line in dev phase
/// Author: Kevin.Ren (xuewei.ren@pfizer.com)
/// Created On: 2010-4-10

// File: Framework.js
// Desc: this is a framework script file, it should be included in base master page.
//

// -----------------------------------------------------------------------------------------------------------------
// Constants for client scripts
// -----------------------------------------------------------------------------------------------------------------
var Constants = {
  VERSION_ID: "VersionID",
  SWITCH_VERSION_VALUE: "SwitchVersion",
  EMPTY_VALUE: "",
  EMPTY_GUID: "00000000-0000-0000-0000-000000000000",
  USER_ANONYMOUS_NAME: "Anonymous",
  USER_ROLE_GUEST_NAME: "Guest",
  TRUE_STRING: "Yes",
  FALSE_STRING: "No",
  STATUS_ACTIVE_STRING: "Active",
  STATUS_DELETED_STRING: "Deleted",
  NULLVALUE_STRING: "&lt;NULL&gt;", //空值
  ERR_NO_ENTITY_CONFIG: "The required entity is not found or permission denied!", // BUG: 6635
  MSG_DELETINGMSG: "Waiting..",
  MSG_VALID_MAXLENGTH: "Must be less than max length: {0}",
  MSG_VALID_MAXVALUE: "Must be less than max value: {0}",
  MSG_VALID_MINVALUE: "Must be greater than min value: {0}",
  MSG_VALID_FORMAT: "Input format invalid: valid format is {0}",
  MSG_VALID_FROM: "Validation failed, please view the error icon for more info.",
  MSG_TITLE_WARNING: "Warning",
  MSG_TITLE_ERROR: "Error",
  MSG_TITLE_FAILURE: "Failed",
  MSG_TITLE_SUCCESS: "Success",
  MSG_TITLE_INFO: "Info",
  MSG_PAGE_LOADING: "Loading...",
  MSG_BODY_CLOSETAB_WARNING: "Tab can not be closed while page loading!",
  MSG_DELETEREORDS: "Are you sure to delete these records",
  MSG_AutoCalculateWeight: "Are you sure to auto calculate weight ",
  MSG_BODY_NOPRINCIPAL_ERROR: "No avaliable principal",
  MSG_BODY_FRIENDLY_ERROR: "System exception, please refresh UI or contact admin.",
  MSG_BODY_SCRIPT_ERROR:
    "<b>An error was thrown and caught.</b><p>Error: {0}<br>Line: {1}<br>URL: {2}<br>",
  FEEDBACK_SUBJECT:
    "%5BMDE-%D6%F7%CA%FD%BE%DD%B9%DC%C0%ED%CF%B5%CD%B3%5D%A3%AD%B2%D9%D7%F7%2F%CE%CA%CC%E2%C3%E8%CA%F6", //"[MDE-主数据管理系统]－操作/问题描述",
  FEEDBACK_BODY:
    "%CE%CA%CC%E2%B7%B4%D3%B3%C8%CBNTID%3A%0a%0d%0a%0d%C3%E8%CA%F6%3A%0a%0d%0a%0d%CE%CA%CC%E2%BD%D8%CD%BC%3A", //"问题反映人NTID:<br><br>描述:<br><br>问题截图:",
  SERVICE_METHOD_GETMODULES:
    window.SERVICE_METHOD_GETMODULES || "Services/ApplicationService.svc/GetModules",
  MODULE_ROOT_ID: window.MODULE_ROOT_ID || this.EMPTY_GUID, // TODO: get this root id from server automatically
  IsEmptyGuid: function (guid) {
    return this.EMPTY_GUID == guid;
  },
};

Constants.GUEST_PRINCIPAL = {
  ID: Constants.EMPTY_GUID,
  Name: Constants.USER_ROLE_GUEST_NAME,
  Type: 4,
};
Constants.SecurityResourceType = {
  Module: 0,
  Entity: 1,
  Attribute: 2,
  RowFilter: 3,
  RowFilterAttribute: 4,
};

Constants.ResourcePermissionFlag = {
  AllowCreate: 1,
  AllowRead: 2,
  AllowUpdate: 3,
  AllowDelete: 4,

  AllowApprove: 5,
  DenyUpdate: 10,
  DenyRead: 11,
  DenyCreate: 12,
  DenyDelete: 13,
  DenyApprove: 14,
};
Constants.PrincipalScope = {
  Current: 0,
  Child: 1,
  All: 2,
};
Constants.PrincipalScopeText = {
  0: "Current",
  1: "Child",
  2: "All",
};
Constants.PrincipalType = {
  User: 1,
  Group: 2,
  Organization: 3,
  Title: 4,
};

// Extend Ext Controls
Ext.form.Label.prototype.setValue = function (value) {
  this.setText(value);
};
Ext.form.Label.prototype.getValue = function () {
  return this.text;
};

Ext.form.TextArea.prototype.originalSetValue = Ext.form.TextArea.prototype.setValue;
Ext.form.TextArea.prototype.setValue = function (value) {
  this.originalSetValue(value.replace(/\<br\>/g, "\r\n"));
};

// Enhance date format issue
Ext.form.DateField.prototype.originalSetValue = Ext.form.DateField.prototype.setValue;
Ext.form.DateField.prototype.setValue = function (value) {
  var date = value;
  if (date && typeof date === "string") {
    date = new Date(value.replace("-", "/"));
  }
  this.originalSetValue(date);
};

//TODO: any field which need a request should extend this obsorver object class
// such as , input check / lov / entitydata / pc etc.
Ext.Ajax.TransHost = Ext.extend(Ext.Component, {
  transactionId: null,
  beginRequest: function (options) {
    return (this.transactionId = Ext.Ajax.request(options));
  },
  abortRequest: function () {
    top.alert(this.transactionId);
    if (Ext.Ajax.isLoading(this.transactionId)) {
      Ext.Ajax.abort(this.transactionId);
    }
  },
});

// TODO: [BUG:4253]
// Trim value before validation
/*
Ext.form.TextField.prototype.originalValidateValue = Ext.form.TextField.prototype.validateValue;
Ext.form.TextField.prototype.validateValue = function(value) {
value = value ? value.trim() : "";
this.originalValidateValue(value);
}
*/

// -----------------------------------------------------------------------------------------------------------------
// Enhance JScript Library
// -----------------------------------------------------------------------------------------------------------------
if (!window.DebugMode) {
  // display friendly error on release build
  window.onerror = function (sMsg, sUrl, sLine) {
    var sHTML = String.format(Constants.MSG_BODY_SCRIPT_ERROR, sMsg, sLine, sUrl);

    top.Ext.MessageBox.show({
      title: Constants.MSG_TITLE_ERROR,
      msg: sHTML,
      buttons: Ext.Msg.OK,
      icon: Ext.MessageBox.ERROR,
    });

    return true;
  };
}

window.alert = function (sMsg, sTitle) {
  top.Ext.Msg.alert(sTitle || Constants.MSG_TITLE_INFO, sMsg);
};

window.failureAjaxRequestHandler = function (response, options) {
  FormHelper.hideWaittingDialog();
  //Bug#7725 xiaolang 20110928
  Ext.WindowMgr.each(function (win) {
    win.close();
  });
  //Bug#7725 xiaolang 20110928
  Ext.Msg.alert(Constants.MSG_TITLE_ERROR, Constants.MSG_BODY_FRIENDLY_ERROR);
};

window.formInvalid = function () {
  alert(Constants.MSG_VALID_FROM, Constants.MSG_TITLE_WARNING);
};

// -----------------------------------------------------------------------------------------------------------------
// AppContext would be used in any Page inherited from <BasePage>.
// -----------------------------------------------------------------------------------------------------------------
if (typeof AppContext === "undefined") {
  Ext.QuickTips.init();
  Ext.form.Field.prototype.msgTarget = "side";

  // if current window is the topest window, AppContext should be defined at first.
  if (window == top) {
    AppContext = {
      Current: { AppRoot: window.AppBase ? window.AppBase : "/" },
      Run: function (app) {
        this.Current = app;
        this.Current.init();
        this.Current.Layout.doLayout();
      },
    };
  } else {
    AppContext = top.AppContext;
  }

  if (!AppContext) {
    alert("Page cannot be opend in single window, the Framework is required!");
    window.close();
  }

  // Set blank image url.
  Ext.BLANK_IMAGE_URL = window.AppBase + "scripts/ext/resources/images/default/s.gif";

  // Set timeout for long request time via service (such as excel validation)
  Ext.data.Connection.prototype.timeout = 3600000; // timeout 30 min

  Ext.Ajax.on("requestexception", function (conn, response, optioins) {
    if (response.status == "502") {
      Ext.Msg.alert(Constants.MSG_TITLE_ERROR, response.statusText);
    }
    if (!response.status) {
      window.failureAjaxRequestHandler(response, optioins);
    }
  });
}

///<summary>
///     Abstract Base Application Object
///</summary>
///<config>
///     <param name="AppRoot">application root</param>
///</config>
var _BaseApp = Ext.extend(Ext.util.Observable, {
  //begin resources
  signinDialogTitle: "Sign In",
  principalListLabel: "Principal",
  rememberPrincipalLabel: "Remember Me",
  noPrincipalSelectedMessage: "No principal selected!",
  signinDialogSignBtnText: "Sign In",
  signinDialogCloseBtnText: "Close",
  rememberPrincipalSetName: "rememberPrincipalSetName",
  rememberPrincipalIDSetName: "rememberPrincipalIDSetName",
  //end resources

  AppRoot: "./",
  CurrentCulture: "en-US",
  WebParts: [],
  User: { LogonName: Constants.USER_ANONYMOUS_NAME, Principals: [Constants.GUEST_PRINCIPAL] },
  init: function () {
    if (this.Layout == null) {
      this.Layout = new Ext.Viewport({
        items: [
          {
            id: "default-div",
            region: "center",
            layout: "fit",
            title: "MIS Web Application",
            html: "<p>Please define new layout for the app.</p>",
            border: true,
          },
        ],
      });
    }
  },

  PageLoad: function (tabId) {
    var tab = this.tabPanel.getItem(tabId);
    if (tab) {
      if (tab.mask) tab.mask.hide();
      if (tab.loadingCls) {
        tab.setIconClass(tab.oriIconCls);
        tab.isPageLoading = false;
      }
    }
  },

  OpenSignInDialog: function () {
    // enable user to swich principal when the user has more than 1 principal
    var logonEnable = this.User.Principals.length > 0;

    var provider = Ext.state.Manager.getProvider();
    var needRememberPrincipal = provider.get(this.rememberPrincipalSetName, false);
    var rememberPrincipalID = provider.get(this.rememberPrincipalIDSetName);
    //debugger;
    // Exist avtive principal id in cookie
    if (rememberPrincipalID) {
      var hasPrincipal = false;
      Ext.each(this.User.Principals, function (p) {
        // the active principal id is also avaliable for current user
        if (p.ID == rememberPrincipalID) {
          hasPrincipal = true;
          return false;
        }
      });

      // remove remember principal from cookie
      if (!hasPrincipal) {
        rememberPrincipalID = null;
        provider.clear(this.rememberPrincipalIDSetName);
      }
    }

    if (needRememberPrincipal && rememberPrincipalID) {
      if (
        this.User.LogonActivePrincipal.ID === rememberPrincipalID ||
        (window.location.href.indexOf("?principal=") > 0 &&
          this.User.LogonActivePrincipal.ID === window.location.href.split("?principal=")[1])
      )
        return true;

      this.SignInAs(rememberPrincipalID);
      return false;
    }

    if (
      !needRememberPrincipal && //this.User.LogonActivePrincipal.ID === rememberPrincipalID || /*BUG:*/
      window.location.href.indexOf("?principal=") > 0 &&
      this.User.LogonActivePrincipal.ID === window.location.href.split("?principal=")[1]
    ) {
      return true;
    }

    var signInItems = [{ xtype: "label", text: Constants.MSG_BODY_NOPRINCIPAL_ERROR }];

    //20110630 xiaolang CR#48
    var switchAccountbtn = new Ext.Button({ text: "" });
    switchAccountbtn.hide();
    //20110630 xiaolang CR#48

    if (logonEnable) {
      signInItems = [
        {
          xtype: "combo",
          id: "comboPrincipalList",
          triggerAction: "all",
          fieldLabel: this.principalListLabel,
          anchor: "95%",
          mode: "local",
          value: rememberPrincipalID,
          allowBlank: false,
          forceSelection: true,
          selectOnFocus: false,
          displayField: "Name",
          valueField: "ID",
          store: new Ext.data.JsonStore({
            fields: ["ID", "Name", "Type", "IsActive"],
            data: this.User.Principals,
            reader: new Ext.data.JsonReader({
              idProperty: "ID",
            }),
          }),
          listeners: {
            blur: function (f) {
              if (f.getValue() == " ") {
                f.setValue("");
              }
            },
            focus: function (f) {
              if (f.getValue() == "") {
                f.setValue(" ");
              }
              //var range = f.createTextRange(); //建立文本选区
              //range.moveStart('character', f.getValue().length); //选区的起点移到最后去
              //range.collapse(true);
              //range.select();
            },
          },
        },
        {
          xtype: "checkbox",
          id: "chkRememberPrincipal",
          fieldLabel: this.rememberPrincipalLabel,
          value: 0,
        },
      ];
    }
    //20110630 xiaolang CR#48
    else {
      switchAccountbtn = new Ext.Button({
        xtype: "button",
        text: this.toolbarItemSwitchOtherAccountCaption,
        //bug0007922 20110727 xiaolang
        tooltip: this.toolbarItemSwitchOtherAccountTooltip,
        //bug0007922 20110727 xiaolang
        handler: function () {
          AppContext.Current.SignOff();
        },
      });
    }
    //20110630 xiaolang CR#48

    var signInDlg = this.OpenFixedDialog({
      id: "system_signin_dialog",
      closable: false,
      draggable: false,
      layout: "form",
      title: this.signinDialogTitle,
      labelWidth: 100,
      labelAlign: "right",
      width: 339,
      height: 130,
      padding: "10px",
      buttonAlign: "right",
      defaultButton: "btnSignIn",
      items: signInItems,
      buttons: [
        //20110630 xiaolang CR#48
        switchAccountbtn,
        //20110630 xiaolang CR#48
        {
          id: "btnSignIn",
          disabled: !logonEnable,
          text: this.signinDialogSignBtnText,
          handler: function (btn) {
            var dlg = this.GetDialog("system_signin_dialog");
            var principal = dlg.findById("comboPrincipalList").getValue();

            if (!principal || principal == "" || principal == " ") {
              //bug0007871 20110727 xiaolang
              if (principal == " ") {
                dlg.findById("comboPrincipalList").setValue("");
              }
              //bug0007871 20110727 xiaolang
              alert(this.noPrincipalSelectedMessage, Constants.MSG_TITLE_ERROR);
              return;
            }

            // store remember principal here
            needRememberPrincipal = dlg.findById("chkRememberPrincipal").checked;
            if (needRememberPrincipal !== "") {
              provider.set(this.rememberPrincipalSetName, needRememberPrincipal);
              provider.set(this.rememberPrincipalIDSetName, principal);
            }

            this.SignInAs(principal);
          },
          scope: this,
        },
        {
          text: this.signinDialogCloseBtnText,
          iconCls: "close",
          handler: function () {
            window.close();
          },
          scope: this,
        },
      ],
    });

    //bug0007871 20110727 xiaolang
    var cplst = signInDlg.findById("comboPrincipalList");
    if (cplst != null) {
      if (cplst.getValue() == "") {
        cplst.setValue(" ");
      }
      cplst.focus.defer(1000, cplst);
    }
    //bug0007871 20110727 xiaolang
    return false;
  },

  SignInAs: function (principal) {
    var provider = Ext.state.Manager.getProvider();
    var needRememberPrincipal = provider.get(this.rememberPrincipalSetName, false);
    var pId = principal.ID ? principal.ID : principal;
    if (needRememberPrincipal) {
      provider.set(this.rememberPrincipalIDSetName, pId);
    }

    //if(hasPrincipal){
    window.location.href = this.AppRoot + "default.aspx?principal=" + pId;
    //}
    //else if(this.User.Principals.length > 0){
    //    this.OpenSignInDialog(true);
    //}
    //else{
    //    alert('Permission Denied!');
    //}
  },

  SignOff: function () {
    window.location.href = this.AppRoot + "logout.aspx";
  },

  ///<summary>
  /// Display user manual document in opening window.
  ///</summary>
  GoHelp: function () {
    window.open(this.AppRoot + "help.doc");
  },

  GoAbout: function () {
    Ext.Msg.alert(
      "About",
      String.format(
        "[{0}] {1} <br> based on X-Framework",
        window.AppName || "Web Application",
        window.AppVersion || "1.0.0.0"
      )
    );
  },

  GoFeedback: function () {
    window.open(
      "mailto:PfizerServiceDeskAPACChinese@pfizer.com&cc=ChinaMDEBT@Pfizer.com?charset=utf-8&subject=" +
        Constants.FEEDBACK_SUBJECT +
        "&body=" +
        Constants.FEEDBACK_BODY
    );
  },
  GoDesktop: function () {
    //TODO: impl in the next phase
  },

  //TODO: add more feature here
  OpenFixedDialog: function (config) {
    config = Ext.apply(config, {
      autoScroll: false,
      resizable: false,
    });
    return this.OpenDialog(config);
  },

  // @config.forceRefresh : force to refresh url.
  // @config.url
  OpenDialog: function (config) {
    var dlg = Ext.WindowMgr.get(config.id);
    if (!dlg) {
      if (config.url) {
        config = Ext.apply(config, {
          contentEl: Ext.DomHelper.append(Ext.getBody(), {
            tag: "iframe",
            frameBorder: 0,
            style: "border 0px none;",
            src: config.url,
            height: "100%",
            width: "100%",
          }),
        });

        config.contentEl.dlgId = config.id || Ext.id(config.contentEl, "dialog");

        if (!config.id) {
          config.id = config.contentEl.dlgId;
        }
      }

      var isDevMode = window.DebugMode && this.User.LogonActivePrincipal.Name == "Development"; // BUG:6490

      dlg = Ext.ComponentMgr.create(
        Ext.apply({ modal: true, resizable: isDevMode, renderTo: Ext.getBody() }, config),
        "window"
      );

      if (isDevMode)
        dlg.on("resize", function (win, adjWidth, adjHeight, rawWidth, rawHeight) {
          window.status = String.format(
            "DEBUG: Window {0} with width:{1} and height:{2}",
            win.title,
            adjWidth,
            adjHeight
          );
        });
    } else {
      if (config.forceRefresh && config.url) {
        // dlg.contentEl.location.reload();
        var diffParam = config.url.indexOf("?") == -1 ? "?" : "&" + new Date().getMilliseconds();
        dlg.contentEl.src = config.url + diffParam;
      }
      dlg.setActive(true);
    }

    if (dlg.hidden !== false) {
      if (dlg.reset) dlg.reset(config.resetConfig); // call reset method to reset all ui items to default.
      dlg.show();
      dlg.center();
    }

    return dlg;
  },

  GetDialog: function (mix) {
    var id = this._GetMixID(mix);
    var dlg = Ext.WindowMgr.get(id);
    return dlg;
  },

  CloseDialog: function (mix) {
    var dlg = this.GetDialog(mix);
    if (dlg) {
      dlg.hide();
    }
  },

  _GetMixID: function (mix) {
    var id = mix;
    if (typeof mix == "object") {
      id = mix.frameElement ? mix.frameElement.dlgId : mix.getId();
    } else if (!mix && window.frameElement) {
      id = window.frameElement.dlgId;
    }
    return id;
  },
});

// ------------------------------------------------------------------------
// Web Application : MIS
// ------------------------------------------------------------------------
var WebApplication = Ext.extend(_BaseApp, {
  topPanel: null,
  leftPanel: null,
  centerPanel: null,
  tabPanel: null,
  statusPanel: null,

  navigateExplorerCaption: "Navigate Explorer",
  desktopCaption: "Desktop",

  tabMenuItemCloseCaption: "Close this",
  tabMenuItemCloseAllCaption: "Close all but this.",
  tabMenuItemRefreshCaption: "Refresh content",
  tabOpenWarningText:
    "The browser would be slowly if over 10 pages opened in TabExplorer, are you sure continue to open new page?",

  weekdays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  statusLabelDateCaption: "Today is",
  statusButtonAboutCaption: "About",
  statusButtonFeedbackCaption: "Feedback",

  toolbarItemSwitchOtherAccountCaption: "Switch Other Account",
  //bug0007922 20110727 xiaolang
  toolbarItemSwitchOtherAccountTooltip: "Please switch other account",
  //bug0007922 20110727 xiaolang
  toolbarItemLogoutPrompt: "Are you sure to log off system?",
  toolbarItemLogoutTooltip: "Please log off to end your session",
  toolbarItemHelpTooltip: "Help?",
  toolbarItemCollapseTooltip: "Expand/Collapse top panel.",

  topPanelHeight: 80,
  topMenubarHeight: 30,
  topPanelHeightSetName: "topbanner_expandsets",

  init: function () {
    WebApplication.superclass.init.call(this);

    this.CurrentCulture = window.CurrentCulture || this.CurrentCulture;
    this.ExcelRuntimeVersion = window.ExcelRuntimeVersion;

    var avaliablePrincipals = window.LogonPrincipals
      ? window.LogonPrincipals
      : [Constants.GUEST_PRINCIPAL];
    var activePrincipal = Constants.GUEST_PRINCIPAL; //

    Ext.each(avaliablePrincipals, function (p) {
      if (p.IsActive === true) {
        activePrincipal = p;
        return false;
      }
    });

    Ext.apply(this.User, {
      LogonName: window.LogonName,
      LogonActivePrincipal: activePrincipal,
      Principals: avaliablePrincipals,
    });

    var provider = Ext.state.Manager.getProvider();
    var toppset = provider.get(this.topPanelHeightSetName, this.topPanelHeight);
    this.topPanel = new Ext.Container({
      id: "top-div",
      region: "north",
      height: this.topMenubarHeight + toppset,
      items: [
        new Ext.Panel({
          id: "top_banner",
          height: toppset,
          bodyCssClass: "oa-topbanner",
          border: false,
        }),
        new Ext.Toolbar({
          id: "top_toolbar",
          height: this.topMenubarHeight,
          items: [],
        }),
      ],
    });

    this.leftPanel = new Ext.Panel({
      id: "left-div",
      region: "west",
      width: 220,
      split: true,
      collapsible: true,
      layout: "accordion",
      margins: "0 0 0 5",
      layoutConfig: { animate: true },
      title: this.navigateExplorerCaption,
      items: [],
    });

    //this.ownerCt.header.addClass();//x-panel-header x-panel-header-noborder x-unselectable x-accordion-hd

    this.centerPanel = this.tabPanel = new Ext.TabPanel({
      id: "center-panel",
      region: "center",
      border: true, //autoWidth: true,
      enableTabScroll: true,
      tabPosition: "bottom",
      header: true,
      titlebar: true,
      title: "Central Area",
      headerCfg: {
        cls: "x-panel-header x-panel-header-noborder x-unselectable x-accordion-hd",
        style: "border:none",
      },
      activeTab: 0,
      menu: null,
      defaults: { autoScroll: true },
      listeners: {
        scope: this,
        contextmenu: function (t, tabItem, e) {
          if (tabItem.title == AppContext.Current.desktopCaption) return;
          t.setActiveTab(tabItem);

          if (this.menu == null) {
            this.menu = new Ext.menu.Menu([
              {
                text: this.tabMenuItemCloseCaption,
                iconCls: "x-tool x-tool-close",
                handler: function () {
                  var act = t.getActiveTab();
                  if (act.isPageLoading === true) {
                    alert(Constants.MSG_BODY_CLOSETAB_WARNING, Constants.MSG_TITLE_WARNING);
                    return;
                  }

                  t.remove(act, true);
                },
              },
              {
                text: this.tabMenuItemCloseAllCaption,
                iconCls: "x-tool x-tool-close",
                handler: function () {
                  var act = t.getActiveTab();
                  t.items.each(function (item) {
                    if (item.closable && item != act) {
                      if (item.isPageLoading === true) {
                        alert(Constants.MSG_BODY_CLOSETAB_WARNING, Constants.MSG_TITLE_WARNING);
                        return false;
                      }
                      t.remove(item, true);
                    }
                  });
                },
              },
              "-",
              {
                text: this.tabMenuItemRefreshCaption,
                iconCls: "x-tool x-tool-refresh",
                handler: function () {
                  var act = t.getActiveTab();
                  var winEl = Ext.get(act.tabframeId);
                  if (winEl && winEl.dom) {
                    if (act.mask) act.mask.show();
                    if (act.loadingCls) {
                      act.setIconClass(act.loadingCls);
                      act.isPageLoading = true;
                    }
                    winEl.dom.contentWindow.location.reload();
                  }
                },
              },
            ]);
          }

          this.menu.showAt(e.getPoint());
        },
      },
    });

    //var today = new Date();
    var ddtext = String.format(
      "<img src='{0}Scripts/Ext/resources/images/default/shared/calendar.gif' align='absmiddle'>&nbsp;{1}&nbsp;&nbsp;{2}",
      AppContext.Current.AppRoot,

      //String.format(window.CurrentCulture == 'zh-CN' ? "{0}年{1}月{2}日" : "{2}/{1}/{0}", today.getFullYear(), today.getMonth(), today.getDay()),
      //this.weekdays[today.getDay()],
      this.statusLabelDateCaption,
      window.TodayString
    );

    this.statusPanel = new Ext.ux.StatusBar({
      region: "south",
      height: 30,
      autoShow: true,
      busyText: "Loading...", // TODO: local resource
      items: [
        //{text:'Ready'}, {text:Date(), handler: function(){/*TODO*/}},
        //                ddtext,
        //                { text: this.statusButtonAboutCaption, handler: function() { AppContext.Current.GoAbout(); } },
        //                { text: this.statusButtonFeedbackCaption, handler: function() { AppContext.Current.GoFeedback(); } }
      ],
    });

    if (this.Layout != null) this.Layout.removeAll();
    this.Layout = new Ext.Viewport({
      layout: "border",
      items: [this.topPanel, this.statusPanel, this.leftPanel, this.centerPanel],
    });

    // Show sign in dialog allow user to choose a principal to sign in before modules load
    //if (this.User.LogonActivePrincipal.ID === Constants.GUEST_PRINCIPAL.ID) // no active principal, current user has more than 1 pricipals
    {
      if (this.OpenSignInDialog() !== true) return;
    }

    if (window.DebugMode) this._LoadDebugToolbox();

    // Load module trees for navigator explorer
    this._LoadModules();

    this._LoadRightMenubarItems();
  },

  _LoadDebugToolbox: function () {
    if (window.DebugMode) {
      // bug:6490, these features should be enabled on debug mode and user with principal dev
      // Load DEBUG Tools
      if (this.User.LogonActivePrincipal.Name == "Development") {
        //                this.statusPanel.add({ text: 'Debug Toolbox', menu: getDebugToolboxMenu() });
      }
      //            this.statusPanel.add({ text: 'File Bug', handler: function() { AppContext.Current.OpenTab({ id: 'tab_firebug', title: 'Fire bug', url: 'http://bjgasptst01:8888/mantis/bug_report_advanced_page.php', loadMask: false }); } });
    }
  },

  _LoadRightMenubarItems: function () {
    var tb = Ext.getCmp("top_toolbar");
    tb.addButton({
      text: this.desktopCaption,
      iconCls: "desktop-icon",
      id: "menu_nav_root",
      handler: function () {
        AppContext.Current.GoDesktop();
      },
    });

    // DEMO Only Begin
    tb.add({ xtype: "tbspacer" });
    // DEMO Only End

    tb.addFill();

    var roleMenuItems = [
      {
        text: this.toolbarItemSwitchOtherAccountCaption,
        handler: function (btn) {
          Ext.Msg.confirm(
            Constants.MSG_TITLE_WARNING,
            this.toolbarItemLogoutPrompt,
            function (btn, text) {
              if (btn == "yes") {
                AppContext.Current.SignOff();
              }
            },
            this
          );
        },
        scope: this,
      },
    ];

    //debugger;

    Ext.each(AppContext.Current.User.Principals, function (principal) {
      if (principal.ID == AppContext.Current.User.LogonActivePrincipal.ID) return;
      roleMenuItems.push({
        text: principal.Name,
        handler: function () {
          //TODO: switch active role for current user.
          AppContext.Current.SignInAs(principal);
        },
      });
    });

    var provider = Ext.state.Manager.getProvider();
    var needRememberPrincipal = provider.get(this.rememberPrincipalSetName, false);
    //alert(needRememberPrincipal);

    roleMenuItems.push({
      xtype: "menucheckitem",
      checked: needRememberPrincipal,
      text: this.rememberPrincipalLabel,
      listeners: {
        checkchange: function (sender, state) {
          provider.set(this.rememberPrincipalSetName, state);
        },
        scope: this,
      },
    });

    tb.addButton({
      text:
        AppContext.Current.User.LogonName +
        "[" +
        AppContext.Current.User.LogonActivePrincipal.Name +
        "]", // local resource?
      tooltip: this.toolbarItemLogoutTooltip,
      cls: "x-btn-text-icon",
      iconCls: "x-btn-logout-icon",
      menu: roleMenuItems,
    });

    tb.add({ xtype: "tbspacer" });

    tb.add({
      xtype: "combo",
      fieldLabel: "Language",
      width: 80,
      store: new Ext.data.ArrayStore({
        fields: ["DisplayName", "Name"],
        data: [
          ["English", "en-US"],
          ["中文", "zh-CN"],
        ],
      }),
      mode: "local",
      displayField: "DisplayName",
      valueField: "Name",
      forceSelection: true,
      selectOnFocus: true,
      triggerAction: "all",
      value: AppContext.Current.CurrentCulture,
      listeners: {
        select: function (cb, record, index) {
          window.location.href =
            AppContext.Current.AppRoot + "default.aspx?lang=" + record.get("Name");
          //TODO:
        },
      },
    });

    //            tb.add({ xtype: 'tbspacer' });

    //            tb.addButton(new Ext.Toolbar.Button({
    //                text: '', tooltip: this.toolbarItemHelpTooltip, cls: 'x-btn-text-icon', iconCls: "x-btn-help-icon", handler: function(btn) {
    //                    AppContext.Current.GoHelp();
    //                }
    //            }));

    //            tb.add({ xtype: 'tbspacer' });
    //            tb.addButton(new Ext.Toolbar.Button({ text: '', id: 'toggle', tooltip: this.toolbarItemCollapseTooltip, cls: 'x-btn-text-icon',
    //                iconCls: (Ext.state.Manager.getProvider().get(this.topPanelHeightSetName) == AppContext.Current.topMenubarHeight ? "x-btn-expanddown-icon" : "x-btn-expandup-icon"),
    //                handler: function(btn) {
    //                    var topbanner = Ext.getCmp('top_banner');
    //                    var h = topbanner.getSize().height == AppContext.Current.topPanelHeight ? 0 : AppContext.Current.topPanelHeight;
    //                    topbanner.setHeight(h);
    //                    topbanner.ownerCt.setHeight(AppContext.Current.topMenubarHeight + h);
    //                    btn.setIconClass(h == AppContext.Current.topPanelHeight ? "x-btn-expandup-icon" : "x-btn-expanddown-icon");
    //                    Ext.state.Manager.getProvider().set(this.topPanelHeightSetName, h);

    //                    AppContext.Current.Layout.doLayout();
    //                }
    //            }));

    tb.doLayout();
  },

  _LoadModules: function () {
    Ext.Ajax.request({
      url: Constants.SERVICE_METHOD_GETMODULES,
      params: { moduleId: Constants.MODULE_ROOT_ID }, // Root Node ID
      success: function (response, params) {
        var modules = eval(response.responseText);
        if (modules) {
          Ext.each(
            modules,
            function (module) {
              this.leftPanel.add(
                new Ext.ux.ModuleTreePanel({
                  border: true,
                  rootVisible: false,
                  rootText: module.DisplayName,
                  rootKey: module.ID,
                  title: module.Name,
                  iconCls: module.Icon,
                  dataUrl: Constants.SERVICE_METHOD_GETMODULES,
                  listeners: {
                    click: function (node, e) {
                      if (node.attributes.pageUrl && node.attributes.pageUrl.length > 0)
                        // Open tab with avaliable url
                        this.OpenTab(
                          {
                            id: node.attributes.id,
                            title: node.attributes.text,
                            url: node.attributes.pageUrl,
                            closable: true,
                            iconCls: node.attributes.iconCls,
                          },
                          node
                        );
                    },
                    scope: this,
                  },
                })
              );
            },
            this
          );

          this.leftPanel.doLayout();
        }
      },
      failure: function (response, params) {
        Ext.Msg.alert(Constants.MSG_TITLE_FAILURE, response.description);
      },
      scope: this,
    });
  },

  _ContinueOpenTab: function (config, scope) {
    var tabId = config.id || String.format("tab_{0}", Ext.id(this.tabPanel));
    var tabFrameId = "iframe_" + tabId;
    var tab = this.tabPanel.getItem(tabId);
    if (!tab) {
      config.id = tabId; // new id

      tab = this.tabPanel.add(
        Ext.apply(
          {
            tabframeId: tabFrameId,
            layout: "fit",
            layoutOnTabChange: true,
            autoScroll: true,
            autoWidth: true,
            autoHeight: false,
            html:
              "<iframe name=" +
              tabFrameId +
              " tabId=" +
              tabId +
              " frameBorder=0 src='" +
              (config.url || "") +
              "' width=100% height=100% style='border 0px none; scrollbar: true'/>",
          },
          config
        )
      );

      if (scope && scope.attributes.iconCls) tab.setIconClass(scope.attributes.iconCls);

      if (config.url && config.loadMask !== false) {
        tab.on("render", function (sender) {
          if (sender.allowMask) {
            if (!sender.mask)
              sender.mask = new Ext.LoadMask(Ext.getBody(), { msg: Constants.MSG_PAGE_LOADING });
            sender.mask.show();
          }
          sender.oriIconCls = sender.iconCls;
          sender.loadingCls = "x-tab-loading";
          sender.setIconClass(sender.loadingCls);
        });
      }
      /*
                tab.on('beforeremove', function(p){
                if(p.isPageLoading === true) 
                {
                alert(Constants.MSG_BODY_CLOSETAB_WARNING, Constants.MSG_TITLE_WARNING);
                return false;
                }
                });
                */
      tab.on(
        "activate",
        function () {
          if (scope) {
            if (!scope.cpath) {
              var p = scope;
              while (p) {
                //scope.cpath = String.format("<img class='x-panel-inline-icon x-navpath-root-icon' src='{2}'/><span class='x-navpath-label'>{0}</span>{1}", p.text, scope.cpath, Ext.BLANK_IMAGE_URL);
                scope.cpath = String.format(
                  "<img class='x-panel-inline-icon x-navpath-root-icon' src='{2}'/><span class='x-panel-header-text'>{0}</span>{1}",
                  p.text,
                  scope.cpath,
                  Ext.BLANK_IMAGE_URL
                );
                p = p.parentNode;
              }
            }

            Ext.DomHelper.overwrite(this.ownerCt.header.dom, scope.cpath);

            // Locate on navigate tree node
            if (scope) scope.select();
            //按照tabFrameId找不到iframe的问题 xiaolang 20111017
            var inframe = Ext.get(tabFrameId);
            if (!inframe) {
              inframe = Ext.get(tabId);
            }
            var frameWin = inframe.dom.contentWindow;
            //var frameWin = Ext.get(tabFrameId).dom.contentWindow; //原来的代码
            //按照tabFrameId找不到iframe的问题 xiaolang 20111017
            if (frameWin && frameWin.Ext) {
              var body = frameWin.Ext.getBody();
              if (body) {
                body.setWidth(tab.getInnerWidth()); // adjust width of child window
              }
            }
          }

          //this.doLayout();
        },
        tab
      );

      tab.on("close", function (sender) {
        if (typeof CollectGarbage == "function") {
          CollectGarbage();
        }
        if (sender.mask) {
          sender.mask.destroy();
          delete sender.mask;
        }
      });

      tab.show();
    }

    //tab.doLayout();
    this.tabPanel.activate(tab);

    return tab;
  },

  OpenTab: function (config, scope) {
    var tab;
    if (this.tabPanel.items.length > 10 && !this.tabPanel.notifyMorepages) {
      Ext.Msg.confirm(
        Constants.MSG_TITLE_WARNING,
        this.tabOpenWarningText,
        function (btn) {
          if (btn == "yes") {
            tab = this._ContinueOpenTab(config, scope);
            this.tabPanel.notifyMorepages = true;
          }
        },
        this
      );
      return tab;
    }

    tab = this._ContinueOpenTab(config, scope);

    return tab;
  },

  GoDesktop: function () {
    var tab = this.OpenTab({
      id: "application_tab_desktop",
      title: this.desktopCaption,
      closable: false,
      iconCls: "desktop-icon",
      loadMask: false,
    });
    /*
            var panel2 = new Ext.Panel({
            id:'main-panel2',
            //baseCls:'x-plain',
            width: 300,
            height: 200,
            //autoWidth: true,
            //autoScroll: true,
            //renderTo: Ext.getBody(),
            layout:'table',
            layoutConfig: {columns:4},
            defaults: {border:false, height: 30},
            items:[
            {title:'Item 1', header:true,  width:100, items:[{xtype:'textfield', width:100}]},
            {title:'&nbsp;', header:true,  width:100, items:[{xtype:'textfield', width:40}]},
            {title:'Item 2', header:true,  width:200, items:[{xtype:'datefield', width:200}]},
            {title:'Item 3', header:true,  width:200, items:[{xtype:'textfield', width:200}]},
                    
            {title:'Item 5', header:false, width:100, items:[{xtype:'textfield', width:100}]},
            {title:'&nbsp;', header:false, width:100, items:[{xtype:'textfield', width:40}]},
            {title:'Item 6', header:false, width:200, items:[{xtype:'textfield', width:200}]},
            {title:'Item 8', header:false, width:200, items:[{xtype:'textfield', width:200}]}
            ]
            });
            
            //tab.add({xtype:'panel', autoScroll:true, height:100,width:100, items:panel2});
			
			
			var win = new Ext.Window({title: 'ddddd', autoScroll:true, items: panel2, width:100, height: 100});
            win.show();
            */
  },
}); // End web application

AttributeConvertHelper = (function () {
  var stringType = "string";

  var helper = {
    convertAttributeStringToObject: function (obj, attribute) {
      if (!attribute) {
        attribute = "JsonData";
      }

      if (obj) {
        var value = obj[attribute];
        var shouldConvert = value && typeof value.toLowerCase() === stringType;
        if (shouldConvert) {
          var str = value.replace(/\\/g, "\\\\");
          obj[attribute] = Ext.util.JSON.decode(str);
        }
      }
    },
    convertAttributesStringToObject: function (obj, attributes) {
      Ext.each(attributes, function (attribute) {
        this.convertAttributeStringToObject(obj, attribute);
      });
    },
    convertAttributeObjectToString: function (obj, attribute) {},
    convertAttributesObjectToString: function (obj, attributes) {},
  };
  return helper;
})();
