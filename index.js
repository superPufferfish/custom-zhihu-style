// ==UserScript==
// @name         知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      4.25.0
// @description  页面模块自定义隐藏，列表及回答内容过滤，保存浏览历史记录，推荐页内容缓存，一键邀请，复制代码块删除版权信息，列表种类和关键词强过滤并自动调用「不感兴趣」接口，屏蔽用户回答，视频下载，设置自动收起所有长回答或自动展开所有回答，移除登录提示弹窗，设置过滤故事档案局和盐选科普回答等知乎官方账号回答，手动调节文字大小，切换主题及深色模式调整，隐藏知乎热搜，列表添加标签种类，去除广告，设置购买链接显示方式，收藏夹内容、回答、文章导出为PDF，一键移除所有屏蔽选项，外链直接打开，键盘左右切换预览图片，更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @compatible   safari Violentmonkey
// @compatible   safari Tampermonkey
// @author       lyb233
// @license      MIT
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

"use strict";
(() => {
  var THEMES = [
    { label: "浅色", value: 0 /* 浅色 */, background: "#fff", color: "#000" },
    { label: "深色", value: 1 /* 深色 */, background: "#000", color: "#fff" },
    { label: "自动", value: 2 /* 自动 */, background: "linear-gradient(to right, #fff, #000)", color: "#000" }
  ];
  var THEME_CONFIG_LIGHT = {
    [0 /* 默认 */]: { name: "默认", background: "#ffffff", background2: "" },
    [1 /* 红 */]: { name: "红", background: "#ffe4c4", background2: "#fff4e7" },
    [2 /* 黄 */]: { name: "黄", background: "#faf9de", background2: "#fdfdf2" },
    [3 /* 绿 */]: { name: "绿", background: "#cce8cf", background2: "#e5f1e7" },
    [4 /* 灰 */]: { name: "灰", background: "#eaeaef", background2: "#f3f3f5" },
    [5 /* 紫 */]: { name: "紫", background: "#e9ebfe", background2: "#f2f3fb" },
    [6 /* 落日黄 */]: { name: "落日黄", background: "#FFD39B", background2: "#ffe4c4" }
  };
  var THEME_CONFIG_DARK = {
    [0 /* 深色模式默认 */]: { name: "默认", background: "#121212", background2: "#333333" },
    [1 /* 深色护眼一 */]: { name: "深色护眼一", background: "#15202b", background2: "#38444d" },
    [2 /* 深色护眼二 */]: { name: "深色护眼二", background: "#1f1f1f", background2: "#303030" },
    [3 /* 深色护眼三 */]: { name: "深色护眼三", background: "#272822", background2: "#383932" },
    [4 /* 深色蓝 */]: { name: "深色蓝", background: "#1c0c59", background2: "#191970" },
    [5 /* 深色红 */]: { name: "深色红", background: "#570D0D", background2: "#8B0000" },
    [6 /* 深色绿 */]: { name: "深色绿", background: "#093333", background2: "#0c403f" }
  };
  var INPUT_NAME_THEME = "theme";
  var INPUT_NAME_THEME_DARK = "themeDark";
  var INPUT_NAME_ThEME_LIGHT = "themeLight";
  var CONFIG_HIDDEN_DEFAULT = {
    hiddenAnswerRightFooter: true,
    hiddenReadMoreText: true,
    hiddenAD: true,
    hiddenDetailFollow: true,
    hidden618HongBao: true,
    hiddenZhihuZhiShop: true,
    hiddenQuestionAD: true
  };
  var CONFIG_FILTER_DEFAULT = {
    removeFromYanxuan: true,
    removeFromEBook: true,
    removeUnrealAnswer: false,
    removeFollowVoteAnswer: false,
    removeFollowVoteArticle: false,
    removeFollowFQuestion: false,
    removeBlockUserContent: true,
    removeBlockUserContentList: [],
    removeItemAboutAD: false,
    removeItemAboutArticle: false,
    removeItemAboutVideo: false,
    removeItemAboutPin: false,
    removeItemQuestionAsk: false,
    removeLessVote: false,
    lessVoteNumber: 100,
    removeLessVoteDetail: false,
    lessVoteNumberDetail: 100,
    removeAnonymousAnswer: false,
    removeMyOperateAtFollow: false,
    removeTopAD: true
  };
  var CONFIG_SUSPENSION = {
    suspensionHomeTab: false,
    suspensionHomeTabPo: "left: 20px; top: 100px;",
    suspensionHomeTabFixed: true,
    suspensionFind: false,
    suspensionFindPo: "left: 10px; top: 380px;",
    suspensionFindFixed: true,
    suspensionSearch: false,
    suspensionSearchPo: "left: 10px; top: 400px;",
    suspensionSearchFixed: true,
    suspensionUser: false,
    suspensionUserPo: "right: 60px; top: 100px;",
    suspensionUserFixed: true,
    suspensionPickUp: true,
    suspensionPickupRight: 60
  };
  var CONFIG_SIMPLE = {
    hiddenAnswerRightFooter: true,
    hiddenFixedActions: true,
    hiddenLogo: true,
    hiddenHeader: true,
    hiddenHeaderScroll: true,
    hiddenItemActions: true,
    hiddenAnswerText: true,
    hiddenQuestionShare: true,
    hiddenQuestionTag: true,
    hiddenQuestionActions: true,
    hiddenReward: true,
    hiddenZhuanlanTag: true,
    hiddenListImg: true,
    hiddenReadMoreText: true,
    hiddenAD: true,
    hiddenAnswers: true,
    hiddenZhuanlanActions: true,
    hiddenZhuanlanTitleImage: true,
    hiddenHotItemMetrics: true,
    hiddenHotItemIndex: true,
    hiddenHotItemLabel: true,
    hiddenDetailAvatar: true,
    hiddenDetailBadge: true,
    hiddenDetailVoters: false,
    hiddenWhoVoters: true,
    hiddenDetailName: true,
    hiddenDetailFollow: true,
    hiddenHomeTab: false,
    hiddenQuestionSide: true,
    hiddenQuestionFollowing: true,
    hiddenQuestionAnswer: true,
    hiddenQuestionInvite: true,
    hiddenSearchBoxTopSearch: true,
    hiddenSearchPageTopSearch: true,
    hiddenSearchPageFooter: true,
    hiddenZhuanlanShare: true,
    hiddenZhuanlanVoters: true,
    hiddenListAnswerInPerson: true,
    hiddenFollowAction: true,
    hiddenFollowChooseUser: true,
    hidden618HongBao: true,
    hiddenZhuanlanFollowButton: true,
    hiddenZhuanlanAvatarWrapper: true,
    hiddenZhuanlanAuthorInfoHead: true,
    hiddenZhuanlanAuthorInfoDetail: true,
    hiddenQuestionSpecial: true,
    hiddenListVideoContent: true,
    hiddenHomeCreatorEntrance: true,
    hiddenHomeRecommendFollow: true,
    hiddenHomeCategory: true,
    hiddenHomeCategoryMore: true,
    hiddenHomeFooter: true,
    removeFromYanxuan: true,
    removeUnrealAnswer: false,
    removeFollowVoteAnswer: false,
    removeFollowVoteArticle: false,
    removeFollowFQuestion: false,
    removeBlockUserContent: true,
    removeItemAboutAD: false,
    removeItemQuestionAsk: false,
    removeLessVote: false,
    lessVoteNumber: 100,
    removeLessVoteDetail: false,
    lessVoteNumberDetail: 100,
    suspensionHomeTab: false,
    suspensionHomeTabPo: "left: 20px; top: 100px;",
    suspensionHomeTabFixed: true,
    suspensionFind: false,
    suspensionFindPo: "left: 10px; top: 380px;",
    suspensionFindFixed: true,
    suspensionSearch: true,
    suspensionSearchPo: "left: 10px; top: 400px;",
    suspensionSearchFixed: true,
    suspensionUser: true,
    suspensionUserPo: "right: 60px; top: 100px;",
    suspensionUserFixed: true,
    suspensionPickUp: true,
    answerOpen: "off",
    showBlockUser: false,
    zoomImageType: "2",
    zoomImageSize: "200",
    questionTitleTag: true,
    listOutPutNotInterested: true,
    fixedListItemMore: true,
    highlightOriginal: true,
    highlightListItem: true,
    listItemCreatedAndModifiedTime: true,
    answerItemCreatedAndModifiedTime: true,
    questionCreatedAndModifiedTime: true,
    articleCreateTimeToTop: true,
    linkShopping: "1",
    hiddenAnswerItemActions: true,
    hiddenAnswerItemTime: true,
    videoUseLink: true,
    commitModalSizeSameVersion: true
  };
  var CONFIG_DEFAULT = {
    ...CONFIG_HIDDEN_DEFAULT,
    ...CONFIG_FILTER_DEFAULT,
    ...CONFIG_SUSPENSION,
    fetchInterceptStatus: true,
    customizeCss: "",
    answerOpen: "",
    filterKeywords: [],
    blockWordsAnswer: [],
    showBlockUser: true,
    versionHome: "1000",
    versionAnswer: "1000",
    versionArticle: "1000",
    versionHomeIsPercent: false,
    versionHomePercent: "70",
    versionAnswerIsPercent: false,
    versionAnswerPercent: "70",
    versionArticleIsPercent: false,
    versionArticlePercent: "70",
    zoomImageType: "0",
    zoomImageSize: "600",
    showGIFinDialog: false,
    globalTitle: "",
    titleIco: "",
    questionTitleTag: true,
    listOutPutNotInterested: false,
    fixedListItemMore: false,
    highlightOriginal: true,
    highlightListItem: false,
    listItemCreatedAndModifiedTime: true,
    answerItemCreatedAndModifiedTime: true,
    questionCreatedAndModifiedTime: true,
    articleCreateTimeToTop: true,
    linkShopping: "0",
    fontSizeForList: 15,
    fontSizeForAnswer: 15,
    fontSizeForArticle: 16,
    fontSizeForListTitle: 18,
    fontSizeForAnswerTitle: 22,
    fontSizeForArticleTitle: 24,
    contentLineHeight: 24,
    zoomListVideoType: "0",
    zoomListVideoSize: "500",
    hotKey: true,
    theme: 2 /* 自动 */,
    themeLight: 0 /* 默认 */,
    themeDark: 1 /* 深色护眼一 */,
    colorText1: "",
    commitModalSizeSameVersion: true,
    listOutputToQuestion: false,
    userHomeContentTimeTop: true,
    userHomeTopBlockUser: true,
    copyAnswerLink: true,
    contentRemoveKeywordSearch: false,
    topExportContent: true,
    zoomImageHeight: "0",
    zoomImageHeightSize: "100"
  };
  var SAVE_HISTORY_NUMBER = 500;
  var HTML_HOOTS = ["www.zhihu.com", "zhuanlan.zhihu.com"];
  var ID_DIALOG = "CTZ_DIALOG_MAIN";
  var CLASS_INPUT_CLICK = "ctz-i";
  var CLASS_INPUT_CHANGE = "ctz-i-change";
  var CLASS_NOT_INTERESTED = "ctz-not-interested";
  var CLASS_TO_QUESTION = "ctz-to-question";
  var CLASS_TIME_ITEM = "ctz-list-item-time";
  var CLASS_MESSAGE = "ctz-message";
  var ID_MESSAGE_BOX = "CTZ_MESSAGE_BOX";
  var OB_CLASS_FOLD = {
    on: "ctz-fold-open",
    off: "ctz-fold-close"
  };
  var EXTRA_CLASS_HTML = {
    "zhuanlan.zhihu.com": "zhuanlan",
    "www.zhihu.com": "zhihu"
  };
  var HEADER = [
    { href: "#CTZ_BASIS", value: "基础设置" },
    { href: "#CTZ_HIDDEN", value: "隐藏模块设置" },
    { href: "#CTZ_FILTER", value: "屏蔽内容设置" },
    { href: "#CTZ_BLOCK_WORD", value: "屏蔽词设置" },
    { href: "#CTZ_BLACKLIST", value: "黑名单设置" },
    { href: "#CTZ_HISTORY", value: "历史记录" },
    { href: "#CTZ_DEFAULT", value: "默认功能" }
  ];
  var FONT_SIZE_INPUT = [
    [
      { value: "fontSizeForListTitle", label: "列表标题文字大小" },
      { value: "fontSizeForList", label: "列表内容文字大小" }
    ],
    [
      { value: "fontSizeForAnswerTitle", label: "回答标题文字大小" },
      { value: "fontSizeForAnswer", label: "回答内容文字大小" }
    ],
    [
      { value: "fontSizeForArticleTitle", label: "文章标题文字大小" },
      { value: "fontSizeForArticle", label: "文章内容文字大小" }
    ],
    [{ value: "contentLineHeight", label: "内容行高" }]
  ];
  var VERSION_MIN_WIDTH = 600;
  var VERSION_RANGE = [
    {
      label: "列表页内容宽度",
      value: "versionHome",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionHomeIsPercent",
      percentChooseLabel: "列表页内容宽度用百分比设置",
      desc: "列表页内容宽度最小为600像素，设置宽度小于此则会用600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentLabel: "列表页内容宽度（百分比）",
      percentValue: "versionHomePercent"
    },
    {
      label: "回答页内容宽度",
      value: "versionAnswer",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionAnswerIsPercent",
      percentChooseLabel: "回答页内容宽度用百分比设置",
      desc: "回答页内容宽度最小为600像素，设置宽度小于此则会用600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentLabel: "回答页内容宽度（百分比）",
      percentValue: "versionAnswerPercent"
    },
    {
      label: "文章页内容宽度",
      value: "versionArticle",
      min: VERSION_MIN_WIDTH,
      max: 1500,
      percentChooseValue: "versionArticleIsPercent",
      percentChooseLabel: "文章页内容宽度用百分比设置",
      desc: "文章页内容宽度最小为600像素，设置宽度小于此则会用600像素显示",
      percentMin: 20,
      percentMax: 100,
      percentLabel: "文章页内容宽度（百分比）",
      percentValue: "versionArticlePercent"
    }
  ];
  var FILTER_FOLLOWER_OPERATE = [
    { key: "removeFollowVoteAnswer", rep: "赞同了回答" },
    { key: "removeFollowVoteArticle", rep: "赞同了文章" },
    { key: "removeFollowFQuestion", rep: "关注了问题" }
  ];
  var HIDDEN_ANSWER_TAG = {
    removeFromYanxuan: "盐选专栏",
    removeUnrealAnswer: "虚构创作",
    removeFromEBook: "电子书"
  };
  var HIDDEN_ARRAY = [
    {
      key: "CTZ_HIDDEN_COMMON",
      name: "通用隐藏",
      desc: "",
      content: [
        [
          {
            label: "广告",
            value: "hiddenAD",
            css: ".TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer,.Pc-Business-Card-PcTopFeedBanner{display: none!important;}"
          }
        ],
        [
          {
            label: "logo",
            value: "hiddenLogo",
            css: '.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}'
          },
          {
            label: "顶部悬浮模块",
            value: "hiddenHeader",
            css: ".AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}"
          },
          {
            label: "滚动顶部悬浮模块/问题名称",
            value: "hiddenHeaderScroll",
            css: ".AppHeader.is-fixed{display:none!important;}"
          }
        ],
        [
          {
            label: "发现模块-首页",
            value: "hiddenAppHeaderTabHome",
            css: ".AppHeader-Tab:nth-of-type(1){display: none}"
          },
          {
            label: "发现模块-知学堂",
            value: "hiddenAppHeaderTabZhi",
            css: ".AppHeader-Tab:nth-of-type(2){display: none}"
          },
          {
            label: "发现模块-等你来答",
            value: "hiddenAppHeaderTabWaitingForYou",
            css: ".AppHeader-Tab:nth-of-type(3){display: none}"
          },
          {
            label: "发现模块-知乎直达",
            value: "hiddenAppHeaderTabFind",
            css: ".AppHeader-Tab:nth-of-type(4){display: none}"
          }
        ],
        [
          {
            label: "回答操作文字",
            value: "hiddenAnswerText",
            css: ".ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}.ContentItem-action,.ContentItem-action button,.ContentItem-actions button{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}.VoteButton{color: #8590a6!important; }.VoteButton.is-active{color: #056de8!important;}.ContentItem-action{margin-left:8px!important;}.Search-questionFollowButton{display: none}"
          },
          {
            label: "回答隐藏用户信息下的附加信息，比如：你赞同过、XXX赞同了等...",
            value: "hiddenWhoVoters",
            css: ".css-1vqda4a{display: none!important;}"
          }
        ],
        [
          {
            label: "评论「回复」按钮",
            value: "hiddenCommitReply",
            css: ".Comments-container .css-140jo2 button:first-of-type{display:none;}"
          },
          {
            label: "评论「点赞」按钮",
            value: "hiddenCommitVote",
            css: ".Comments-container .css-140jo2 button:last-of-type{display:none;}"
          },
          {
            label: "评论底部信息",
            value: "hiddenCommitBottom",
            css: ".Comments-container .css-140jo2{display:none;}"
          }
        ],
        [
          {
            label: "知乎知学堂教育推广商品模块",
            value: "hiddenZhihuZhiShop",
            css: ".RichText-EduCardContainer{display:none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_LIST",
      name: "列表",
      desc: "只在列表中隐藏相应内容",
      content: [
        [
          {
            label: "创作中心",
            value: "hiddenHomeCreatorEntrance",
            css: ".Topstory .css-19idom{display: none;}"
          },
          {
            label: "推荐关注",
            value: "hiddenHomeRecommendFollow",
            css: ".Topstory .css-173vipd{display: none;}"
          },
          {
            label: "分类圆桌",
            value: "hiddenHomeCategory",
            css: ".Topstory .GlobalSideBar-category{display: none;}"
          },
          {
            label: "更多分类",
            value: "hiddenHomeCategoryMore",
            css: '.Topstory .Card[aria-label="更多分类入口"]{display:none;}'
          },
          {
            label: "知乎指南",
            value: "hiddenHomeFooter",
            css: ".Topstory .Footer,.Topstory footer{display: none;}"
          },
          {
            label: "盐选作者平台",
            value: "hiddenYanXuanWriter",
            css: ".KfeCollection-CreateSaltCard{display:none!important;}"
          }
        ],
        [
          {
            label: "首页列表切换模块",
            value: "hiddenHomeListTab",
            css: ".Topstory-container .TopstoryTabs{display: none}"
          },
          {
            label: "首页列表切换 - 关注",
            value: "hiddenHomeListTabFollow",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}'
          },
          {
            label: "首页列表切换 - 推荐",
            value: "hiddenHomeListTabRecommend",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}'
          },
          {
            label: "首页列表切换 - 热榜",
            value: "hiddenHomeListTabHot",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}'
          },
          {
            label: "首页列表切换 - 视频",
            value: "hiddenHomeListTabVideo",
            css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}'
          }
        ],
        [
          {
            label: "热门排序编号",
            value: "hiddenHotItemIndex",
            css: ".HotItem-index{display: none;}.HotItem{padding: 16px!important;}"
          },
          {
            label: '热门"新"元素',
            value: "hiddenHotItemLabel",
            css: ".HotItem-label{display: none;}"
          },
          {
            label: "热门热度值",
            value: "hiddenHotItemMetrics",
            css: ".HotItem-content .HotItem-metrics{display: none;}"
          }
        ],
        [
          {
            label: "列表回答内容",
            value: "hiddenAnswers",
            css: ".Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt,.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer{display: none;}"
          },
          {
            label: "列表视频回答的内容",
            value: "hiddenListVideoContent",
            css: ".Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}"
          },
          {
            label: "列表回答操作",
            value: "hiddenItemActions",
            css: ".Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint{visibility:hidden!important;height:0!important;padding:0!important;}.TopstoryQuestionAskItem-hint{margin: 0!important;}.Topstory .ContentItem-actions{padding: 0!important;}.zhuanlan .ContentItem .ContentItem-actions:not(.Sticky){visibility:hidden!important;height:0!important;}"
          },
          {
            label: "列表图片",
            value: "hiddenListImg",
            css: ".RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}"
          },
          {
            label: "问题列表阅读全文文字",
            value: "hiddenReadMoreText",
            css: ".ContentItem-more{font-size:0!important;}"
          },
          {
            label: "列表「亲自答」标签",
            value: "hiddenListAnswerInPerson",
            css: ".Topstory-mainColumn .LabelContainer{display: none;}"
          }
        ],
        [
          {
            label: "关注列表关注人操作栏",
            value: "hiddenFollowAction",
            css: ".TopstoryItem-isFollow .FeedSource-firstline{display: none;}"
          },
          {
            label: "关注列表用户信息",
            value: "hiddenFollowChooseUser",
            css: ".TopstoryItem-isFollow .AuthorInfo{display: none;}"
          }
        ],
        [
          {
            label: "搜索栏知乎热搜",
            value: "hiddenSearchBoxTopSearch",
            css: ".SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}"
          },
          {
            label: "搜索页知乎热搜",
            value: "hiddenSearchPageTopSearch",
            css: ".Search-container .TopSearch{display: none;}"
          },
          {
            label: "搜索页知乎指南",
            value: "hiddenSearchPageFooter",
            css: ".Search-container .Footer,.Search-container footer{display: none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ANSWER",
      name: "问答",
      desc: "只在回答页面中隐藏相应内容",
      content: [
        [
          {
            label: "问题话题",
            value: "hiddenQuestionTag",
            css: ".QuestionHeader-tags{display: none!important;}"
          },
          {
            label: "问题分享",
            value: "hiddenQuestionShare",
            css: ".zhihu .Popover.ShareMenu{display: none!important;}"
          },
          {
            label: "「好问题」按钮",
            value: "hiddenQuestionGoodQuestion",
            css: ".QuestionPage .QuestionHeader .GoodQuestionAction{display: none}"
          },
          {
            label: "添加评论",
            value: "hiddenQuestionComment",
            css: ".QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}"
          },
          {
            label: "问题更多「...」按钮",
            value: "hiddenQuestionMore",
            css: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}'
          },
          {
            label: "问题操作栏",
            value: "hiddenQuestionActions",
            css: ".QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}"
          },
          {
            label: "问题专题收录标签",
            value: "hiddenQuestionSpecial",
            css: ".QuestionHeader .LabelContainer-wrapper{display: none;}"
          },
          {
            label: "问题关注按钮",
            value: "hiddenQuestionFollowing",
            css: ".QuestionHeader .FollowButton{display: none;}"
          },
          {
            label: "问题写回答按钮",
            value: "hiddenQuestionAnswer",
            css: ".QuestionHeader .FollowButton ~ a{display: none;}"
          },
          {
            label: "问题邀请回答按钮",
            value: "hiddenQuestionInvite",
            css: ".QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}"
          },
          {
            label: "问题标题卡片广告和榜单",
            value: "hiddenQuestionAD",
            css: ".css-e69dqy,.Card.css-15hh8yc{display: none;}"
          }
        ],
        [
          {
            label: "回答人头像",
            value: "hiddenDetailAvatar",
            css: ".AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}"
          },
          {
            label: "回答人姓名",
            value: "hiddenDetailName",
            css: ".AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}"
          },
          {
            label: "回答人简介",
            value: "hiddenDetailBadge",
            css: ".AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}"
          },
          {
            label: "回答人关注按钮",
            value: "hiddenDetailFollow",
            css: ".AnswerItem .AuthorInfo .FollowButton{display: none;}"
          },
          {
            label: "回答人下赞同数",
            value: "hiddenDetailVoters",
            css: ".AnswerItem .css-dvccr2{display: none;}"
          },
          {
            label: "问题关注和被浏览数",
            value: "hiddenQuestionSide",
            css: ".QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}"
          },
          {
            label: "回答底部悬浮操作栏",
            value: "hiddenFixedActions",
            css: ".zhihu .ContentItem .RichContent-actions.is-fixed,.zhihu .List-item .RichContent-actions.is-fixed{visibility: hidden!important;}"
          },
          {
            label: "回答内容操作栏",
            value: "hiddenAnswerItemActions",
            css: ".Question-main .ContentItem-actions>span,.Question-main .ContentItem-actions>button,.Question-main .ContentItem-actions>div,.Question-main .ContentItem-actions>a{visibility:hidden!important;height:0!important;padding:0!important;}"
          },
          {
            label: "赞赏按钮",
            value: "hiddenReward",
            css: ".Reward{display: none!important;}"
          },
          {
            label: "618红包链接",
            value: "hidden618HongBao",
            css: '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}'
          }
        ],
        [
          {
            label: "回答底部发布编辑时间和IP",
            value: "hiddenAnswerItemTime",
            css: ".Question-main .ContentItem-time{display: none;margin: 0;}"
          },
          {
            label: "回答底部发布编辑时间（保留IP）",
            value: "hiddenAnswerItemTimeButHaveIP",
            css: ".Question-main .ContentItem-time>a{display: none;}.Question-main .ContentItem-time:empty{display: none;margin: 0;}"
          },
          {
            label: "回答底部「继续追问」模块",
            value: "hiddenAnswerKeepAsking",
            css: ".css-jghqwm{display: none!important;}"
          }
        ],
        [
          {
            label: "详情右侧信息栏",
            value: "hiddenAnswerRightFooter",
            css: ".Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}"
          },
          {
            label: "信息栏关于作者",
            value: "hiddenAnswerRightFooterAnswerAuthor",
            css: ".Question-sideColumn .AnswerAuthor{display: none;}"
          },
          {
            label: "信息栏被收藏次数",
            value: "hiddenAnswerRightFooterFavorites",
            css: ".Question-sideColumn .AnswerAuthor + .Card{display: none;}"
          },
          {
            label: "信息栏相关问题",
            value: "hiddenAnswerRightFooterRelatedQuestions",
            css: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}'
          },
          {
            label: "信息栏相关推荐",
            value: "hiddenAnswerRightFooterContentList",
            css: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}'
          },
          {
            label: "信息栏知乎指南",
            value: "hiddenAnswerRightFooterFooter",
            css: ".Question-sideColumn .Footer{display: none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_ARTICLE",
      name: "文章",
      desc: "只在文章页面中隐藏相应内容",
      content: [
        [
          {
            label: "文章关联话题",
            value: "hiddenZhuanlanTag",
            css: ".Post-topicsAndReviewer{display: none!important;}"
          },
          {
            label: "文章标题图片",
            value: "hiddenZhuanlanTitleImage",
            css: ".css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}"
          },
          {
            label: "文章悬浮分享按钮",
            value: "hiddenZhuanlanShare",
            css: ".zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}"
          },
          {
            label: "文章悬浮赞同按钮",
            value: "hiddenZhuanlanVoters",
            css: ".zhuanlan .Post-SideActions .like{display: none!important;}"
          },
          {
            label: "文章作者头像",
            value: "hiddenZhuanlanAvatarWrapper",
            css: ".zhuanlan .AuthorInfo-avatarWrapper{display: none;}"
          },
          {
            label: "文章作者姓名",
            value: "hiddenZhuanlanAuthorInfoHead",
            css: ".zhuanlan .AuthorInfo-head{display: none;}"
          },
          {
            label: "文章作者简介",
            value: "hiddenZhuanlanAuthorInfoDetail",
            css: ".zhuanlan .AuthorInfo-detail{display: none;}"
          },
          {
            label: "文章作者关注按钮",
            value: "hiddenZhuanlanFollowButton",
            css: ".zhuanlan .FollowButton{display: none;}"
          },
          {
            label: "文章底部悬浮操作栏",
            value: "hiddenZhuanlanActions",
            css: ".RichContent-actions.is-fixed>.ContentItem-actions{display: none;}.zhuanlan .ContentItem .RichContent-actions.is-fixed,.zhuanlan .List-item .RichContent-actions.is-fixed{visibility: hidden!important;}"
          },
          {
            label: "文章底部知乎热榜",
            value: "hiddenZhuanlanButtonHot",
            css: ".zhuanlan .Post-Sub .css-1ildg7g{display: none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_USER_HOME",
      name: "用户主页",
      desc: "只在用户主页隐藏相应内容",
      content: [
        [
          {
            label: "用户主页付费咨询、认证和成就",
            value: "hiddenUserHomeOtherCard",
            css: ".Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}"
          },
          {
            label: "用户主页出版作品",
            value: "hiddenUserHomePublications",
            css: ".Profile-sideColumn .Card.Publications{display:none;}"
          },
          {
            label: "用户主页创作中心",
            value: "hiddenUserHomeCreateEntrance",
            css: ".Profile-sideColumn .CreatorEntrance{display:none;}"
          },
          {
            label: "用户主页关注和关注者卡片",
            value: "hiddenUserHomeFollow",
            css: ".Profile-sideColumn .FollowshipCard{display:none;}"
          },
          {
            label: "用户主页关注的内容和赞助",
            value: "hiddenUserHomeLightList",
            css: ".Profile-sideColumn .Profile-lightList{display:none;}"
          },
          {
            label: "用户主页右侧屏蔽·举报用户、个人主页被浏览次数",
            value: "hiddenUserHomeFooterOperate",
            css: ".Profile-sideColumn .Profile-footerOperations{display:none;}"
          },
          {
            label: "用户主页知乎指南",
            value: "hiddenUserHomeFooter",
            css: ".Profile-sideColumn footer{display:none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_USER_COLLECTIONS",
      name: "收藏夹主页",
      desc: "只在我的收藏夹主页隐藏相应内容",
      content: [
        [
          {
            label: "收藏夹创作中心",
            value: "hiddenCollectionsCreate",
            css: ".Collections-container .Card.CreatorEntrance{display:none;}"
          },
          {
            label: "收藏夹推荐关注",
            value: "hiddenCollectionsRecommendFollow",
            css: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}'
          },
          {
            label: "收藏夹圆桌入口",
            value: "hiddenCollectionsCategory",
            css: ".Collections-container .Card.GlobalSideBar-category{display:none;}"
          },
          {
            label: "收藏夹更多分类",
            value: "hiddenCollectionsComplementary",
            css: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}'
          },
          {
            label: "收藏夹知乎指南",
            value: "hiddenCollectionsFooter",
            css: ".Collections-container footer{display:none;}"
          }
        ]
      ]
    },
    {
      key: "CTZ_HIDDEN_TOPIC",
      name: "话题",
      desc: "只在话题隐藏相应内容",
      content: [
        [
          {
            label: "话题主页右侧浏览/讨论量模块",
            value: "hiddenTopicRightNumberBoard",
            css: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard{display:none;}'
          },
          {
            label: "话题主页右侧父子话题模块",
            value: "hiddenTopicRightParentChild",
            css: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}'
          },
          {
            label: "话题主页右侧知乎指南",
            value: "hiddenTopicRightFooter",
            css: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}'
          }
        ]
      ]
    }
  ];
  var HIDDEN_ARRAY_MORE = [
    {
      keys: [
        "hiddenUserHomeOtherCard",
        "hiddenUserHomePublications",
        "hiddenUserHomeCreateEntrance",
        "hiddenUserHomeFollow",
        "hiddenUserHomeLightList",
        "hiddenUserHomeFooterOperate",
        "hiddenUserHomeFooter"
      ],
      value: ".Profile-sideColumn{display: none}"
    },
    {
      keys: ["hiddenSearchPageTopSearch", "hiddenSearchPageFooter"],
      value: ".SearchSideBar{display: none}"
    },
    {
      keys: ["hiddenHomeCreatorEntrance", "hiddenHomeRecommendFollow", "hiddenHomeCategory", "hiddenHomeCategoryMore", "hiddenHomeFooter"],
      value: ".Topstory-mainColumn{margin: 0 auto;}"
    },
    {
      keys: ["hiddenHomeListTabFollow", "hiddenHomeListTabRecommend", "hiddenHomeListTabHot", "hiddenHomeListTabVideo"],
      value: ".Topstory-container .TopstoryTabs{display: none}"
    },
    {
      keys: ["hiddenTopicRightNumberBoard", "hiddenTopicRightParentChild", "hiddenTopicRightFooter"],
      value: '[data-za-detail-view-path-module="TopicItem"]>div:nth-child(2){display: none;}'
    }
  ];
  var FOOTER_HTML = `<a href="https://github.com/liuyubing233/zhihu-custom" target="_blank">Github⭐</a><a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>`;
  var DEFAULT_FUNCTION = [
    '外链直接打开<div class="ctz-commit">知乎里所有外部链接的重定向去除，可以直接访问</div>',
    "移除登录提示弹窗",
    '一键移除所有屏蔽选项，点击「话题黑名单」编辑按钮出现按钮<div class="ctz-commit">知乎<a href="https://www.zhihu.com/settings/filter" target="_blank">屏蔽页面</a>每次只显示部分内容，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签</div>',
    '回答视频下载<div class="ctz-commit">回答内容视频左上角会生成一个下载按钮，点击即可下载视频</div>',
    '收藏夹内容导出为 PDF（需开启接口拦截）<div class="ctz-commit">点击收藏夹名称上方「生成PDF」按钮，可导出当前页码的收藏夹详细内容</div>',
    '个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注<div class="ctz-commit">由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面</div>',
    "推荐页内容链接根据有新到旧进行缓存，可缓存 100 条；缓存内容在「编辑器 - 历史记录 - 推荐列表缓存」",
    "可保存 100 条浏览历史记录链接，内容为打开的问题、文章、视频；「编辑器 - 历史记录 - 浏览历史记录」",
    '静态图片弹窗观看点击键盘左右直接切换到上一张或下一张<div class="ctz-commit">查看图片点击预览大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示</div>',
    "用户主页-回答-导出当前页回答的功能（需开启接口拦截）",
    "用户主页-文章-导出当前页文章的功能（需开启接口拦截）"
  ];
  var BASIC_SHOW_CONTENT = [
    { label: "去除热词点击搜索", value: "contentRemoveKeywordSearch" },
    {
      label: `<b>列表</b>标题类别显示<span class="ctz-label-tag ctz-label-tag-Answer">问答</span><span class="ctz-label-tag ctz-label-tag-Article">文章</span><span class="ctz-label-tag ctz-label-tag-ZVideo">视频</span><span class="ctz-label-tag ctz-label-tag-Pin">想法</span>`,
      value: "questionTitleTag"
    },
    { label: "<b>列表</b>更多「···」按钮移动到最右侧", value: "fixedListItemMore" },
    { label: "<b>列表</b>点击高亮边框", value: "highlightListItem" },
    { label: "<b>推荐列表</b>「不感兴趣」按钮", value: "listOutPutNotInterested", needFetch: true },
    { label: "<b>推荐列表</b>「直达问题」按钮", value: "listOutputToQuestion" },
    { label: "<b>关注列表</b>高亮原创内容", value: "highlightOriginal" },
    { label: "<b>推荐、关注列表</b>内容置顶发布时间和最后修改时间", value: "listItemCreatedAndModifiedTime" },
    { label: "赞同按钮仅显示数字", value: "justVoteNum" },
    { label: "评论按钮仅显示数字", value: "justCommitNum" },
    { label: "<b>问题详情</b>置顶创建时间和最后修改时间", value: "questionCreatedAndModifiedTime" },
    { label: "<b>回答</b>顶部显示赞同人数", value: "topVote" },
    { label: "<b>回答</b>一键获取回答链接", value: "copyAnswerLink" },
    { label: "<b>回答</b>置顶创建时间与最后修改时间", value: "answerItemCreatedAndModifiedTime" },
    { label: "<b>文章</b>发布时间置顶", value: "articleCreateTimeToTop" },
    { label: "<b>回答、文章</b>顶部显示导出当前内容/回答按钮", value: "topExportContent" },
    { label: "<b>回答、文章</b>中视频替换为链接", value: "videoUseLink" },
    { label: "<b>用户主页</b>内容置顶发布、修改时间", value: "userHomeContentTimeTop" },
    { label: "<b>用户主页</b>置顶「屏蔽用户」按钮", value: "userHomeTopBlockUser" }
  ];
  var HIGH_PERFORMANCE = [
    { label: "推荐列表高性能模式（推荐列表内容最多保留30条，超出则删除之前内容）", value: "highPerformanceRecommend" },
    { label: "回答页高性能模式（最多保留30条回答，超出则删除之前回答）", value: "highPerformanceAnswer" }
  ];
  var ICO_URL = {
    zhihu: "https://static.zhihu.com/heifetz/favicon.ico",
    github: "https://github.githubassets.com/pinned-octocat.svg",
    juejin: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png",
    csdn: "https://g.csdnimg.cn/static/logo/favicon32.ico",
    bilibili: "https://www.bilibili.com/favicon.ico",
    lanhu: "https://sso-cdn.lanhuapp.com/ssoweb/favicon.ico",
    yuque: "https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*vMxOQIh4KBMAAAAAAAAAAAAADvuFAQ/original",
    mailQQ: "https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png",
    mail163: "https://mail.163.com/favicon.ico",
    weibo: "https://weibo.com/favicon.ico",
    qzone: "https://qzonestyle.gtimg.cn/aoi/img/logo/favicon.ico?max_age=31536000",
    baidu: "https://www.baidu.com/favicon.ico"
  };
  var myStorage = {
    set: async function(name, value) {
      value.t = +/* @__PURE__ */ new Date();
      const v = JSON.stringify(value);
      localStorage.setItem(name, v);
      await GM.setValue(name, v);
    },
    get: async function(name) {
      const config = await GM.getValue(name);
      const configLocal = localStorage.getItem(name);
      const cParse = config ? JSON.parse(config) : null;
      const cLParse = configLocal ? JSON.parse(configLocal) : null;
      if (!cParse && !cLParse) return "";
      if (!cParse) return configLocal;
      if (!cLParse) return config;
      if (cParse.t < cLParse.t) return configLocal;
      return config;
    },
    getConfig: async function() {
      const nConfig = await this.get("pfConfig");
      return Promise.resolve(nConfig ? JSON.parse(nConfig) : {});
    },
    getHistory: async function() {
      const nHistory = await myStorage.get("pfHistory");
      const h = nHistory ? JSON.parse(nHistory) : { list: [], view: [] };
      return Promise.resolve(h);
    },
    updateConfigItem: async function(key, value) {
      const config = await this.getConfig();
      if (typeof key === "string") {
        config[key] = value;
      } else {
        for (let itemKey in key) {
          config[itemKey] = key[itemKey];
        }
      }
      await this.updateConfig(config);
    },
    updateConfig: async function(params) {
      await this.set("pfConfig", params);
    },
    updateHistoryItem: async function(key, params) {
      const pfHistory = await this.getHistory();
      pfHistory[key] = params.slice(0, SAVE_HISTORY_NUMBER);
      await this.set("pfHistory", pfHistory);
    },
    updateHistory: async function(value) {
      await this.set("pfHistory", value);
    }
  };
  var dom = (n) => document.querySelector(n);
  var domById = (id) => document.getElementById(id);
  var domA = (n) => document.querySelectorAll(n);
  var domC = (name, attrObjs) => {
    const node = document.createElement(name);
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
    return node;
  };
  var domP = (node, attrName, attrValue) => {
    const nodeP = node.parentElement;
    if (!nodeP) return void 0;
    if (!attrName || !attrValue) return nodeP;
    if (nodeP === document.body) return void 0;
    const attrValueList = (nodeP.getAttribute(attrName) || "").split(" ");
    return attrValueList.includes(attrValue) ? nodeP : domP(nodeP, attrName, attrValue);
  };
  var insertAfter = (newElement, targetElement) => {
    const parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };
  var fnReturnStr = (str, isHave = false, strFalse = "") => isHave ? str : strFalse;
  var fnLog = (...str) => console.log("%c「知乎修改器」", "color: green;font-weight: bold;", ...str);
  var fnAppendStyle = (id, innerHTML) => {
    const element = domById(id);
    element ? element.innerHTML = innerHTML : document.head.appendChild(domC("style", { id, type: "text/css", innerHTML }));
  };
  var fnDomReplace = (node, attrObjs) => {
    if (!node) return;
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
  };
  function throttle(fn, time = 300) {
    let tout = void 0;
    return function() {
      clearTimeout(tout);
      tout = setTimeout(() => {
        fn.apply(this, arguments);
      }, time);
    };
  }
  var pathnameHasFn = (obj) => {
    const { pathname } = location;
    for (let name in obj) {
      pathname.includes(name) && obj[name]();
    }
  };
  var windowResize = () => {
    window.dispatchEvent(new Event("resize"));
  };
  var mouseEventClick = (element) => {
    if (!element) return;
    const myWindow = isSafari ? window : unsafeWindow;
    const event = new MouseEvent("click", {
      view: myWindow,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  };
  var copy = async (value) => {
    if (navigator.clipboard && navigator.permissions) {
      await navigator.clipboard.writeText(value);
    } else {
      const domTextarea = domC("textArea", {
        value,
        style: "width: 0px;position: fixed;left: -999px;top: 10px;"
      });
      domTextarea.setAttribute("readonly", "readonly");
      document.body.appendChild(domTextarea);
      domTextarea.select();
      document.execCommand("copy");
      document.body.removeChild(domTextarea);
    }
  };
  var messageDoms = [];
  var message = (value, t = 3e3) => {
    const time = +/* @__PURE__ */ new Date();
    const classTime = `ctz-message-${time}`;
    const nDom = domC("div", {
      innerHTML: value,
      className: `${CLASS_MESSAGE} ${classTime}`
    });
    const domBox = domById(ID_MESSAGE_BOX);
    if (!domBox) return;
    domBox.appendChild(nDom);
    messageDoms.push(nDom);
    if (messageDoms.length > 3) {
      const prevDom = messageDoms.shift();
      prevDom && domBox.removeChild(prevDom);
    }
    setTimeout(() => {
      const nPrevDom = dom(`.${classTime}`);
      if (nPrevDom) {
        domById(ID_MESSAGE_BOX).removeChild(nPrevDom);
        messageDoms.shift();
      }
    }, t);
  };
  var createButtonST = (innerHTML, extraCLass = "", extra = {}) => domC("button", {
    innerHTML,
    className: `ctz-button ctz-button-small ctz-button-transparent ${extraCLass}`,
    style: "margin: 0 4px;",
    ...extra
  });
  var judgeBrowserType = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Chrome")) return "Chrome";
    return "Safari";
  };
  var isSafari = judgeBrowserType() === "Safari";
  var fnHidden = (ev, msg) => {
    ev.style.display = "none";
    fnLog(msg);
  };
  var fnJustNum = async (element) => {
    if (!element) return;
    const { justVoteNum, justCommitNum } = await myStorage.getConfig();
    const nodeVoteUp = element.querySelector(".VoteButton--up");
    if (justVoteNum && nodeVoteUp) {
      nodeVoteUp.style.cssText = "font-size: 14px!important;";
      nodeVoteUp.innerHTML = nodeVoteUp.innerHTML.replace("赞同 ", "");
    }
    if (justCommitNum) {
      const buttons = element.querySelectorAll(".ContentItem-actions button");
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        if (btn.innerHTML.includes("条评论")) {
          btn.style.cssText = "font-size: 14px!important;margin-top:-5px;";
          btn.innerHTML = btn.innerHTML.replace("条评论", "");
        }
      }
    }
  };
  var echoData = async () => {
    const pfConfig = await myStorage.getConfig();
    const textSameName = {
      globalTitle: (e) => e.value = pfConfig.globalTitle || document.title,
      customizeCss: (e) => e.value = pfConfig.customizeCss || ""
    };
    const echoText = (even) => {
      textSameName[even.name] ? textSameName[even.name](even) : even.value = pfConfig[even.name];
    };
    const echo = {
      radio: (even) => pfConfig.hasOwnProperty(even.name) && String(even.value) === String(pfConfig[even.name]) && (even.checked = true),
      checkbox: (even) => even.checked = pfConfig[even.name] || false,
      text: echoText,
      number: echoText,
      range: (even) => {
        const nValue = pfConfig[even.name];
        const nodeRange = dom(`[name="${even.name}"]`);
        const min = nodeRange && nodeRange.min;
        const rangeNum = isNaN(+nValue) || !(+nValue > 0) ? min : nValue;
        even.value = rangeNum;
        const nodeNewOne = domById(even.name);
        nodeNewOne && (nodeNewOne.innerText = rangeNum);
      }
    };
    const doEcho = (item) => {
      echo[item.type] && echo[item.type](item);
    };
    const nodeArrInputClick = domA(`.${CLASS_INPUT_CLICK}`);
    for (let i = 0, len = nodeArrInputClick.length; i < len; i++) {
      doEcho(nodeArrInputClick[i]);
    }
    const nodeArrInputChange = domA(`.${CLASS_INPUT_CHANGE}`);
    for (let i = 0, len = nodeArrInputChange.length; i < len; i++) {
      doEcho(nodeArrInputChange[i]);
    }
    echo.text(dom('[name="globalTitle"]'));
    VERSION_RANGE.forEach((item) => {
      const isPercent = pfConfig[item.percentChooseValue];
      const domRange = dom(`.ctz-range-${item.value}`);
      const domRangePercent = dom(`.ctz-range-${item.percentValue}`);
      if (domRange && domRangePercent) {
        domRange.style.display = isPercent ? "none" : "flex";
        domRangePercent.style.display = !isPercent ? "none" : "flex";
      }
    });
  };
  var Store = class {
    constructor() {
      this.userinfo = void 0;
      this.findEvent = {
        header: { fun: null, num: 0, isFind: false }
      };
      this.storageConfig = {
        cacheTitle: "",
        fetchHeaders: {},
        headerDoms: {}
      };
      this.removeRecommendIds = [];
      this.userAnswers = [];
      this.userArticle = [];
      this.setUserinfo = this.setUserinfo.bind(this);
      this.getUserinfo = this.getUserinfo.bind(this);
      this.setFindEventItem = this.setFindEventItem.bind(this);
      this.getFindEventItem = this.getFindEventItem.bind(this);
      this.setStorageConfigItem = this.setStorageConfigItem.bind(this);
      this.getStorageConfigItem = this.getStorageConfigItem.bind(this);
      this.findRemoveRecommends = this.findRemoveRecommends.bind(this);
      this.getRemoveRecommends = this.getRemoveRecommends.bind(this);
      this.setUserAnswer = this.setUserAnswer.bind(this);
      this.getUserAnswer = this.getUserAnswer.bind(this);
      this.setUserArticle = this.setUserArticle.bind(this);
      this.getUserArticle = this.getUserArticle.bind(this);
    }
    setUserinfo(inner) {
      this.userinfo = inner;
    }
    getUserinfo() {
      return this.userinfo;
    }
    setFindEventItem(key, content) {
      this.findEvent[key] = content;
    }
    getFindEventItem(key) {
      return this.findEvent[key];
    }
    setStorageConfigItem(key, content) {
      this.storageConfig[key] = content;
    }
    getStorageConfigItem(key) {
      return this.storageConfig[key];
    }
    async findRemoveRecommends(recommends) {
      const config = await myStorage.getConfig();
      for (let i = 0, len = recommends.length; i < len; i++) {
        const item = recommends[i];
        if (!item.target) continue;
        if (config.removeFromYanxuan && item.target.paid_info) {
          this.removeRecommendIds = [...this.removeRecommendIds, String(item.target.id)];
        }
      }
    }
    getRemoveRecommends() {
      return this.removeRecommendIds;
    }
    setUserAnswer(data) {
      this.userAnswers = data;
    }
    getUserAnswer() {
      return this.userAnswers;
    }
    setUserArticle(data) {
      this.userArticle = data;
    }
    getUserArticle() {
      return this.userArticle;
    }
  };
  var store = new Store();
  var REGEXP_MESSAGE = /^\([^()]+\)/;
  var changeTitle = async () => {
    const { getStorageConfigItem } = store;
    const { globalTitle, globalTitleRemoveMessage } = await myStorage.getConfig();
    const cacheTitle = getStorageConfigItem("cacheTitle");
    let prevTitle = globalTitle || cacheTitle;
    if (globalTitleRemoveMessage) {
      if (REGEXP_MESSAGE.test(prevTitle)) {
        prevTitle = prevTitle.replace(REGEXP_MESSAGE, "").trim();
      }
    }
    document.title = prevTitle;
  };
  var changeICO = async () => {
    const { titleIco = "" } = await myStorage.getConfig();
    const nId = "CTZ_ICO";
    if (!ICO_URL[titleIco]) return;
    const nodeXIcon = dom('[type="image/x-icon"]');
    const nodeId = domById(nId);
    nodeXIcon && nodeXIcon.remove();
    nodeId && nodeId.remove();
    dom("head").appendChild(
      domC("link", {
        type: "image/x-icon",
        href: ICO_URL[titleIco],
        id: nId,
        rel: "icon"
      })
    );
  };
  var appendClassStart = (str) => appendPrefix(str, (i) => `[class|="${i}"]`);
  var appendPrefix = (str, mapCB) => str.split(",").map(mapCB).join(",");
  var myBackground = {
    init: async function() {
      const { themeDark = 1 /* 深色护眼一 */, themeLight = 0 /* 默认 */, colorText1 } = await myStorage.getConfig();
      const getBackground = async () => {
        if (await isDark()) return this.dark(themeDark);
        if (+themeLight === 0 /* 默认 */) return this.default();
        return this.light(themeLight);
      };
      fnAppendStyle("CTZ_STYLE_BACKGROUND", await getBackground() + fnReturnStr(`.ContentItem-title, body{color: ${colorText1}!important;}`, !!colorText1));
    },
    doSetCSS: function(bg1, bg2) {
      return `${this.cssBG1}{background-color: ${bg1}!important;}${this.cssBG2}{background-color:${bg2}!important;background:${bg2}!important;}${this.cssBGTransparent}{background-color: transparent!important;background: transparent!important;}${this.cssBG1Color}{color: ${bg1}!important}.SignContainer-content input:-webkit-autofill{-webkit-box-shadow: inset 0 0 0 30px ${bg2}!important;}`;
    },
    default: () => ".GlobalSideBar-navList{background: #fff}",
    light: function(lightKey) {
      const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
      const nodeAppHeader = dom(".AppHeader");
      const nodeTopStoryC = dom(".Topstory>div:not(.Topstory-container)");
      const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
      const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
      const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : "";
      return this.doSetCSS(background, background2) + `.MenuBar-root-rQeFm{border-color: ${background}!important;}${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : ".AppHeader"}{background-color:${background2}!important;background:${background2}!important;}.ctz-menu-top>a.target::before,.ctz-menu-top>a.target::after{${this.menuBeforeAfter(background2)}}`;
    },
    dark: function(darkKey) {
      const { background, background2 } = THEME_CONFIG_DARK[darkKey];
      return `html[data-theme=dark] .ctz-menu-top>a.target::before,html[data-theme=dark] .ctz-menu-top>a.target::after{${this.menuBeforeAfter(background2)}}` + appendPrefix(
        this.doSetCSS(background, background2) + `#${ID_DIALOG},.${CLASS_MESSAGE},#CTZ_MAIN input,#CTZ_MAIN textarea,.ctz-footer,#CTZ_CLOSE_DIALOG,.ctz-commit,#CTZ_OPEN_BUTTON,.ctz-export-collection-box p,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button,.Modal-title,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.FeedbackModal-title,.css-r38x5n div,.css-1dwlho,.LiveDetailsPage-root-aLVPj div,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div,.css-10ub9de,.css-1wbvd3d,.css-1f4cz9u,.css-y42e6l,.css-jiu0xt,.css-1myqwel,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1,.ChatListGroup-SectionTitle .Zi,.Qrcode-container>div,.Qrcode-guide-message>div,.signQr-leftContainer button,.signQr-leftContainer a,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div,.css-1e1wubc,.css-1e1wubc div,.css-12kq1qx,.css-172osot div,.css-172osot a:last-child,.css-f2jj4r,.css-10u695f,.css-wqf2py,.css-wmwsyx,.css-wmwsyx div,.CreatorSalt-personalInfo-name,.css-c3gbo3,.css-1ygg4xu blockquote,.css-r8ate4,.ant-collapse>.ant-collapse-item>.ant-collapse-header,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover,.Creator-salt-author-welfare .Creator-salt-author-welfare-card h1,.css-u56wtg,.css-1hrberl,.css-13e6wvn,.css-i0heim,.CommentContent,${appendClassStart(
          "index-title,CourseConsultation-tip,index-text,index-number,CourseDescription-playCount,LecturerList-title,LearningRouteCard-title,index-tabItemLabel,VideoCourseCard-module,TextTruncation-module"
        )}{color: #f7f9f9!important}css-1x3upj1,.PlaceHolder-inner,.PlaceHolder-mask path,.css-1kxql2v{color: ${background2}!important}.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.css-1qap1n7,.ContentItem-more,.ContentItem-title a:hover,.Profile-lightItem:hover,.Profile-lightItem:hover .Profile-lightItemValue,.css-p54aph:hover,.PushNotifications-item a:hover,.PushNotifications-item a,.NotificationList-Item-content .NotificationList-Item-link:hover,.SettingsQA a,a.QuestionMainAction:hover,.SimilarQuestions-item .Button,.CreatorSalt-IdentitySelect-Button,.signQr-leftContainer button:hover,.signQr-leftContainer a:hover,.Profile-sideColumnItemLink:hover,.FollowshipCard-link,.css-zzimsj:hover,.css-vphnkw,.css-1aqu4xd,.css-6m0nd1,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue,a.external,.RichContent-EntityWord,.SideBarCollectionItem-title,.Tag-content,.LabelContainer div,.LabelContainer a,.KfeCollection-OrdinaryLabel-newStyle-mobile .KfeCollection-OrdinaryLabel-content,.KfeCollection-OrdinaryLabel-newStyle-pc .KfeCollection-OrdinaryLabel-content,.KfeCollection-CreateSaltCard-button,.KfeCollection-PcCollegeCard-searchMore{color: deepskyblue!important;}.css-1tu59u4,.ZDI,.ZDI--PencilCircleFill24,.Zi,.Zi--ArrowDown{fill: deepskyblue!important;}.ztext pre,.ztext code{background: ${background}!important;}#${ID_DIALOG}{border: 1px solid ${background2}}.ctz-button{background: ${background2};border-color: #f7f9f9;color: #f7f9f9;}`,
        (i) => `html[data-theme=dark] ${i}`
      );
    },
    cssBG1: `#${ID_DIALOG},.ctz-content-right>div:nth-of-type(2n),.ctz-content-left>a:hover,.ctz-black-item,.ctz-block-words-content>span,body,.Input-wrapper,.toolbar-section button:hover,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.PostItem,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions,.Messages-newItem,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover,.Popover-content button:hover,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp,.index-videoCardItem-bzeJ1,.KfeCollection-IntroCard-newStyle-mobile,.KfeCollection-IntroCard-newStyle-pc,.FeeConsultCard,.Avatar,.TextMessage-sender,.ChatUserListItem--active,.css-yoby3j,.css-wmwsyx,.css-wmwsyx button,.css-82b621,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-item:hover,.index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza,.index-courseCard-ebw4r,${appendClassStart("Tabs-container,EpisodeList-sectionItem")}`,
    cssBG2: `#CTZ_MAIN input,#CTZ_MAIN textarea,.${CLASS_MESSAGE},.ctz-content,.ctz-menu-top>a.target,.ctz-menu-top>a:hover span,#CTZ_OPEN_BUTTON,#CTZ_CLOSE_DIALOG:hover,.Card,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div,.css-1j23ebo,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ,.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item,.CreatorSalt-letter-wrapper,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div,.Creator-salt-new-author-content,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ZVideoToolbar button,.Creator-salt-author-welfare .Creator-salt-author-welfare-card,.Creator-salt-author-welfare-banner,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5),.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG,.css-1b0ypf8 div,.css-np3nxw div,.css-1i12cbe,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer,.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.InputLike,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-table,.Popover-content,.Notifications-footer,.Messages-footer,.Popover-arrow:after,.css-97fdvh>div,.css-4lspwd,.css-1e6hvbc,.css-k32okj,.ant-table-tbody>tr.ant-table-placeholder:hover>td,.SettingsMain>div div:not(.StickerItem-Border):not(.SettingsMain-sideColumn):not(.UserHeader-VipBtn):not(.UserHeader-VipTip):not(.css-60n72z div),.CreatorSalt-community-story-wrapper,.css-guh6n2,.css-yqosku,.css-kt4t4n,.css-1j8bif6>div,.css-nffy12:hover,.css-1eltcns,.css-9kvgnm,.css-jd7qm7,.css-19vq0tc,.css-rzwcnm,.css-1akh9z6,.ListShortcut>div:not(.Question-mainColumn),.Chat,.ActionMenu,.Recommendations-Main,.KfeCollection-PcCollegeCard-root,.CreatorSalt-sideBar-wrapper,.ant-menu,.signQr-container,.signQr-rightContainer>div,.Login-options,.Input-wrapper>input,.SignFlowInput-errorMask,.Write-school-search-bar .CreatorSalt-management-search,.CreatorSalt-Content-Management-Index,.Topstory-container .TopstoryTabs>a::after,.ZVideo,.KfeCollection-CreateSaltCard,.CreatorSalt-personalInfo,.CreatorSalt-sideBar-item,.css-d1sc5t,.css-1gvsmgz,.css-u56wtg,.css-1hrberl,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-header,.ant-table-tbody>tr>td,.CreatorSalt-management-wrapper .CreatorSalt-management-search,.ant-table-thead .ant-table-cell,.QuestionWaiting-typesTopper,${appendClassStart(
      "App-root,PcContent-root,TopNavBar-root,CourseConsultation-corner,CourseConsultation-cornerButton,CornerButtonToTop-cornerButton,LearningRouteCard-pathContent,index-item,index-hoverCard,ShelfTopNav-root,ProductCard-root,NewOrderedLayout-root,Tabs-tabHeader,ButtonBar-root,WebPage-root,LearningPathWayCard-pathItem,VideoCourseList-title,Article-header,PcContent-coverFix,index-module,TopNavBar-module,PcContent-module,CourseRecord-module,Learned-module,Tab-module,PcContentBought-module,Media-module"
    )}`,
    cssBGTransparent: `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button,.ChatUserListItem .Chat-ActionMenuPopover-Button`,
    cssBG1Color: `.css-z0izby`,
    menuBeforeAfter: (color, size = "12px") => `background: radial-gradient(circle at top left, transparent ${size}, ${color} 0) top left,radial-gradient(circle at top right, transparent ${size}, ${color} 0) top right,radial-gradient(circle at bottom right, transparent ${size}, ${color} 0) bottom right,radial-gradient(circle at bottom left, transparent ${size}, ${color} 0) bottom left;background-size: 50% 50%;background-repeat: no-repeat;`
  };
  var myCustomStyle = {
    init: async function() {
      const { customizeCss = "" } = await myStorage.getConfig();
      dom('[name="textStyleCustom"]').value = customizeCss;
      this.change(customizeCss);
    },
    change: (innerCus) => fnAppendStyle("CTZ_STYLE_CUSTOM", innerCus)
  };
  var onUseThemeDark = async () => {
    dom("html").setAttribute("data-theme", await isDark() ? "dark" : "light");
  };
  var loadFindTheme = () => {
    onUseThemeDark();
    const elementHTML = dom("html");
    const muConfig = { attribute: true, attributeFilter: ["data-theme"] };
    if (!elementHTML) return;
    const muCallback = async function() {
      const themeName = elementHTML.getAttribute("data-theme");
      const dark = await isDark();
      if (themeName === "dark" && !dark || themeName === "light" && dark) {
        onUseThemeDark();
      }
    };
    const muObserver = new MutationObserver(muCallback);
    muObserver.observe(elementHTML, muConfig);
  };
  var isDark = async () => {
    const { theme = 2 /* 自动 */ } = await myStorage.getConfig();
    if (+theme === 2 /* 自动 */) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return +theme === 1 /* 深色 */;
  };
  var addBackgroundSetting = () => {
    const radioBackground = (name, value, background, color, label) => `<label><input class="${CLASS_INPUT_CLICK}" name="${name}" type="radio" value="${value}"/><div style="background: ${background};color: ${color}">${label}</div></label>`;
    const themeToRadio = (o, className, color) => Object.keys(o).map((key) => radioBackground(className, key, o[key].background, color, o[key].name)).join("");
    dom(".ctz-set-background").innerHTML = `<div id="CTZ_BACKGROUND">${THEMES.map((i) => radioBackground(INPUT_NAME_THEME, i.value, i.background, i.color, i.label)).join("")}</div><div class="ctz-commit">浅色颜色选择:</div><div id="CTZ_BACKGROUND_LIGHT">${themeToRadio(THEME_CONFIG_LIGHT, INPUT_NAME_ThEME_LIGHT, "#000")}</div><div class="ctz-commit">深色颜色选择:</div><div id="CTZ_BACKGROUND_DARK">${themeToRadio(THEME_CONFIG_DARK, INPUT_NAME_THEME_DARK, "#f7f9f9")}</div>`;
  };
  var myLock = {
    append: async function(e, name) {
      if (!e) return;
      const lock = this.lock.class;
      const unlock = this.unlock.class;
      const lockMask = this.lockMask.class;
      const classRemove = "ctz-move-this";
      const iLock = domC("i", { className: `${this.lock.name}`, innerHTML: "☑︎" });
      const iUnlock = domC("i", { className: `${this.unlock.name}`, innerHTML: "☒" });
      const dLockMask = domC("div", { className: this.lockMask.name });
      !e.querySelector(lock) && e.appendChild(iLock);
      !e.querySelector(unlock) && e.appendChild(iUnlock);
      !e.querySelector(lockMask) && e.appendChild(dLockMask);
      const pfConfig = await myStorage.getConfig();
      e.querySelector(lock).onclick = async () => {
        await myStorage.updateConfigItem(name + "Fixed", true);
        e.classList.remove(classRemove);
      };
      e.querySelector(unlock).onclick = async () => {
        await myStorage.updateConfigItem(name + "Fixed", false);
        e.classList.add(classRemove);
      };
      if (pfConfig[name + "Fixed"] === false) {
        e.classList.add(classRemove);
      }
    },
    remove: function(e) {
      if (!e) return;
      const nodeLock = e.querySelector(this.lock.class);
      const nodeUnlock = e.querySelector(this.unlock.class);
      const nodeLockMask = e.querySelector(this.lockMask.class);
      nodeLock && nodeLock.remove();
      nodeUnlock && nodeUnlock.remove();
      nodeLockMask && nodeLockMask.remove();
    },
    lock: { class: ".ctz-lock", name: "ctz-lock" },
    unlock: { class: ".ctz-unlock", name: "ctz-unlock" },
    lockMask: { class: ".ctz-lock-mask", name: "ctz-lock-mask" }
  };
  var myMove = {
    init: function(eventName, configName, name) {
      const e = dom(eventName);
      if (e) {
        this.clicks[configName] = e.click;
        e.onmousedown = async (ev) => {
          const pfConfig = await myStorage.getConfig();
          if (pfConfig[`${name}Fixed`]) return;
          const event = window.event || ev;
          const bodyW = document.body.offsetWidth;
          const windowW = window.innerWidth;
          const windowH = window.innerHeight;
          const eW = e.offsetWidth;
          const eH = e.offsetHeight;
          const eL = e.offsetLeft;
          const eT = e.offsetTop;
          const evX = event.clientX;
          const evY = event.clientY;
          const dx = evX - eL;
          const dy = evY - eT;
          const rx = eW + eL - evX;
          document.onmousemove = (ev2) => {
            const eventN = window.event || ev2;
            const evNX = eventN.clientX;
            let evenLeft = 0;
            let evenRight = 0;
            const isR = this.useR.find((i) => i === name);
            if (isR) {
              const right = bodyW - evNX - rx;
              evenRight = right <= 0 ? 0 : right >= bodyW - eW ? bodyW - eW : right;
              e.style.right = evenRight + "px";
            } else {
              const left = evNX - dx;
              evenLeft = left <= 0 ? 0 : left >= windowW - eW ? windowW - eW : left;
              e.style.left = evenLeft + "px";
            }
            const top = eventN.clientY - dy;
            const evenTop = top <= 0 ? 0 : top >= windowH - eH ? windowH - eH : top;
            e.style.top = evenTop + "px";
            this.isMove = true;
            this.timer[configName] && clearTimeout(this.timer[configName]);
            this.timer[configName] = setTimeout(async () => {
              clearTimeout(this.timer[configName]);
              await myStorage.updateConfigItem(configName, `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`);
            }, 500);
          };
          document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            e.onclick = (e2) => {
              if (this.isMove) {
                this.isMove = false;
                return e2.preventDefault && e2.preventDefault();
              } else {
                return this.clicks[configName];
              }
            };
          };
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            return false;
          }
        };
      }
    },
    destroy: function(eventName) {
      const e = dom(eventName);
      e && (e.onmousedown = null);
    },
    isMove: false,
    clicks: {},
    timer: {},
    useL: ["suspensionHomeTab", "suspensionFind", "suspensionSearch"],
    useR: ["suspensionUser"]
  };
  var CLASS_VIDEO_ONE = ".css-1h1xzpn";
  var CLASS_VIDEO_TWO = ".VideoAnswerPlayer-video";
  var NEED_LINK_CLASS = [CLASS_VIDEO_ONE, CLASS_VIDEO_TWO];
  var findDoms = (nodeFound, domNames) => {
    const doms = domNames.map((i) => nodeFound.querySelectorAll(i));
    for (let i = 0, len = doms.length; i < len; i++) {
      if (doms[i].length) {
        return doms[i];
      }
    }
    return doms[doms.length - 1];
  };
  var initVideoDownload = async (nodeFound) => {
    const { videoUseLink } = await myStorage.getConfig();
    const domVideos = findDoms(
      nodeFound,
      [".ZVideo-player>div", CLASS_VIDEO_ONE, CLASS_VIDEO_TWO].filter((i) => {
        return videoUseLink ? !NEED_LINK_CLASS.includes(i) : true;
      })
    );
    for (let i = 0, len = domVideos.length; i < len; i++) {
      const domVideoBox = domVideos[i];
      const nDomDownload = domC("i", { className: "ctz-video-download", innerHTML: "⤓" });
      const nDomLoading = domC("i", { className: "ctz-loading", innerHTML: "↻" });
      nDomDownload.onclick = () => {
        const srcVideo = domVideoBox.querySelector("video").src;
        if (srcVideo) {
          nDomDownload.style.display = "none";
          domVideoBox.appendChild(nDomLoading);
          videoDownload(srcVideo, `video${+/* @__PURE__ */ new Date()}`).then(() => {
            nDomDownload.style.display = "block";
            nDomLoading.remove();
          });
        }
      };
      const nodeDownload = domVideoBox.querySelector(".ctz-video-download");
      nodeDownload && nodeDownload.remove();
      domVideoBox.style.cssText += `position: relative;`;
      domVideoBox.appendChild(nDomDownload);
    }
  };
  var videoDownload = async (url, name) => {
    return fetch(url).then((res) => res.blob()).then((blob) => {
      const objectUrl = window.URL.createObjectURL(blob);
      const elementA = domC("a", {
        download: name,
        href: objectUrl
      });
      elementA.click();
      window.URL.revokeObjectURL(objectUrl);
      elementA.remove();
    });
  };
  var fixVideoAutoPlay = () => {
    var originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      if (!this.offsetHeight) {
        return;
      }
      return originalPlay.apply(this, arguments);
    };
  };
  var myVersion = {
    init: async function() {
      fnAppendStyle("CTZ_STYLE_VERSION", await this.content());
    },
    change: function() {
      this.initAfterLoad();
      this.init();
    },
    initAfterLoad: async function() {
      const pfConfig = await myStorage.getConfig();
      domById("CTZ_IMAGE_SIZE_CUSTOM").style.display = pfConfig.zoomImageType === "2" ? "block" : "none";
      domById("CTZ_IMAGE_HEIGHT_CUSTOM").style.display = pfConfig.zoomImageHeight === "1" ? "block" : "none";
      domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").style.display = pfConfig.zoomListVideoType === "2" ? "block" : "none";
    },
    content: async function() {
      const {
        commitModalSizeSameVersion,
        versionHome,
        versionAnswer,
        versionArticle,
        versionHomeIsPercent,
        versionHomePercent,
        versionAnswerIsPercent,
        versionAnswerPercent,
        versionArticleIsPercent,
        versionArticlePercent,
        zoomImageType,
        zoomImageHeight,
        zoomImageHeightSize,
        zoomImageSize,
        zoomListVideoSize,
        zoomListVideoType,
        fixedListItemMore,
        questionTitleTag,
        themeDark = 1 /* 深色护眼一 */,
        themeLight = 0 /* 默认 */,
        suspensionHomeTabPo,
        suspensionHomeTab,
        suspensionFindPo,
        suspensionUserPo,
        suspensionSearchPo,
        highlightListItem,
        linkShopping,
        fontSizeForList,
        fontSizeForAnswer,
        fontSizeForArticle,
        fontSizeForListTitle,
        fontSizeForAnswerTitle,
        fontSizeForArticleTitle,
        contentLineHeight,
        videoUseLink
      } = await myStorage.getConfig();
      const dark = await isDark();
      const versionSizeHome = !versionHomeIsPercent ? `${versionHome || "1000"}px` : `${versionHomePercent || "70"}vw`;
      const versionSizeAnswer = !versionAnswerIsPercent ? `${versionAnswer || "1000"}px` : `${versionAnswerPercent || "70"}vw`;
      const versionSizeArticle = !versionArticleIsPercent ? `${versionArticle || "1000"}px` : `${versionArticlePercent || "70"}vw`;
      const CLASS_MODAL = ".css-1aq8hf9";
      const xxxWidth = `.Topstory-mainColumn,.SearchMain{width: ${versionSizeHome}!important;}.Topstory-container,.css-knqde,.Search-container{width: fit-content!important;}.Question-main .Question-mainColumn,.QuestionHeader-main{flex: 1;}.Question-main .Question-sideColumn{margin-left: 12px;}.QuestionHeader .QuestionHeader-content{margin: 0 auto;padding: 0;max-width: initial!important;}.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content{width: ${versionSizeAnswer}!important;}.Question-main .List-item{border-bottom: 1px dashed #ddd;}.zhuanlan .AuthorInfo,.zhuanlan .css-1xy3kyp{max-width: initial;}.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div,.zhuanlan .css-1xy3kyp,.zhuanlan .css-1voxft1,.zhuanlan .css-9w3zhd{width: ${versionSizeArticle}!important;}.zhuanlan .Post-SideActions{right: ${!versionArticleIsPercent ? `calc(50vw - ${+(versionArticle || "1000") / 2 + 150}px)` : `calc(50vw - ${+(versionArticlePercent || "70") / 2}vw + 150px)`}}.Topstory-mainColumn,.SearchMain,.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content,.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div,${CLASS_MODAL},.Topstory-body ${CLASS_MODAL},.PostIndex-body ${CLASS_MODAL}{min-width: ${VERSION_MIN_WIDTH}px!important;}` + fnReturnStr(
        `.Topstory-body ${CLASS_MODAL}{width: ${versionSizeHome}!important;}.PostIndex-body ${CLASS_MODAL}{width: ${versionSizeArticle}!important;}` + fnReturnStr(`${CLASS_MODAL}{width: ${versionSizeAnswer}!important;}`, location.pathname.includes("question")) + commitModalSizeSameVersion
      );
      const xxxImage = `.GifPlayer.isPlaying img {cursor:pointer!important;}img.lazy,img.origin_image,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${(zoomImageHeight === "1" ? `max-height: ${zoomImageHeightSize}px!important;width: auto!important;` : "") || (zoomImageType === "2" ? `width: ${zoomImageSize}px!important;cursor: zoom-in!important;max-width: 100%!important;` : "")}}`;
      const xxxVideo = `.ZVideoItem>div:first-of-type{${fnReturnStr(`width: ${zoomListVideoSize}px!important;`, zoomListVideoType === "2")}}`;
      const xxxListMore = fnReturnStr(
        `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`,
        fixedListItemMore
      );
      const xxxTitleTag = fnReturnStr(
        `.AnswerItem .ContentItem-title::before{content:'问答';background:#ec7259}.TopstoryItem .PinItem::before{content:'想法';background:#9c27b0;margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff；}.PinItem>.ContentItem-title{margin-top:4px;}.ZvideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.TopstoryQuestionAskItem .ContentItem-title::before{content:'提问';background:#533b77}`,
        questionTitleTag
      );
      const xxxSusHomeTab = fnReturnStr(
        `.Topstory-container .TopstoryTabs{${suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}.Topstory-container .TopstoryTabs>a::after{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;border:1px solid #999999;color:#999999;background: ${dark ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background || "transparent"};}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff!important;border-color:#0066ff!important;}.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}.Topstory [aria-controls='Topstory-hot']::after{content:'热';}.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}.Topstory-tabs{border-color: transparent!important;}`,
        suspensionHomeTab
      );
      const xxxSusHeader = `.position-suspensionFind{${suspensionFindPo}}.position-suspensionUser{${suspensionUserPo}}.position-suspensionSearch{${suspensionSearchPo}}.position-suspensionFind .Tabs-link{border:1px solid #999999;color:#999999;background: ${dark ? THEME_CONFIG_DARK[themeDark].background : THEME_CONFIG_LIGHT[themeLight].background || "transparent"};}.position-suspensionFind .Tabs-link.is-active{color:#0066ff!important;border-color:#0066ff!important;}.position-suspensionUser .css-1m60na {display: none;}.position-suspensionUser .css-1n0eufo{margin-right: 0;}`;
      const xxxHighlight = highlightListItem ? `.List-item:focus,.TopstoryItem:focus,.HotItem:focus{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}` : `.List-item:focus,.Card:focus::before{box-shadow: none!important;}`;
      const cssShoppingLinkObj = {
        0: "",
        1: '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source,.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon,.RichText-MCNLinkCardContainer .BottomInfo,.CPSCommonCard-imageBox,.RedPacketCard-imageBox,.CPSCommonCard-tool,.CPSCommonCard-subtitle,.RedPacketCard-subtitle,.RedPacketCard-tool{display: none!important;}.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity,.RichText-MCNLinkCardContainer .GoodsRecommendCard,.CPSCommonCard,.RedPacketCard-info,.RedPacketCard{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main,.RedPacketCard,.CPSCommonCard{padding: 0!important;}.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}.MCNLinkCard-price{padding-left: 12px;}.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}.ecommerce-ad-commodity-box-main-second{width: auto!important;}.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span,.CPSCommonCard-title,.RedPacketCard-title{color: #fd8d55!important;justify-content: start!important;}.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before,.CPSCommonCard-title::before,.RedPacketCard-title::before{content: "购物链接："}.MCNLinkCard-title{color: #fd8d55!important;}',
        2: "a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box,.RichText-MCNLinkCardContainer{display: none!important;}"
      };
      const xxxShoppingLink = cssShoppingLinkObj[linkShopping || "0"];
      const xxxFontSize = `.Topstory-body .RichContent-inner,.Topstory-body .ctz-list-item-time,.Topstory-body .CommentContent,.SearchResult-Card .RichContent-inner,.SearchResult-Card .CommentContent,.HotItem-excerpt--multiLine{font-size: ${fontSizeForList}px!important;}.Question-main .RichContent-inner,.Question-main .ctz-list-item-time,.Question-main .CommentContent{font-size: ${fontSizeForAnswer}px}.zhuanlan .Post-RichTextContainer,.zhuanlan .ctz-article-create-time,.zhuanlan .CommentContent{font-size: ${fontSizeForArticle}px}.zhuanlan .Post-Main .Post-Title{font-size: ${fontSizeForArticleTitle}px;}.ContentItem-title,.HotItem-title{font-size: ${fontSizeForListTitle}px!important;}.QuestionHeader-title{font-size: ${fontSizeForAnswerTitle}px!important;}p {line-height: ${contentLineHeight || 24}px;}`;
      const xxxVideoLink = fnReturnStr(
        `${CLASS_VIDEO_ONE}>div,${CLASS_VIDEO_ONE}>i{display: none;}${CLASS_VIDEO_ONE}{padding: 0!important;height:24px!important;width: fit-content!important;}${CLASS_VIDEO_ONE}::before{content: '视频链接，点击跳转 >>';cursor:pointer;color: #1677ff}${CLASS_VIDEO_ONE}:hover::before{color: #b0b0b0}${CLASS_VIDEO_TWO}::before,${CLASS_VIDEO_TWO}>i{display: none;}`,
        videoUseLink
      );
      return xxxFontSize + xxxHighlight + xxxImage + xxxListMore + xxxShoppingLink + xxxShoppingLink + xxxSusHeader + xxxSusHomeTab + xxxTitleTag + xxxVideo + xxxVideoLink + xxxWidth;
    }
  };
  var suspensionPackUp = async (elements) => {
    const { themeLight = 0 /* 默认 */, themeDark = 1 /* 深色护眼一 */, suspensionPickupRight = 60 } = await myStorage.getConfig();
    for (let i = 0; i < elements.length; i++) {
      const even = elements[i];
      const evenPrev = i > 0 ? elements[i - 1] : null;
      const evenBottom = even.offsetTop + even.offsetHeight;
      const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0;
      const hST = dom("html").scrollTop;
      const evenButton = even.querySelector(".ContentItem-actions .ContentItem-rightButton");
      if (!evenButton) continue;
      const needStyle = evenBottom > hST + window.innerHeight && evenPrevBottom < hST;
      const dark = await isDark();
      evenButton.style.cssText = needStyle ? `visibility:visible!important;position: fixed!important;bottom: 60px;z-index:200;right: ${(document.body.offsetWidth - even.offsetWidth) / 2 + +suspensionPickupRight}px;box-shadow: 0 1px 3px rgb(18 18 18 / 10%);height: 40px!important;padding: 0 12px!important;background: ${dark ? THEME_CONFIG_DARK[themeDark].background2 : THEME_CONFIG_LIGHT[themeLight][+themeLight !== 0 /* 默认 */ ? "background2" : "background"]}!important;` : "";
    }
  };
  var changeSuspensionTab = async () => {
    const name = "suspensionHomeTab";
    const pfConfig = await myStorage.getConfig();
    cSuspensionStyle(name);
    const even = dom(".Topstory-container .TopstoryTabs");
    if (!even) return;
    pfConfig[name] ? myLock.append(even, name) : myLock.remove(even);
  };
  var cacheHeader = async () => {
    const headerEventNames = ["suspensionFind", "suspensionSearch", "suspensionUser"];
    const { getFindEventItem, setFindEventItem, setStorageConfigItem, getStorageConfigItem } = store;
    const pfConfig = await myStorage.getConfig();
    const eventHeader = getFindEventItem("header");
    if (!eventHeader.isFind) {
      eventHeader.fun && clearTimeout(eventHeader.fun);
      eventHeader.fun = setTimeout(() => {
        if (eventHeader.num < 100) {
          if (dom(".AppHeader-inner")) {
            eventHeader.isFind = true;
            setStorageConfigItem("headerDoms", {
              suspensionFind: {
                class: ".AppHeader-inner .AppHeader-Tabs",
                even: dom(".AppHeader-inner .AppHeader-Tabs"),
                index: 1
              },
              suspensionSearch: {
                class: ".AppHeader-inner .SearchBar",
                even: dom(".AppHeader-inner .SearchBar"),
                index: 2
              },
              suspensionUser: {
                class: ".AppHeader-inner .AppHeader-userInfo",
                even: dom(".AppHeader-inner .AppHeader-userInfo"),
                index: 3
              }
            });
          }
          eventHeader.num++;
          setFindEventItem("header", eventHeader);
          cacheHeader();
        }
      }, 100);
      return;
    }
    const classIcon = ".ctz-search-icon";
    const classPickup = ".ctz-search-pick-up";
    const classNameFocus = "focus";
    headerEventNames.forEach((name) => {
      const headerDoms = getStorageConfigItem("headerDoms");
      const { even } = headerDoms[name];
      if (pfConfig[name]) {
        if (name === "suspensionSearch") {
          !dom(classIcon) && even.appendChild(domC("i", { className: "ctz-search-icon", innerHTML: "⚲" }));
          !dom(classPickup) && even.appendChild(domC("i", { className: "ctz-search-pick-up", innerHTML: "⇤" }));
          if (dom(classIcon)) {
            dom(classIcon).onclick = () => even.classList.add(classNameFocus);
          }
          if (dom(classPickup)) {
            dom(classPickup).onclick = () => even.classList.remove(classNameFocus);
          }
        }
        myLock.append(even, name);
        even.classList.add(`position-${name}`);
        const nodeRoot = dom("#root");
        nodeRoot && nodeRoot.appendChild(even);
      } else {
        if (name === "suspensionSearch") {
          const nodeIcon = dom(classIcon);
          const nodePickup = dom(classPickup);
          nodeIcon && nodeIcon.remove();
          nodePickup && nodePickup.remove();
          even.classList.remove(classNameFocus);
        }
        myLock.remove(even);
        even.classList.remove(`position-${name}`);
        even.setAttribute("style", "");
        const nodeHeaderInner = dom(".AppHeader-inner");
        nodeHeaderInner && nodeHeaderInner.appendChild(even);
      }
      cSuspensionStyle(name);
    });
    myVersion.change();
  };
  var cSuspensionStyle = async (name) => {
    const cssObj = {
      suspensionHomeTab: ".Topstory-container .TopstoryTabs",
      suspensionFind: ".AppHeader-Tabs",
      suspensionSearch: ".SearchBar",
      suspensionUser: ".AppHeader-userInfo"
    };
    const nodeCTZName = dom(`.ctz-${name}`);
    const pfConfig = await myStorage.getConfig();
    nodeCTZName && (nodeCTZName.style.cssText = pfConfig[name] ? "display: inline-block;" : "display: none;");
    if (cssObj[name]) {
      pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
    }
  };
  var initData = () => {
    store.setStorageConfigItem("cacheTitle", document.title);
    echoData();
    changeICO();
    changeTitle();
    changeSuspensionTab();
    setTimeout(() => {
      cacheHeader();
    }, 300);
  };
  var initHistoryView = async () => {
    const { href, origin, pathname } = location;
    setTimeout(async () => {
      let name = "";
      const isQuestion = href.includes("www.zhihu.com/question/");
      isQuestion && dom('.QuestionPage [itemprop="name"]') && (name = dom('.QuestionPage [itemprop="name"]').content);
      href.includes("zhuanlan.zhihu.com/p/") && dom(".Post-Title") && (name = dom(".Post-Title").innerText);
      href.includes("www.zhihu.com/zvideo/") && dom(".ZVideo .ZVideo-title") && (name = dom(".ZVideo .ZVideo-title").innerText);
      if (!name) {
        initHistoryView();
        return;
      }
      let extra = "";
      const questionAnswerId = pathname.replace(/\/question\/\d+\/answer\//, "");
      if (isQuestion && questionAnswerId) {
        extra = ` ---- 回答: ${questionAnswerId}`;
      }
      const nA = `<a href="${origin + pathname}" target="_blank">${name + extra}</a>`;
      const { view } = await myStorage.getHistory();
      if (!view.includes(nA)) {
        view.unshift(nA);
        myStorage.updateHistoryItem("view", view);
      }
    }, 500);
  };
  var ID_BUTTON_SYNC_BLOCK = "CTZ-BUTTON-SYNC-BLOCK";
  var CLASS_REMOVE_BLOCK = "ctz-remove-block";
  var ID_BLOCK_LIST = "CTZ-BLOCK-LIST";
  var myBlack = {
    messageCancel: "取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。",
    init: async function() {
      const me = this;
      const nodeBlank = domById(ID_BLOCK_LIST);
      if (!nodeBlank) return;
      const { removeBlockUserContentList = [] } = await myStorage.getConfig();
      nodeBlank.innerHTML = removeBlockUserContentList.map((i) => this.createItem(i)).join("");
      nodeBlank.onclick = (event) => {
        const target = event.target;
        if (!target || !target.classList.contains(CLASS_REMOVE_BLOCK)) return;
        const item = target.parentElement;
        const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
        confirm(me.messageCancel) && me.serviceRemove(info);
      };
    },
    createItem: function(info) {
      return `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${this.createItemContent(info)}</div>`;
    },
    createItemContent: ({ id, name }) => {
      return `<a href="/people/${id}" target="_blank">${name}</a><i class="${CLASS_REMOVE_BLOCK}" style="margin-left:4px;cursor:pointer;">✗</i>`;
    },
    addButton: async function(event, objMy) {
      const me = this;
      const classBox = "ctz-block-box";
      const nodeBlockBox = event.querySelector(`.${classBox}`);
      if (nodeBlockBox) return;
      const nodeUser = event.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
      if (!nodeUser || !nodeUser.offsetHeight) return;
      const userUrl = nodeUser.querySelector('meta[itemprop="url"]').content;
      const userName = nodeUser.querySelector('meta[itemprop="name"]').content;
      const nodeAnswerItem = event.querySelector(".AnswerItem");
      const mo = nodeAnswerItem ? nodeAnswerItem.getAttribute("data-za-extra-module") || "{}" : "{}";
      if (!JSON.parse(mo).card) return;
      const aContent = JSON.parse(mo).card.content;
      const userId = aContent.author_member_hash_id || "";
      if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, "")) return;
      const { removeBlockUserContentList = [] } = await myStorage.getConfig();
      const isAlreadyBlack = removeBlockUserContentList.findIndex((i) => i.id === userId) >= 0;
      const message2 = `是否要屏蔽${userName}？
屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。
如果开启了「不再显示已屏蔽用户发布的内容」那么也不会看到对方发布的回答`;
      const classBlack = "ctz-black";
      const classBlackRemove = "ctz-black-remove";
      const classBlackFilter = "ctz-black-filter";
      const classJustFilter = "ctz-just-filter";
      const createClass = (value) => `${value} ctz-button ctz-button-small ctz-button-transparent`;
      const innerHTML = isAlreadyBlack ? `<button class="${createClass(classBlackRemove)}">解除屏蔽</button>` + fnReturnStr(`<button class="${createClass(classJustFilter)}">隐藏该回答</button>`, !!objMy) : `<button class="${createClass(classBlack)}">屏蔽用户</button>` + fnReturnStr(`<button class="${createClass(classBlackFilter)}">屏蔽用户并隐藏该回答</button>`, !!objMy);
      const nodeBox = domC("div", { className: classBox, innerHTML });
      nodeBox.onclick = function(ev) {
        const target = ev.target;
        const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
        const urlToken = matched ? matched[0] : "";
        if (target.classList.contains(classBlack)) {
          if (!confirm(message2)) return;
          me.serviceAdd(urlToken, userName, userId);
          fnDomReplace(this.querySelector(`.${classBlackFilter}`), { className: createClass(classJustFilter), innerText: "隐藏该回答" });
          fnDomReplace(target, { className: createClass(classBlackRemove), innerText: "解除屏蔽" });
          return;
        }
        if (target.classList.contains(classBlackRemove)) {
          if (!confirm(me.messageCancel)) return;
          me.serviceRemove({ urlToken, id: userId, name: userName });
          fnDomReplace(target, { className: createClass(classBlack), innerText: "屏蔽用户" });
          fnDomReplace(this.querySelector(`.${classJustFilter}`), {
            className: createClass(classBlackFilter),
            innerText: "屏蔽用户并隐藏该回答"
          });
          return;
        }
        if (target.classList.contains(classBlackFilter) || target.classList.contains(classJustFilter)) {
          if (target.classList.contains(classBlackFilter)) {
            if (!confirm(message2)) return;
            me.serviceAdd(urlToken, userName, userId);
          }
          event.style.display = "none";
          if (objMy) {
            objMy.index = objMy.index - 1 > 0 ? objMy.index - 1 : 0;
          }
          return;
        }
      };
      nodeUser.appendChild(nodeBox);
    },
    addBlackItem: async function(info) {
      const pfConfig = await myStorage.getConfig();
      const nL = pfConfig.removeBlockUserContentList || [];
      nL.push(info);
      myStorage.updateConfigItem("removeBlockUserContentList", nL);
      const nodeBlackItem = domC("div", { className: `ctz-black-item ctz-black-id-${info.id}`, innerHTML: this.createItemContent(info) });
      nodeBlackItem.dataset.info = JSON.stringify(info);
      domById(ID_BLOCK_LIST).appendChild(nodeBlackItem);
    },
    serviceAdd: function(urlToken, userName, userId) {
      const me = this;
      const headers = this.getHeaders();
      fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
        method: "POST",
        headers: new Headers({
          ...headers,
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0] || ""
        }),
        credentials: "include"
      }).then(() => {
        me.addBlackItem({ id: userId, name: userName, userType: "people", urlToken });
      });
    },
    serviceRemove: function(info) {
      const { urlToken, id } = info;
      const headers = this.getHeaders();
      fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
        method: "DELETE",
        headers: new Headers({
          ...headers,
          "x-xsrftoken": document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0] || ""
        }),
        credentials: "include"
      }).then(async () => {
        const pfConfig = await myStorage.getConfig();
        const nL = pfConfig.removeBlockUserContentList || [];
        const itemIndex = nL.findIndex((i) => i.id === info.id);
        if (itemIndex >= 0) {
          nL.splice(itemIndex, 1);
          const removeItem = dom(`.ctz-black-id-${id}`);
          removeItem && removeItem.remove();
          myStorage.updateConfigItem("removeBlockUserContentList", nL);
        }
      });
    },
    sync: function(offset = 0, l = []) {
      const nodeList = domById(ID_BLOCK_LIST);
      !l.length && nodeList && (nodeList.innerHTML = "");
      fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
      const limit = 20;
      const headers = this.getHeaders();
      fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
        method: "GET",
        headers: new Headers(headers),
        credentials: "include"
      }).then((response) => response.json()).then(({ data, paging }) => {
        data.forEach(({ id, name, user_type, url_token }) => {
          l.push({ id, name, userType: user_type, urlToken: url_token });
        });
        if (!paging.is_end) {
          this.sync(offset + limit, l);
        } else {
          myStorage.updateConfigItem("removeBlockUserContentList", l);
          myBlack.init();
          fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: "同步黑名单", disabled: false });
        }
      });
    },
    getHeaders: () => store.getStorageConfigItem("fetchHeaders")
  };
  var initFetchInterceptStatus = async () => {
    const { fetchInterceptStatus } = await myStorage.getConfig();
    changeHTML(!!fetchInterceptStatus);
    domById("CTZ_CHANGE_FETCH").onclick = function() {
      if (confirm(
        fetchInterceptStatus ? "关闭接口拦截，确认后将刷新页面。\n「黑名单设置；外置不感兴趣；快速屏蔽用户；回答、文章和收藏夹导出」功能将不可用。" : "开启接口拦截，确认后将刷新页面。\n如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。"
      )) {
        myStorage.updateConfigItem("fetchInterceptStatus", !fetchInterceptStatus);
        window.location.reload();
      }
    };
  };
  var changeHTML = (status) => {
    domById("CTZ_FETCH_STATUS").innerHTML = status ? '<b style="color: green;">已开启接口拦截</b>，如遇到知乎页面无法显示数据的情况请尝试关闭接口拦截' : '<b style="color: red;">已关闭接口拦截</b>，部分功能不可用';
    domById("CTZ_CHANGE_FETCH").innerHTML = status ? "关闭接口拦截" : "开启接口拦截";
    if (!status) {
      domA(".ctz-fetch-intercept").forEach((item) => {
        item.classList.add("ctz-fetch-intercept-close");
        item.querySelectorAll("input").forEach((it) => {
          it.disabled = true;
        });
        item.querySelectorAll("button").forEach((it) => {
          it.disabled = true;
        });
      });
    }
  };
  var myMenu = {
    init: function() {
      const { hash } = location;
      const nodeMenuTop = dom(".ctz-menu-top");
      if (!nodeMenuTop) return;
      const chooseId = [...nodeMenuTop.children].map((i) => i.hash).find((i) => i === hash || hash.replace(i, "") !== hash);
      if (chooseId) {
        this.click({ target: dom(`a[href="${chooseId}"]`) });
        return;
      }
      this.click({ target: dom(`a[href="${HEADER[0].href}"]`) });
    },
    click: function({ target }) {
      const targetForA = target.tagName === "A" ? target : target.parentElement;
      if (!(targetForA.hash && targetForA.tagName === "A")) return;
      const isThis = targetForA.hash.replace(/#/, "");
      if (!isThis) return;
      const nodesA = domA(".ctz-menu-top>a");
      for (let i = 0, len = nodesA.length; i < len; i++) {
        const itemA = nodesA[i];
        itemA.classList.remove("target");
      }
      targetForA.classList.add("target");
      const nodesDiv = domA(".ctz-content>div");
      for (let i = 0, len = nodesDiv.length; i < len; i++) {
        const item = nodesDiv[i];
        item.style.display = isThis === item.id ? "flex" : "none";
      }
    }
  };
  var INNER_HTML = `<div id="CTZ_DIALOG_MAIN" style="display: none"><div class="ctz-header"><span>修改器</span><span class="ctz-version"></span><div class="ctz-top-operate"><span id="CTZ_FETCH_STATUS">状态获取中...</span><button class="ctz-button" id="CTZ_CHANGE_FETCH" size="small">切换接口拦截</button></div><button id="CTZ_CLOSE_DIALOG">✗</button></div><div class="ctz-center"><div class="ctz-menu-top"></div><div class="ctz-content"><div id="CTZ_BASIS" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BASIS_DEFAULT">基本设置</a><a href="#CTZ_BASIS_HIGH_PERFORMANCE">高性能</a><a href="#CTZ_BASIS_SHOW_CONTENT">显示修改</a><a href="#CTZ_BASIS_SIZE">页面尺寸</a><a href="#CTZ_BASIS_FLOAT">悬浮模块</a><a href="#CTZ_BASIS_COLOR">颜色设置</a><a href="#CTZ_BASIS_CONFIG">配置操作</a></div><div class="ctz-content-right"><div id="CTZ_BASIS_DEFAULT"><div class="ctz-set-title">基本设置</div><div class="ctz-set-content"><label class="ctz-flex-wrap"><span class="ctz-label">不显示修改器唤醒图标 ⚙︎</span><input class="ctz-i" name="hiddenOpenButton" type="checkbox" value="on" /></label><label class="ctz-flex-wrap"><span class="ctz-label">快捷键唤起编辑器<span class="key-shadow">></span>(<span class="key-shadow">Shift</span>+<span class="key-shadow">.</span>)</span><input class="ctz-i" name="hotKey" type="checkbox" value="on" /></label><div><div class="ctz-label">修改浏览器标签</div><div class="ctz-flex-wrap"><input type="text" name="globalTitle" style="width: 250px" /><button class="ctz-button" name="buttonConfirmTitle" style="margin: 0 4px">确认</button><button class="ctz-button" name="buttonResetTitle">还原</button></div></div><label class="ctz-flex-wrap"><span class="ctz-label">去除浏览器标签上<b>XX条私信/未读消息</b>的提示</span><input class="ctz-i" name="globalTitleRemoveMessage" type="checkbox" value="on" /></label><div><div class="ctz-label">修改网页标题图片（图标可能会因为网络问题丢失）</div><div class="ctz-flex-wrap" id="CTZ_TITLE_ICO"></div></div></div></div><div id="CTZ_BASIS_HIGH_PERFORMANCE"><div class="ctz-set-title">高性能<span style="color: red">修改后刷新页面生效</span></div><div class="ctz-set-content"></div></div><div id="CTZ_BASIS_SHOW_CONTENT"><div class="ctz-set-title">显示修改<span style="color: red">修改后刷新页面生效</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><span class="ctz-label">购物链接显示设置</span><label><input class="ctz-i" name="linkShopping" type="radio" value="0" />默认</label><label><input class="ctz-i" name="linkShopping" type="radio" value="1" />仅文字</label><label><input class="ctz-i" name="linkShopping" type="radio" value="2" />隐藏</label></div><div class="ctz-flex-wrap"><span class="ctz-label">回答内容展开/收起</span><label><input class="ctz-i" type="radio" name="answerOpen" value="" />知乎默认</label><label><input class="ctz-i" type="radio" name="answerOpen" value="on" />自动展开所有回答</label><label><input class="ctz-i" type="radio" name="answerOpen" value="off" />默认收起所有长回答</label></div></div></div><div id="CTZ_BASIS_SIZE"><div class="ctz-set-title">页面尺寸</div><div class="ctz-set-content"><div id="CTZ_VERSION_RANGE_ZHIHU"></div><label class="ctz-flex-wrap"><span class="ctz-label">评论弹窗匹配页面宽度</span><input class="ctz-i" name="commitModalSizeSameVersion" type="checkbox" value="on" /></label><div id="CTZ_FONT_SIZE_IN_ZHIHU"></div><div><div class="ctz-flex-wrap"><div class="ctz-label">回答和文章图片尺寸</div><label><input class="ctz-i" name="zoomImageType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="1" />原图</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="2" />自定义</label></div><div id="CTZ_IMAGE_SIZE_CUSTOM" style="display: none"></div></div><div><div class="ctz-flex-wrap"><div class="ctz-label">图片最大高度限制</div><label><input class="ctz-i" name="zoomImageHeight" type="radio" value="0" />不限制</label><label><input class="ctz-i" name="zoomImageHeight" type="radio" value="1" />限制</label><span class="ctz-commit">限制图片最大高度后，图片将按照高度等比例缩放</span></div><div id="CTZ_IMAGE_HEIGHT_CUSTOM" style="display: none"></div></div><label class="ctz-flex-wrap"><span class="ctz-label">使用弹窗打开动图</span><input class="ctz-i" name="showGIFinDialog" type="checkbox" value="on" /></label><div><div class="ctz-flex-wrap"><div class="ctz-label">列表视频回答的视频内容尺寸</div><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="2" />自定义</label></div><div id="CTZ_LIST_VIDEO_SIZE_CUSTOM"></div></div></div></div><div id="CTZ_BASIS_FLOAT"><div class="ctz-set-title">悬浮模块</div><div class="ctz-set-content"><div class="ctz-flex-wrap"><label><span class="ctz-label">回答内容「收起」按钮悬浮</span><input class="ctz-i" name="suspensionPickUp" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap" style="align-items: center"><span>悬浮收起按钮位置，数字越大离右侧越远：</span><input name="suspensionPickupRight" type="number" class="ctz-i-change" /></div><div><div class="ctz-label">信息模块悬浮</div><div class="ctz-commit">拖动悬浮模块定位位置，鼠标放置显示点击 ☒ 按钮即可拖动</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="suspensionHomeTab" type="checkbox" value="on" />首页列表切换</label><label><input class="ctz-i" name="suspensionFind" type="checkbox" value="on" />顶部发现模块</label><label><input class="ctz-i" name="suspensionUser" type="checkbox" value="on" />个人中心模块</label><label><input class="ctz-i" name="suspensionSearch" type="checkbox" value="on" />搜索栏模块</label></div></div></div></div><div id="CTZ_BASIS_COLOR"><div class="ctz-set-title">颜色设置</div><div class="ctz-set-content"><div class="ctz-set-background"></div><div class="ctz-set-color ctz-flex-wrap"><div class="ctz-label">修改文字颜色（例: #f7f9f9）</div><input type="text" class="ctz-i" name="colorText1" style="width: 200px" /></div></div></div><div id="CTZ_BASIS_CONFIG"><div class="ctz-set-title">配置操作</div><div class="ctz-set-content"><div class="ctz-flex-wrap ctz-config-buttons"><button class="ctz-button" name="useSimple">启用极简模式</button><button class="ctz-button" name="configReset">恢复默认配置</button><button class="ctz-button" name="configExport">配置导出</button><!-- <button class="ctz-button" name="configRemove">清空配置</button> --><div id="IMPORT_BY_FILE"><input type="file" class="ctz-input-config-import" id="readTxt" accept=".txt" /><button class="ctz-button" name="configImport">配置导入</button></div></div><div class="ctz-customize-css"><div class="ctz-label">自定义样式</div><div style="display: flex"><textarea name="textStyleCustom" placeholder="格式为CSS"></textarea><button class="ctz-button" name="styleCustom">确 定</button></div></div></div></div></div></div><div id="CTZ_FILTER" style="display: none"><div class="ctz-content-left"><a href="#CTZ_FILTER_COMMEN">通用内容屏蔽</a><a href="#CTZ_FILTER_LIST">列表内容屏蔽</a><a href="#CTZ_FILTER_ANSWER">回答内容屏蔽</a></div><div class="ctz-content-right"><h5 class="ctz-alert-red">此部分更改后请重新刷新页面</h5><div id="CTZ_FILTER_COMMEN" class="ctz-filter-block"><div class="ctz-set-title">通用内容屏蔽<span>此部分设置在推荐列表和回答中均可生效</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽选自盐选专栏的内容</span><input class="ctz-i" name="removeFromYanxuan" type="checkbox" value="on" /></label></div></div></div><div id="CTZ_FILTER_LIST" class="ctz-filter-block"><div class="ctz-set-title">列表内容屏蔽<span>此部分设置只在首页列表生效</span></div><div class="ctz-set-content"><div><label style="display: flex; align-items: center"><span class="ctz-label">屏蔽顶部活动推广</span><input class="ctz-i" name="removeTopAD" type="checkbox" value="on" /></label></div><div class="ctz-filter-follow"><div class="ctz-label">关注列表关注人操作屏蔽</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFollowVoteAnswer" type="checkbox" value="on" />赞同回答</label><label><input class="ctz-i" name="removeFollowVoteArticle" type="checkbox" value="on" />赞同文章</label><label><input class="ctz-i" name="removeFollowFQuestion" type="checkbox" value="on" />关注问题</label></div></div><div class="ctz-filter-me"><label style="display: flex; align-items: center"><span class="ctz-label">关注列表屏蔽自己的操作</span><input class="ctz-i" name="removeMyOperateAtFollow" type="checkbox" value="on" /></label></div><div class="ctz-filter-type"><div class="ctz-label">列表类别屏蔽</div><div class="ctz-commit" style="line-height: 22px">勾选后「关注、推荐、搜索」将屏蔽所勾选的类别内容</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeItemQuestionAsk" type="checkbox" value="on" />邀请回答</label><label><input class="ctz-i" name="removeItemAboutAD" type="checkbox" value="on" />商业推广</label><label><input class="ctz-i" name="removeItemAboutArticle" type="checkbox" value="on" />文章</label><label><input class="ctz-i" name="removeItemAboutVideo" type="checkbox" value="on" />视频</label><label><input class="ctz-i" name="removeItemAboutPin" type="checkbox" value="on" />想法</label></div></div><div class="ctz-filter-list-vote"><label style="display: flex; align-items: center"><span class="ctz-label">列表低赞内容屏蔽</span><input class="ctz-i" name="removeLessVote" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">勾选后「关注、推荐、搜索」列表屏蔽点赞量少于<input name="lessVoteNumber" class="ctz-i-change" type="number" style="width: 100px; margin: 0 4px" />的内容</div></div></div></div><div id="CTZ_FILTER_ANSWER" class="ctz-filter-block"><div class="ctz-set-title">回答内容屏蔽<span>此部分设置只在回答页面生效</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽「匿名用户」回答</span><input class="ctz-i" name="removeAnonymousAnswer" type="checkbox" value="on" /></label></div><div class="ctz-filter-defail-tag"><div class="ctz-label">屏蔽带有以下标签的回答</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeUnrealAnswer" type="checkbox" value="on" />带有虚构创作</label><label><input class="ctz-i" name="removeFromEBook" type="checkbox" value="on" />选自电子书</label></div></div><div class="ctz-filter-detail-vote"><label style="display: flex; align-items: center"><span class="ctz-label">回答内容低赞回答屏蔽</span><input class="ctz-i" name="removeLessVoteDetail" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">勾选后问题详情页将屏蔽点赞量少于<input name="lessVoteNumberDetail" class="ctz-i-change" type="number" style="width: 100px; margin: 0 4px" />的回答</div></div></div></div></div></div><div id="CTZ_HIDDEN" style="display: none"></div><div id="CTZ_BLOCK_WORD" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BLOCK_WORD_LIST">标题屏蔽词</a><a href="#CTZ_BLOCK_WORD_CONTENT">内容屏蔽词</a></div><div class="ctz-content-right"><div id="CTZ_BLOCK_WORD_LIST"><div class="ctz-set-title">标题屏蔽词<span>匹配位置：列表标题</span></div><input name="inputBlockedWord" type="text" placeholder="输入后回车或失去焦点（不区分大小写）" class="input-block-words" /><span class="ctz-commit">点击屏蔽词即可删除</span><div class="ctz-block-words-content"></div></div><div id="CTZ_BLOCK_WORD_CONTENT"><div class="ctz-set-title">内容屏蔽词<span>匹配位置：列表、回答页内容</span></div><input name="inputBlockedWordAnswer" type="text" placeholder="输入后回车或失去焦点（不区分大小写）" class="input-block-words" /><span class="ctz-commit">点击屏蔽词即可删除</span><div class="ctz-block-words-content"></div></div></div></div><div id="CTZ_BLACKLIST" style="display: none"><div class="ctz-content-left"><a href="#CTZ_BASIS_BLOCK">黑名单设置</a></div><div class="ctz-content-right ctz-fetch-intercept"><h5 class="ctz-alert-red ctz-need-fetch">接口拦截已关闭，此部分功能无法使用</h5><div id="CTZ_BASIS_BLOCK"><div class="ctz-set-title">黑名单设置</div><div class="ctz-set-content"><button id="CTZ-BUTTON-SYNC-BLOCK" name="syncBlack" class="ctz-button">同步黑名单</button><label class="ctz-flex-wrap"><span class="ctz-label">回答列表用户名后显示「屏蔽用户」按钮</span><input class="ctz-i" name="showBlockUser" type="checkbox" value="on" /></label><label class="ctz-flex-wrap"><span class="ctz-label">屏蔽黑名单用户发布的内容</span><input class="ctz-i" name="removeBlockUserContent" type="checkbox" value="on" /></label><div><div class="ctz-label">黑名单列表</div><div id="CTZ-BLOCK-LIST"></div></div></div></div></div></div><div id="CTZ_HISTORY" style="display: none"><div class="ctz-content-left"><a href="#CTZ_HISTORY_LIST">推荐列表缓存</a><a href="#CTZ_HISTORY_VIEW">浏览历史记录</a></div><div class="ctz-content-right"><div id="CTZ_HISTORY_LIST"><div class="ctz-set-title">推荐列表缓存<span>最多缓存500条，包含已过滤项</span></div><button class="ctz-button" name="button_history_clear" data-id="list">清空推荐列表缓存</button><div class="ctz-set-content"></div></div><div id="CTZ_HISTORY_VIEW"><div class="ctz-set-title">浏览历史记录<span>最多缓存500条</span></div><button class="ctz-button" name="button_history_clear" data-id="view">清空浏览历史记录</button><div class="ctz-set-content"></div></div></div></div><div id="CTZ_DEFAULT" style="display: none"><div class="ctz-content-left"><a href="#CTZ_DEFAULT_CONTENT">默认功能</a></div><div class="ctz-content-right"><div id="CTZ_DEFAULT_CONTENT"><div class="ctz-set-title">默认功能<span>此部分功能为编辑器默认功能，不需要额外开启</span></div><div class="ctz-set-content"><div id="CTZ_DEFAULT_SELF"></div><div class="ctz-zhihu-self"><div class="ctz-zhihu-key">更加方便的浏览，按<span class="key-shadow">?</span>（<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>） 查看所有快捷键。<a href="/settings/preference" target="_blank">前往开启快捷键功能</a></div></div></div></div></div></div></div></div><div class="ctz-footer"><div class="ctz-footer-left"></div><div class="ctz-footer-right"></div></div></div><div id="CTZ_OPEN_BUTTON">⚙︎</div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_IMAGE"><div><img src="" /></div></div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_VIDEO"><div><video src="" autoplay loop></video></div></div><iframe class="ctz-pdf-box-content" style="display: none"></iframe><div id="CTZ_MESSAGE_BOX"></div>`;
  var INNER_CSS = `.hover-style{cursor:pointer}.hover-style:hover{color:#1677ff !important}.ctz-button{outline:none;position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;border:1px solid transparent;cursor:pointer;transition:all .3s;user-select:none;touch-action:manipulation;line-height:1.5;font-size:14px;height:32px;padding:4px 15px;border-radius:6px;background-color:#ffffff;border-color:#d9d9d9;color:rgba(0,0,0,0.88);box-shadow:0 2px 0 rgba(0,0,0,0.02)}.ctz-button:hover{color:#1677ff;border-color:#1677ff}.ctz-button:active{background:rgba(0,0,0,0.08) !important}.ctz-button[size='small'],.ctz-button.ctz-button-small{padding:2px 6px;font-size:12px;height:24px}.ctz-button.ctz-button-transparent{background:transparent}.ctz-button-red{color:#e55353 !important;border:1px solid #e55353 !important}.ctz-button-red:hover{color:#ec7259 !important;border:1px solid #ec7259 !important}.ctz-button:disabled{border-color:#d0d0d0;background-color:rgba(0,0,0,0.08);color:#b0b0b0;cursor:not-allowed}.Profile-mainColumn,.Collections-mainColumn{flex:1}#root .css-1liaddi{margin-right:0}.ContentItem-title div{display:inline}.css-1acwmmj:empty{display:none !important}.css-hr0k1l::after{content:'点击键盘左、右按键切换图片';position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff}#CTZ_OPEN_BUTTON{position:fixed;left:0;top:100px;font-size:48px;color:rgba(0,0,0,0.8);height:48px;line-height:42px;text-align:center;width:48px;border-radius:0 12px 12px 0;background:#f5f5f5;box-shadow:0 0 8px #d0d4d6,0 0 8px #e6eaec;cursor:pointer;user-select:none;transform:translate(-30px);transition:transform .5s;z-index:200}#CTZ_OPEN_BUTTON:hover{transform:translate(0)}#CTZ_DIALOG_MAIN{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);width:800px;height:600px;max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 6px 16px 0 rgba(0,0,0,0.08),0 3px 6px -4px rgba(0,0,0,0.12),0 9px 28px 8px rgba(0,0,0,0.05);background:#f5f5f5;z-index:201;flex-direction:column;font-size:14px;padding:16px;transition:all .2s}#CTZ_DIALOG_MAIN input[type='text'],#CTZ_DIALOG_MAIN input[type='number']{box-sizing:border-box;margin:0;padding:4px 11px;font-size:14px;line-height:1.5;list-style:none;position:relative;display:inline-block;min-width:0;border-width:1px;border-style:solid;border-color:#d9d9d9;border-radius:6px;transition:all .2s}#CTZ_DIALOG_MAIN textarea{box-sizing:border-box;margin:0;padding:4px 11px;font-size:14px;line-height:1.5;list-style:none;position:relative;display:inline-block;min-width:0;border-width:1px;border-style:solid;border-color:#d9d9d9;border-radius:6px;transition:all .2s}#CTZ_DIALOG_MAIN label{cursor:pointer;transition:all .2s}#CTZ_DIALOG_MAIN label:hover{color:#1677ff !important}#CTZ_DIALOG_MAIN a{transition:all .2s;text-decoration:none;color:inherit}.ctz-center{flex:1;flex-direction:column;display:flex;overflow:hidden}.ctz-header{font-size:16px;margin-bottom:12px;display:flex;align-items:center}.ctz-top-operate{flex:1;padding:0 8px;font-size:12px}#CTZ_FETCH_STATUS{padding-right:8px;font-weight:bold}.ctz-version{padding-left:8px;font-size:12px}#CTZ_CLOSE_DIALOG{color:rgba(0,0,0,0.45);font-weight:600;line-height:18px;background:transparent;border-radius:6px;width:32px;height:32px;transition:all .2s;border:0}#CTZ_CLOSE_DIALOG i{font-size:8px}#CTZ_CLOSE_DIALOG:hover{background-color:#fff;text-decoration:none}.ctz-menu-top{height:36px;display:flex}.ctz-menu-top>a{border-radius:12px 12px 0 0;flex:1;text-align:center;cursor:pointer;transition:initial !important;position:relative;display:flex;align-items:center;justify-content:center}.ctz-menu-top>a span{border-radius:8px;transition:all .3s;margin:0 6px;flex:1;box-sizing:border-box;align-items:center;line-height:26px}.ctz-menu-top>a:hover span{background:#fff}.ctz-menu-top>a.target{background:#fff}.ctz-menu-top>a.target::after,.ctz-menu-top>a.target::before{position:absolute;bottom:-12px;content:' ';background:radial-gradient(circle at top left, transparent 12px, #fff 0) top left,radial-gradient(circle at top right, transparent 12px, #fff 0) top right,radial-gradient(circle at bottom right, transparent 12px, #fff 0) bottom right,radial-gradient(circle at bottom left, transparent 12px, #fff 0) bottom left;background-size:50% 50%;background-repeat:no-repeat;width:24px;height:24px}.ctz-menu-top>a.target::before{left:-12px;z-index:-1}.ctz-menu-top>a.target::after{right:-12px;z-index:-1}.ctz-content{flex:1;display:flex;overflow:hidden;background:#fff;border-radius:12px;padding:8px 0}.ctz-content>div{width:100%}.ctz-content ::-webkit-scrollbar{width:8px;height:8px}.ctz-content ::-webkit-scrollbar-track{border-radius:0}.ctz-content ::-webkit-scrollbar-thumb{background:#bbb;transition:all .2s;border-radius:8px}.ctz-content ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.ctz-content-left{width:130px;border-right:1px solid #e0e0e0}.ctz-content-left a{transition:all .2s;margin:2px 5px;height:40px;line-height:40px;display:block;font-size:14px;border-radius:12px;padding-left:24px}.ctz-content-left a:hover{background:#f5f5f5}.ctz-content-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 8px}.ctz-content-right>div:nth-of-type(2n){padding:0 8px;margin:0 -8px;box-shadow:#999 0 0 5px inset;border-radius:0 12px 12px 0}.ctz-set-title{font-weight:bold;height:36px;line-height:36px;font-size:16px;overflow:hidden;vertical-align:middle}.ctz-set-title>span{vertical-align:middle;display:inline-block;font-size:12px;color:#999;padding-left:4px}.ctz-set-title>span b{color:#e55353}.ctz-set-content:not(.ctz-flex-wrap)>div,.ctz-set-content:not(.ctz-flex-wrap)>label{padding-bottom:8px;margin-bottom:8px;border-bottom:1px dashed #ddd}.ctz-set-content:not(.ctz-flex-wrap)>div:last-child,.ctz-set-content:not(.ctz-flex-wrap)>label:last-child{border-bottom:0}.ctz-footer{display:flex;align-items:end;font-size:14px;margin-top:12px}.ctz-footer a{margin-right:16px;cursor:pointer}.ctz-footer a:hover{color:#1677ff !important}.ctz-footer-left{flex:1}.ctz-dark{display:flex;height:28px;align-items:center}.ctz-commit{font-size:12px;color:#999}.ctz-commit b{color:#e55353}.ctz-alert-red{text-align:center;font-size:14px;color:#e55353;height:24px;line-height:24px;background-color:#fff2f0;border:1px solid #ffccc7;border-radius:12px;margin:0;font-weight:400}.ctz-label{font-size:14px;line-height:24px}.ctz-label::after{content:'：'}#CTZ_BACKGROUND,#CTZ_BACKGROUND_LIGHT,#CTZ_BACKGROUND_DARK{display:grid;grid-template-columns:30% 30% 30%;gap:8px}#CTZ_BACKGROUND>label,#CTZ_BACKGROUND_LIGHT>label,#CTZ_BACKGROUND_DARK>label{position:relative}#CTZ_BACKGROUND>label input,#CTZ_BACKGROUND_LIGHT>label input,#CTZ_BACKGROUND_DARK>label input{position:absolute;visibility:hidden}#CTZ_BACKGROUND>label input:checked+div,#CTZ_BACKGROUND_LIGHT>label input:checked+div,#CTZ_BACKGROUND_DARK>label input:checked+div{border:4px solid #1677ff;margin:0 !important}#CTZ_BACKGROUND>label div,#CTZ_BACKGROUND_LIGHT>label div,#CTZ_BACKGROUND_DARK>label div{font-size:14px;border-radius:12px;line-height:50px;padding-left:30px;margin:4px}#CTZ_BACKGROUND_LIGHT{color:#000}.ctz-set-background .ctz-commit{line-height:24px;font-size:14px}#CTZ_BASIS_CONFIG .ctz-config-buttons{padding:0 0 8px}#CTZ_BASIS_CONFIG .ctz-config-buttons button{margin:8px 8px 0 0}#CTZ_BASIS_CONFIG textarea{margin-right:8px;flex:1}#CTZ_BLOCK_WORD .ctz-content-right>div{padding-bottom:12px}#CTZ_BLOCK_WORD input{height:24px;width:300px;margin:4px 0;width:100%}.ctz-block-words-content{display:flex;flex-wrap:wrap;cursor:default}.ctz-block-words-content>span{padding:2px 8px;border-radius:4px;font-size:12px;background:#fafafa;border:1px solid #d9d9d9;margin:4px 4px 0 0;display:flex;align-items:center;cursor:pointer}.ctz-block-words-content>span:hover{color:#e55353;border-color:#e55353}.ctz-flex-wrap{display:flex;flex-wrap:wrap;line-height:24px}.ctz-flex-wrap label{margin-right:4px;display:flex;align-items:center}.ctz-flex-wrap label input[type='radio']{margin:0 4px 0 0}.ctz-video-download,.ctz-loading{position:absolute;top:20px;left:20px;font-size:24px;color:rgba(255,255,255,0.9);cursor:pointer}.ctz-loading{animation:loadingAnimation 2s infinite}@keyframes loadingAnimation{from{transform:rotate(0)}to{transform:rotate(360deg)}}#CTZ-BLOCK-LIST{display:flex;flex-wrap:wrap;margin:0 -8px;padding:8px}.ctz-black-item{height:30px;line-height:30px;box-sizing:content-box;padding:4px 8px;margin:0 8px 8px 0;display:flex;align-items:center;background:#fff;border-radius:8px;border:1px solid #e0e0e0}.ctz-black-item img{width:30px;height:30px;margin-right:4px}.ctz-black-item .ctz-remove-block:hover,.ctz-black-item a:hover{color:#1677ff;transition:all .2s}.ctz-black-item .ctz-remove-block{width:30px;height:30px;text-align:center;border-radius:8px}.ctz-black-item .ctz-remove-block:hover{background:#d9d9d9}.ctz-block-box>button,.ctz-button-block{margin-left:8px}.ctz-preview{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.ctz-preview div{display:flex;justify-content:center;align-items:center;min-height:100%;width:100%}.ctz-preview div img{cursor:zoom-out;user-select:none}#CTZ_TITLE_ICO label{margin:0 4px 4px 0}#CTZ_TITLE_ICO label input{display:none}#CTZ_TITLE_ICO label input:checked+img{border:4px solid #0461cf;border-radius:12px}#CTZ_TITLE_ICO label img{width:40px;height:40px;border:4px solid transparent}.ctz-label-tag{font-weight:normal;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff;margin:0 2px}.ctz-label-tag-Answer{background:#ec7259}.ctz-label-tag-ZVideo{background:#12c2e9}.ctz-label-tag-Article{background:#00965e}.ctz-label-tag-Pin{background:#9c27b0}.ctz-question-time{color:#999 !important;font-size:14px !important;font-weight:normal !important;line-height:24px}.ctz-stop-scroll{height:100% !important;overflow:hidden !important}#CTZ_DEFAULT_SELF>div{line-height:24px;margin-bottom:4px}#CTZ_DEFAULT_SELF>div .ctz-commit{font-weight:normal}#CTZ_DEFAULT_SELF>div a{color:#1677ff}#CTZ_DEFAULT_SELF>div a:hover{color:#bbb}.ctz-export-collection-box{float:right;text-align:right}.ctz-export-collection-box button{font-size:16px}.ctz-export-collection-box p{font-size:14px;color:#666;margin:4px 0}.ctz-pdf-dialog-item{padding:12px;border-bottom:1px solid #eee;margin:12px;background:#ffffff}.ctz-pdf-dialog-title{margin:0 0 1.4em;font-size:20px;font-weight:bold}.ctz-pdf-box-content{width:100%;background:#ffffff}.ctz-pdf-view{width:100%;background:#ffffff;word-break:break-all;white-space:pre-wrap;font-size:14px;overflow-x:hidden}.ctz-pdf-view a{color:#0066ff}.ctz-pdf-view img{max-width:100%}.ctz-pdf-view p{margin:1.4em 0}.ctz-unlock,.ctz-lock,.ctz-lock-mask{display:none;color:#999;cursor:pointer}.ctz-unlock,.ctz-lock{margin:4px}.ctz-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .ctz-unlock,.position-suspensionFind:hover .ctz-unlock,.position-suspensionUser:hover .ctz-unlock,.Topstory-container .TopstoryTabs:hover .ctz-unlock{display:block}.position-suspensionSearch.ctz-move-this .ctz-unlock,.position-suspensionFind.ctz-move-this .ctz-unlock,.position-suspensionUser.ctz-move-this .ctz-unlock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-unlock{display:none !important}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock,.position-suspensionSearch.ctz-move-this .ctz-lock-mask,.position-suspensionFind.ctz-move-this .ctz-lock-mask,.position-suspensionUser.ctz-move-this .ctz-lock-mask,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock-mask{display:block}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications,.position-suspensionUser .css-18vqx7l{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch .ctz-search-icon{font-size:24px;transform:rotate(-60deg)}.position-suspensionSearch .SearchBar-input-focus .ctz-search-pick-up{display:none}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .ctz-search-pick-up{display:block}.position-suspensionSearch.focus .ctz-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .ctz-search-icon,.position-suspensionSearch .ctz-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .ctz-search-icon:hover,.position-suspensionSearch .ctz-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .ctz-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .ctz-search-pick-up{display:none}.position-suspensionSearch .ctz-search-icon{display:block}.key-shadow{border:1px solid #e0e0e0;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center}#CTZ_HISTORY_LIST .ctz-set-content a,#CTZ_HISTORY_VIEW .ctz-set-content a{word-break:break-all;display:block;margin-bottom:4px;padding:6px 12px;border:1px solid #ccc;border-radius:4px;cursor:pointer}#CTZ_HISTORY_LIST .ctz-set-content a:hover,#CTZ_HISTORY_VIEW .ctz-set-content a:hover{background:rgba(33,150,243,0.1)}[name='button_history_clear'],[name='button_history_clear'],#CTZ-BUTTON-SYNC-BLOCK{min-width:88px;margin-bottom:8px}[name='button_history_clear'] i,[name='button_history_clear'] i,#CTZ-BUTTON-SYNC-BLOCK i{top:0px;left:28px;color:#909090}.ctz-zhihu-key a{color:#1677ff !important}.ctz-zhihu-key a:hover{color:#bbb !important}.ctz-video-link{border:1px solid #ccc;display:inline-block;height:98px;width:fit-content;border-radius:4px;box-sizing:border-box;overflow:hidden;transition:all .3s}.ctz-video-link img{width:98px;height:98px;vertical-align:bottom}.ctz-video-link span{padding:4px 12px;display:inline-block}.ctz-video-link:hover{border-color:#005ce6;color:#005ce6}#CTZ_VERSION_RANGE_ZHIHU,#CTZ_FONT_SIZE_IN_ZHIHU{padding-bottom:0}#CTZ_VERSION_RANGE_ZHIHU>div,#CTZ_FONT_SIZE_IN_ZHIHU>div{align-items:center;margin-bottom:8px}#CTZ_VERSION_RANGE_ZHIHU .ctz-flex-wrap>span:nth-of-type(2),#CTZ_FONT_SIZE_IN_ZHIHU .ctz-flex-wrap>span:nth-of-type(2){margin-left:24px}.ctz-fetch-intercept .ctz-need-fetch{display:none}.ctz-fetch-intercept.ctz-fetch-intercept-close{color:#b0b0b0 !important;cursor:not-allowed}.ctz-fetch-intercept.ctz-fetch-intercept-close span.ctz-need-fetch{display:inline}.ctz-fetch-intercept.ctz-fetch-intercept-close div.ctz-need-fetch{display:block}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-remove-block{cursor:not-allowed !important}.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-black-item .ctz-remove-block:hover,.ctz-fetch-intercept.ctz-fetch-intercept-close .ctz-black-item a:hover{background:transparent !important;color:#b0b0b0 !important}#CTZ_MESSAGE_BOX{position:fixed;left:0;top:10px;width:100%;z-index:999}.ctz-message{margin:0 auto;width:500px;height:48px;display:flex;align-items:center;justify-content:center;font-size:14px;border-radius:8px;box-shadow:0 0 8px #d0d4d6,0 0 8px #e6eaec;margin-bottom:12px;background:#fff}#IMPORT_BY_FILE{display:inline-flex}#IMPORT_BY_FILE input{display:none}`;
  var commonCheckbox = (v) => `<input class="ctz-i" name="${v}" type="checkbox" value="on" />`;
  var commonLabel = (l) => l ? `<span class="ctz-label">${l}</span>` : "";
  var createHiddenItem = (arrHidden) => {
    if (!arrHidden || !arrHidden.length) return "";
    return `<div class="ctz-set-content">${arrHidden.map((item) => item.map((i) => `<label style="display: inline-flex; algin-item: center;">${commonCheckbox(i.value)}${i.label}</label>`).join("")).join("<br>")}</div>`;
  };
  var rangeHTML = (l, v, min, max) => `<div class="ctz-flex-wrap ctz-range-${v}">` + commonLabel(l) + `<input class="ctz-i" type="range" min="${min}" max="${max}" name="${v}" style="width: 300px" /><span id="${v}" style="margin: 0 8px">0</span><span class="ctz-commit">滑动条范围: ${min} ~ ${max}</span></div>`;
  var commonLabelCheckbox = (con) => con.map(
    ({ label, value, needFetch }) => `<label class="ctz-flex-wrap ${needFetch ? "ctz-fetch-intercept" : ""}">` + commonLabel(label + (needFetch ? '<span class="ctz-need-fetch">（接口拦截已关闭，此功能无法使用）</span>' : "")) + commonCheckbox(value) + `</label>`
  ).join("");
  var initHTML = () => {
    document.body.appendChild(domC("div", { id: "CTZ_MAIN", innerHTML: INNER_HTML }));
    dom(".ctz-version").innerText = `version: ${GM_info.script.version}`;
    dom(".ctz-footer-left").innerHTML = FOOTER_HTML;
    dom(".ctz-menu-top").innerHTML = HEADER.map(({ href, value }) => `<a href="${href}"><span>${value}</span></a>`).join("");
    addBackgroundSetting();
    domById("CTZ_VERSION_RANGE_ZHIHU").innerHTML = VERSION_RANGE.map(
      (item, index) => rangeHTML(item.label, item.value, item.min, item.max) + rangeHTML(item.percentLabel, item.percentValue, item.percentMin, item.percentMax) + commonLabelCheckbox([{ label: item.percentChooseLabel, value: item.percentChooseValue }]) + `<div class="ctz-commit" style="${index < VERSION_RANGE.length - 1 ? "border-bottom: 1px solid #e0e0e0;" : "margin:0;"}padding:8px 0;"><b>${item.desc}</b></div>`
    ).join("");
    domById("CTZ_IMAGE_SIZE_CUSTOM").innerHTML = rangeHTML("", "zoomImageSize", 0, 1e3);
    domById("CTZ_IMAGE_HEIGHT_CUSTOM").innerHTML = rangeHTML("", "zoomImageHeightSize", 0, 1e3);
    domById("CTZ_LIST_VIDEO_SIZE_CUSTOM").innerHTML = rangeHTML("", "zoomListVideoSize", 0, 1e3);
    domById("CTZ_FONT_SIZE_IN_ZHIHU").innerHTML = FONT_SIZE_INPUT.map(
      (item) => `<div class="ctz-flex-wrap">` + item.map((i) => commonLabel(i.label) + `<input type="number" name="${i.value}" class="ctz-i-change" style="width: 80px;" />`).join("") + `</div>`
    ).join("");
    domById("CTZ_HIDDEN").innerHTML = `<div class="ctz-content-left">${HIDDEN_ARRAY.map((i) => `<a href="#${i.key}">${i.name}</a>`).join("")}</div><div class="ctz-content-right">${HIDDEN_ARRAY.map(
      (i) => `<div id="${i.key}"><div class="ctz-set-title">${i.name}<span>${i.desc}</span></div>${createHiddenItem(i.content)}</div>`
    ).join("")}</div>`;
    domById("CTZ_TITLE_ICO").innerHTML = Object.keys(ICO_URL).map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`).join("");
    domById("CTZ_DEFAULT_SELF").innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join("");
    dom("#CTZ_BASIS_SHOW_CONTENT .ctz-set-content").innerHTML += commonLabelCheckbox(BASIC_SHOW_CONTENT);
    dom("#CTZ_BASIS_HIGH_PERFORMANCE .ctz-set-content").innerHTML += commonLabelCheckbox(HIGH_PERFORMANCE);
    initFetchInterceptStatus();
    myBlack.init();
    myMenu.init();
    dom(".ctz-footer-right").appendChild(
      domC("a", {
        href: "https://www.zhihu.com",
        target: "_self",
        innerText: "返回主页"
      })
    );
  };
  var appendHomeLink = (userinfo) => {
    if (dom(".ctz-home-link")) return;
    const hrefUser = userinfo.url ? userinfo.url.replace("/api/v4", "") : "";
    if (!hrefUser) return;
    dom(".ctz-footer-right").appendChild(
      domC("a", {
        href: hrefUser,
        target: "_blank",
        innerText: "前往个人主页>>",
        className: "ctz-home-link"
      })
    );
  };
  var fnContentRemoveKeywordSearch = (domFind) => {
    const domKeywords = domFind.querySelectorAll(".RichContent-EntityWord");
    for (let i = 0, len = domKeywords.length; i < len; i++) {
      const domItem = domKeywords[i];
      if (domItem.href === "javascript:;") {
        continue;
      }
      domItem.href = "javascript:;";
      domItem.style.cssText += `color: inherit!important; cursor: default!important;`;
      const domSvg = domItem.querySelector("svg");
      if (domSvg) {
        domSvg.style.display = "none";
      }
    }
  };
  var myScroll = {
    stop: () => dom("body").classList.add("ctz-stop-scroll"),
    on: () => dom("body").classList.remove("ctz-stop-scroll")
  };
  var myPreview = {
    open: function(src, even, isVideo) {
      const nameDom = isVideo ? this.evenPathVideo : this.evenPathImg;
      const idDom = isVideo ? this.idVideo : this.idImg;
      const nodeName = dom(nameDom);
      const nodeId = domById(idDom);
      nodeName && (nodeName.src = src);
      nodeId && (nodeId.style.display = "block");
      even && (this.even = even);
      myScroll.stop();
    },
    hide: function(pEvent) {
      if (this.even) {
        this.even.click();
        this.even = null;
      }
      pEvent.style.display = "none";
      const nodeImg = dom(this.evenPathImg);
      const nodeVideo = dom(this.evenPathVideo);
      nodeImg && (nodeImg.src = "");
      nodeVideo && (nodeVideo.src = "");
      myScroll.on();
    },
    even: null,
    evenPathImg: "#CTZ_PREVIEW_IMAGE img",
    evenPathVideo: "#CTZ_PREVIEW_VIDEO video",
    idImg: "CTZ_PREVIEW_IMAGE",
    idVideo: "CTZ_PREVIEW_VIDEO"
  };
  var callbackGIF = async (mutationsList) => {
    const target = mutationsList[0].target;
    const targetClassList = target.classList;
    const { showGIFinDialog } = await myStorage.getConfig();
    if (!(targetClassList.contains("isPlaying") && !targetClassList.contains("css-1isopsn") && showGIFinDialog)) return;
    const nodeVideo = target.querySelector("video");
    const nodeImg = target.querySelector("img");
    const srcImg = nodeImg ? nodeImg.src : "";
    nodeVideo ? myPreview.open(nodeVideo.src, target, true) : myPreview.open(srcImg, target);
  };
  var observerGIF = new MutationObserver(callbackGIF);
  async function previewGIF() {
    const { showGIFinDialog } = await myStorage.getConfig();
    if (showGIFinDialog) {
      const nodeGIFs = domA(".GifPlayer:not(.ctz-processed)");
      for (let i = 0, len = nodeGIFs.length; i < len; i++) {
        const item = nodeGIFs[i];
        item.classList.add("ctz-processed");
        observerGIF.observe(item, { attributes: true, attributeFilter: ["class"] });
      }
    } else {
      observerGIF.disconnect();
    }
  }
  var keydownNextImage = (event) => {
    const { key } = event;
    const nodeImgDialog = dom(".css-ypb3io");
    if ((key === "ArrowRight" || key === "ArrowLeft") && nodeImgDialog) {
      const src = nodeImgDialog.src;
      const nodeImage = dom(`img[src="${src}"]`);
      const nodeContentInner = domP(nodeImage, "class", "RichContent-inner") || domP(nodeImage, "class", "Post-RichTextContainer") || domP(nodeImage, "class", "QuestionRichText");
      if (nodeContentInner) {
        const images = Array.from(nodeContentInner.querySelectorAll("img"));
        const index = images.findIndex((i) => i.src === src);
        const dialogChange = (nodeDialog, nodeImage2) => {
          const { width, height, src: src2 } = nodeImage2;
          const { innerWidth, innerHeight } = window;
          const aspectRatioWindow = innerWidth / innerHeight;
          const aspectRatioImage = width / height;
          const scale = aspectRatioImage > aspectRatioWindow ? (innerWidth - 200) / width : (innerHeight - 50) / height;
          const top = document.documentElement.scrollTop;
          const left = innerWidth / 2 - width * scale / 2;
          nodeDialog.src = src2;
          nodeDialog.style.cssText = nodeDialog.style.cssText + `width: ${width}px;height: ${height}px;top: ${top}px;left: ${left}px;transform: translateX(0) translateY(0) scale(${scale}) translateZ(0px);will-change:unset;transform-origin: 0 0;`;
        };
        if (key === "ArrowRight" && index < images.length - 1) {
          dialogChange(nodeImgDialog, images[index + 1]);
          return;
        }
        if (key === "ArrowLeft" && index > 0) {
          dialogChange(nodeImgDialog, images[index - 1]);
          return;
        }
      }
    }
  };
  var initLinkChanger = () => {
    const esName = ["a.external", "a.LinkCard"];
    const operaLink = "ctz-link-changed";
    const hrefChanger = (item) => {
      const hrefFormat = item.href.replace(/^(https|http):\/\/link\.zhihu\.com\/\?target\=/, "") || "";
      let href = "";
      try {
        href = decodeURIComponent(hrefFormat);
      } catch {
        href = hrefFormat;
      }
      item.href = href;
      item.classList.add(operaLink);
    };
    for (let i = 0, len = esName.length; i < len; i++) {
      const name = esName[i];
      const links = domA(`${name}:not(.${operaLink})`);
      for (let index = 0, linkLen = links.length; index < linkLen; index++) {
        hrefChanger(links[index]);
      }
    }
  };
  var CLASS_COPY_LINK = "ctz-copy-answer-link";
  var addAnswerCopyLink = async (nodeItem) => {
    const { copyAnswerLink } = await myStorage.getConfig();
    if (!copyAnswerLink) return;
    const prevButton = nodeItem.querySelector(`.${CLASS_COPY_LINK}`);
    prevButton && prevButton.remove();
    const nodeUser = nodeItem.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser) return;
    const nDomButton = createButtonST("一键获取回答链接", CLASS_COPY_LINK);
    nDomButton.onclick = function() {
      const metaUrl = nodeItem.querySelector('.ContentItem>[itemprop="url"]');
      if (!metaUrl) return;
      const link = metaUrl.getAttribute("content") || "";
      if (link) {
        copy(link);
        message("链接复制成功");
        return;
      }
    };
    nodeUser.appendChild(nDomButton);
  };
  var loadIframePrint = (eventBtn, arrHTML, btnText) => {
    let max = 0;
    let finish = 0;
    let error = 0;
    const innerHTML = arrHTML.join("");
    const iframe = dom(".ctz-pdf-box-content");
    if (!iframe.contentWindow) return;
    const doc = iframe.contentWindow.document;
    doc.body.innerHTML = "";
    if (!doc.head.querySelector("style")) {
      doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
    }
    doc.write(`<div class="ctz-pdf-view"></div>`);
    const nodePDFView = doc.querySelector(".ctz-pdf-view");
    const domInner = domC("div", { innerHTML });
    max = domInner.querySelectorAll("img").length;
    domInner.querySelectorAll("img").forEach((imageItem) => {
      const dataOriginal = imageItem.getAttribute("data-original");
      if (!dataOriginal) {
        imageItem.setAttribute("data-original", imageItem.src);
      }
      imageItem.src = "";
    });
    nodePDFView.appendChild(domInner);
    const doPrint = () => {
      eventBtn.innerText = btnText;
      eventBtn.disabled = false;
      iframe.contentWindow.print();
    };
    const imageLoaded = () => {
      eventBtn.innerText = `资源加载进度 ${Math.floor(finish / max * 100)}%：${finish}/${max}${error > 0 ? `，${error}张图片资源已失效` : ""}`;
      if (finish + error === max) {
        doPrint();
      }
    };
    if (nodePDFView.querySelectorAll("img").length) {
      nodePDFView.querySelectorAll("img").forEach((imageItem, index) => {
        setTimeout(function() {
          imageItem.src = imageItem.getAttribute("data-original");
          imageItem.onload = function() {
            finish++;
            imageLoaded();
          };
          imageItem.onerror = function() {
            error++;
            imageLoaded();
          };
        }, Math.floor(index / 5) * 100);
      });
    } else {
      doPrint();
    }
  };
  var myCollectionExport = {
    init: async function() {
      const { fetchInterceptStatus } = await myStorage.getConfig();
      if (!fetchInterceptStatus) return;
      const { pathname } = location;
      const elementBox = domC("div", { className: `${this.className}`, innerHTML: this.element });
      const nodeThis = dom(`.${this.className}`);
      nodeThis && nodeThis.remove();
      const elementTypeSpan = this.elementTypeSpan;
      const nodeCollection = elementBox.querySelector('[name="ctz-export-collection"]');
      nodeCollection && (nodeCollection.onclick = function() {
        const me = this;
        me.innerText = "加载中...";
        me.disabled = true;
        const matched = pathname.match(/(?<=\/collection\/)\d+/);
        const id = matched ? matched[0] : "";
        if (!id) return;
        const nodeCurrent = dom(".Pagination .PaginationButton--current");
        const offset = 20 * (nodeCurrent ? Number(nodeCurrent.innerText) - 1 : 0);
        const fetchHeaders = store.getStorageConfigItem("fetchHeaders");
        fetch(`/api/v4/collections/${id}/items?offset=${offset}&limit=20`, {
          method: "GET",
          headers: new Headers(fetchHeaders)
        }).then((response) => {
          return response.json();
        }).then((res) => {
          const collectionsHTMLMap = (res.data || []).map((item) => {
            const { type, url, question, content, title } = item.content;
            switch (type) {
              case "zvideo":
                return `<div class="ctz-pdf-dialog-item"><div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title}</div><div>视频链接：<a href="${url}" target="_blank">${url}</a></div></div>`;
              case "answer":
              case "article":
              default:
                return `<div class="ctz-pdf-dialog-item"><div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title || question.title}</div><div>内容链接：<a href="${url}" target="_blank">${url}</a></div><div>${content}</div></div>`;
            }
          });
          loadIframePrint(me, collectionsHTMLMap, "生成PDF");
        });
      });
      const nodePageHeaderTitle = dom(".CollectionDetailPageHeader-title");
      nodePageHeaderTitle && nodePageHeaderTitle.appendChild(elementBox);
    },
    className: "ctz-export-collection-box",
    element: `<button class="ctz-button" name="ctz-export-collection">生成PDF</button><p>仅对当前页内容进行导出</p>`,
    elementTypeSpan: (type) => {
      const typeObj = {
        zvideo: '<span class="ctz-label-tag" style="color: #12c2e9;">视频</span>',
        answer: '<span class="ctz-label-tag" style="color: #ec7259;">问答</span>',
        article: '<span class="ctz-label-tag" style="color: #00965e;">文章</span>'
      };
      return typeObj[type] || "";
    }
  };
  var printAnswer = (e) => {
    const prevButton = e.querySelector(".ctz-answer-print");
    if (prevButton) return;
    const nodeUser = e.querySelector(".AnswerItem-authorInfo>.AuthorInfo");
    if (!nodeUser) return;
    const nButton = createButtonST("导出当前回答", "ctz-answer-print");
    nButton.onclick = function() {
      const nodeUser2 = e.querySelector(".AuthorInfo-name .UserLink-link");
      const nodeContent = e.querySelector(".RichContent-inner");
      const innerHTML = `<h1>${JSON.parse(e.querySelector(".AnswerItem").getAttribute("data-zop") || "{}").title}</h1>${nodeUser2.outerHTML + nodeContent.innerHTML}`;
      loadIframePrint(this, [innerHTML], "导出当前回答");
    };
    nodeUser.appendChild(nButton);
  };
  var printArticle = async (e) => {
    const { topExportContent } = await myStorage.getConfig();
    const prevButton = e.querySelector(".ctz-article-print");
    if (prevButton || !topExportContent) return;
    const nodeHeader = e.querySelector(".ArticleItem-authorInfo") || e.querySelector(".Post-Header .Post-Title");
    if (!nodeHeader) return;
    const nButton = createButtonST("导出当前文章", "ctz-article-print", { style: "margin: 12px 0;" });
    nButton.onclick = function() {
      const nodeTitle = e.querySelector(".ContentItem.ArticleItem .ContentItem-title>span") || e.querySelector(".Post-Header .Post-Title");
      const nodeUser = e.querySelector(".AuthorInfo-name");
      const nodeContent = e.querySelector(".RichContent-inner") || e.querySelector(".Post-RichTextContainer");
      const innerHTML = `<h1>${nodeTitle.innerHTML}</h1>${nodeUser.innerHTML + nodeContent.innerHTML}`;
      loadIframePrint(this, [innerHTML], "导出当前文章");
    };
    insertAfter(nButton, nodeHeader);
    setTimeout(() => {
      printArticle(e);
    }, 500);
  };
  var printPeopleAnswer = async () => {
    const { fetchInterceptStatus } = await myStorage.getConfig();
    const nodeListHeader = dom(".Profile-main .List-headerText");
    const prevButton = dom(`.ctz-people-answer-print`);
    if (!nodeListHeader || prevButton || !fetchInterceptStatus) return;
    const nButton = createButtonST("导出当前页回答", "ctz-people-answer-print");
    nButton.onclick = async function() {
      const eventBtn = this;
      eventBtn.innerText = "加载回答内容中...";
      eventBtn.disabled = true;
      const data = store.getUserAnswer();
      const content = data.map((item) => `<h1>${item.question.title}</h1><div>${item.content}</div>`);
      loadIframePrint(eventBtn, content, "导出当前页回答");
    };
    nodeListHeader.appendChild(nButton);
    setTimeout(() => {
      printPeopleAnswer();
    }, 500);
  };
  var printPeopleArticles = async () => {
    const { fetchInterceptStatus } = await myStorage.getConfig();
    const nodeListHeader = dom(".Profile-main .List-headerText");
    const prevButton = dom(".ctz-people-export-articles-once");
    if (!nodeListHeader || prevButton || !fetchInterceptStatus) return;
    const nButton = createButtonST("导出当前页文章", "ctz-people-export-articles-once");
    nButton.onclick = async function() {
      const eventBtn = this;
      eventBtn.innerText = "加载文章内容中...";
      eventBtn.disabled = true;
      const data = store.getUserArticle();
      const content = data.map((item) => `<h1>${item.title}</h1><div>${item.content}</div>`);
      loadIframePrint(eventBtn, content, "导出当前页文章");
    };
    nodeListHeader.appendChild(nButton);
    setTimeout(() => {
      printPeopleArticles();
    }, 500);
  };
  var formatTime = (t, f = "YYYY-MM-DD HH:mm:ss") => {
    if (!t) return "";
    const d = new Date(t);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    const preArr = (num) => String(num).length !== 2 ? "0" + String(num) : String(num);
    return f.replace(/YYYY/g, String(year)).replace(/MM/g, preArr(month)).replace(/DD/g, preArr(day)).replace(/HH/g, preArr(hour)).replace(/mm/g, preArr(min)).replace(/ss/g, preArr(sec));
  };
  var updateItemTime = (e) => {
    const nodeCreated = e.querySelector('[itemprop="dateCreated"]');
    const nodePublished = e.querySelector('[itemprop="datePublished"]');
    const nodeModified = e.querySelector('[itemprop="dateModified"]');
    const crTime = nodeCreated ? nodeCreated.content : "";
    const puTime = nodePublished ? nodePublished.content : "";
    const muTime = nodeModified ? nodeModified.content : "";
    const timeCreated = formatTime(crTime || puTime);
    const timeModified = formatTime(muTime);
    const nodeBox = e.querySelector(".ContentItem-meta");
    if (!timeCreated || !nodeBox) return;
    const innerHTML = `<div>创建时间：${timeCreated}</div><div>最后修改时间：${timeModified}</div>`;
    const domTime = e.querySelector(`.${CLASS_TIME_ITEM}`);
    if (domTime) {
      domTime.innerHTML = innerHTML;
    } else {
      nodeBox.appendChild(
        domC("div", {
          className: CLASS_TIME_ITEM,
          innerHTML,
          style: "line-height: 24px;padding-top: 2px;font-size: 14px;"
        })
      );
    }
  };
  var questionTimeout;
  var questionFindIndex = 0;
  var resetQuestionTime = () => {
    if (questionFindIndex > 5 || !dom(".ctz-question-time")) {
      return;
    }
    questionFindIndex++;
    clearTimeout(questionTimeout);
    questionTimeout = setTimeout(addQuestionTime, 500);
  };
  var addQuestionTime = async () => {
    const nodeTime = dom(".ctz-question-time");
    nodeTime && nodeTime.remove();
    const { questionCreatedAndModifiedTime } = await myStorage.getConfig();
    const nodeCreated = dom('[itemprop="dateCreated"]');
    const nodeModified = dom('[itemprop="dateModified"]');
    const nodeBox = dom(".QuestionPage .QuestionHeader-title");
    if (!questionCreatedAndModifiedTime || !nodeCreated || !nodeModified || !nodeBox) {
      resetQuestionTime();
      return;
    }
    nodeBox?.appendChild(
      domC("div", {
        className: "ctz-question-time",
        innerHTML: `<div>创建时间：${formatTime(nodeCreated.content)}</div><div>最后修改时间：${formatTime(nodeModified.content)}</div>`
      })
    );
    resetQuestionTime();
  };
  var C_ARTICLE_TIME = "ctz-article-time";
  var addArticleTime = async () => {
    const { articleCreateTimeToTop } = await myStorage.getConfig();
    const nodeT = dom(`.${C_ARTICLE_TIME}`);
    if (nodeT) return;
    const nodeContentTime = dom(".ContentItem-time");
    const nodeBox = dom(".Post-Header");
    if (!articleCreateTimeToTop || !nodeContentTime || !nodeBox) return;
    nodeBox.appendChild(
      domC("span", {
        className: C_ARTICLE_TIME,
        style: "color: #8590a6;line-height: 30px;",
        innerHTML: nodeContentTime.innerText || ""
      })
    );
    setTimeout(() => {
      addArticleTime();
    }, 500);
  };
  var updateTopVote = async (nodeItem) => {
    if (!nodeItem) return;
    const nodeItemMeta = nodeItem.querySelector(".ContentItem-meta");
    const nodeVote = nodeItem.querySelector('[itemprop="upvoteCount"]');
    const { topVote } = await myStorage.getConfig();
    if (!nodeVote || !topVote || !nodeItemMeta) return;
    const vote = nodeVote.content;
    if (+vote === 0) return;
    const className = "ctz-top-vote";
    const domVotePrev = nodeItemMeta.querySelector(`.${className}`);
    const innerHTML = `${vote} 人赞同了该回答`;
    if (domVotePrev) {
      domVotePrev.innerHTML = innerHTML;
    } else {
      const domVote = domC("div", {
        className,
        innerHTML,
        style: "font-size: 14px;padding-top: 2px;color: rgb(132, 145, 165);margin: 8px 0;"
      });
      nodeItemMeta.appendChild(domVote);
      const metaObserver = new MutationObserver(() => {
        updateTopVote(nodeItem);
      });
      metaObserver.observe(nodeVote, {
        attributes: true,
        childList: false,
        characterData: false,
        characterDataOldValue: false,
        subtree: false
      });
    }
  };
  var myListenAnswerItem = {
    index: 0,
    init: async function() {
      const nodes = domA(".AnswersNavWrapper .List-item");
      if (this.index + 1 === nodes.length) return;
      const config = await myStorage.getConfig();
      const {
        removeLessVoteDetail,
        lessVoteNumberDetail = 0,
        answerOpen,
        removeBlockUserContent,
        removeBlockUserContentList,
        showBlockUser,
        removeAnonymousAnswer,
        topExportContent,
        blockWordsAnswer = [],
        fetchInterceptStatus,
        answerItemCreatedAndModifiedTime,
        highPerformanceAnswer
      } = config;
      const addFnInNodeItem = (nodeItem, initThis) => {
        if (!nodeItem) return;
        updateTopVote(nodeItem);
        answerItemCreatedAndModifiedTime && updateItemTime(nodeItem);
        initVideoDownload(nodeItem);
        addAnswerCopyLink(nodeItem);
        if (fetchInterceptStatus) {
          showBlockUser && myBlack.addButton(nodeItem, initThis);
          if (topExportContent) {
            printAnswer(nodeItem);
            printArticle(nodeItem);
          }
        }
      };
      addFnInNodeItem(dom(".QuestionAnswer-content"));
      const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
      let removeUsernames = [];
      removeBlockUserContent && (removeUsernames = (removeBlockUserContentList || []).map((i) => i.name || ""));
      for (let i = this.index === 0 ? 0 : this.index + 1, len = nodes.length; i < len; i++) {
        let message2 = "";
        const nodeItem = nodes[i];
        const nodeItemContent = nodeItem.querySelector(".ContentItem");
        if (!nodeItemContent) continue;
        let dataZop = {};
        let dataCardContent = {};
        try {
          dataZop = JSON.parse(nodeItemContent.getAttribute("data-zop") || "{}");
          dataCardContent = JSON.parse(nodeItemContent.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        (dataCardContent["upvote_num"] || 0) < lessVoteNumberDetail && removeLessVoteDetail && (message2 = `过滤低赞回答: ${dataCardContent["upvote_num"]}赞`);
        if (!message2) {
          const nodeTag1 = nodeItem.querySelector(".KfeCollection-AnswerTopCard-Container");
          const nodeTag2 = nodeItem.querySelector(".LabelContainer-wrapper");
          const tagNames = (nodeTag1 ? nodeTag1.innerText : "") + (nodeTag2 ? nodeTag2.innerText : "");
          for (let i2 of hiddenTags) {
            if (config[i2]) {
              const nReg = new RegExp(HIDDEN_ANSWER_TAG[i2]);
              nReg.test(tagNames) && (message2 = `已删除一条标签${HIDDEN_ANSWER_TAG[i2]}的回答`);
            }
          }
        }
        if (!message2) {
          removeUsernames.includes(dataZop.authorName || "") && (message2 = `已删除${dataZop.authorName}的回答`);
        }
        if (!message2 && removeAnonymousAnswer) {
          const userName = nodeItem.querySelector('[itemprop="name"]').content;
          userName === "匿名用户" && (message2 = `已屏蔽一条「匿名用户」回答`);
        }
        if (!message2) {
          const domRichContent = nodeItem.querySelector(".RichContent");
          const innerText = domRichContent ? domRichContent.innerText : "";
          if (innerText) {
            let matchedWord = "";
            for (let itemWord of blockWordsAnswer) {
              const rep = new RegExp(itemWord.toLowerCase());
              if (rep.test(innerText.toLowerCase())) {
                matchedWord += `「${itemWord}」`;
                break;
              }
            }
            if (matchedWord) {
              message2 = `匹配到屏蔽词${matchedWord}，已屏蔽该回答内容`;
            }
          }
        }
        if (message2) {
          fnHidden(nodeItem, message2);
        } else {
          addFnInNodeItem(nodeItem, this);
          fnJustNum(nodeItem);
          if (answerOpen) {
            const buttonUnfold = nodeItem.querySelector(".ContentItem-expandButton");
            const buttonFold = nodeItem.querySelector(".RichContent-collapsedText");
            if (answerOpen === "on" && !nodeItem.classList.contains(OB_CLASS_FOLD.on)) {
              buttonUnfold && buttonUnfold.click();
              nodeItem.classList.add(OB_CLASS_FOLD.on);
            }
            const isF = buttonFold && nodeItem.offsetHeight > 939;
            const isFC = buttonUnfold;
            if (answerOpen === "off" && !nodeItem.classList.contains(OB_CLASS_FOLD.off) && (isF || isFC)) {
              nodeItem.classList.add(OB_CLASS_FOLD.off);
              isF && buttonFold && buttonFold.click();
            }
          }
        }
        if (i === len - 1) {
          this.index = i;
        }
      }
      if (highPerformanceAnswer) {
        setTimeout(() => {
          const nodes2 = domA(".AnswersNavWrapper .List-item");
          if (nodes2.length > 30) {
            const nIndex = nodes2.length - 30;
            nodes2.forEach((item, index) => {
              if (index < nIndex) {
                item.remove();
              }
            });
            this.index = this.index - nIndex;
            fnLog(`已开启高性能模式，删除${nIndex}条回答`);
          }
        }, 500);
      }
    },
    reset: function() {
      this.index = 0;
    },
    restart: function() {
      this.reset();
      this.init();
    }
  };
  var myListenListItem = {
    index: 0,
    init: async function() {
      await this.traversal(domA(".TopstoryItem"));
      setTimeout(() => {
        this.traversal(domA(".TopstoryItem:not(.ctz-listened)"), false);
      }, 500);
    },
    traversal: async function(nodes, needIndex = true) {
      const index = needIndex ? this.index : 0;
      if (!nodes.length) return;
      if (needIndex && index + 1 === nodes.length) return;
      const userinfo = store.getUserinfo();
      const removeRecommendIds = store.getRemoveRecommends();
      const pfConfig = await myStorage.getConfig();
      const {
        filterKeywords = [],
        blockWordsAnswer = [],
        removeItemAboutVideo,
        removeItemAboutPin,
        removeItemAboutArticle,
        removeLessVote,
        lessVoteNumber = 0,
        removeItemQuestionAsk,
        removeFollowVoteAnswer,
        removeFollowVoteArticle,
        removeFollowFQuestion,
        listOutPutNotInterested,
        highlightOriginal,
        themeDark = 1 /* 深色护眼一 */,
        themeLight = 0 /* 默认 */,
        removeMyOperateAtFollow,
        listOutputToQuestion,
        fetchInterceptStatus,
        removeBlockUserContent,
        removeBlockUserContentList,
        highPerformanceRecommend
      } = pfConfig;
      const pfHistory = await myStorage.getHistory();
      const historyList = pfHistory.list;
      let removeUsernames = [];
      removeBlockUserContent && (removeUsernames = (removeBlockUserContentList || []).map((i) => i.name || ""));
      for (let i = index === 0 ? 0 : index + 1, len = nodes.length; i < len; i++) {
        const nodeItem = nodes[i];
        nodeItem.classList.add("ctz-listened");
        const nodeContentItem = nodeItem.querySelector(".ContentItem");
        if (!nodeItem.scrollHeight || !nodeContentItem) continue;
        let message2 = "";
        let dataZop = {};
        let cardContent = {};
        const isVideo = nodeContentItem.classList.contains("ZVideoItem");
        const isArticle = nodeContentItem.classList.contains("ArticleItem");
        const isTip = nodeContentItem.classList.contains("PinItem");
        try {
          dataZop = JSON.parse(nodeContentItem.getAttribute("data-zop") || "{}");
          cardContent = JSON.parse(nodeContentItem.getAttribute("data-za-extra-module") || "{}").card.content;
        } catch {
        }
        const { title = "", itemId, authorName } = dataZop || {};
        if (removeMyOperateAtFollow && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          try {
            const findUserId = nodeItem.querySelector(".UserLink .UserLink-link").href.match(/[^\/]+$/)[0];
            const myUserId = userinfo.url.match(/[^\/]+$/)[0];
            findUserId === myUserId && (message2 = "关注列表屏蔽自己的操作");
          } catch {
          }
        }
        if (!message2 && removeRecommendIds.includes(String(itemId))) {
          message2 = `列表内容屏蔽来自盐选专栏的内容: ${title}`;
        }
        if (!message2) {
          removeUsernames.includes(authorName || "") && (message2 = `已删除${dataZop.authorName}的内容: ${title}`);
        }
        if (!message2 && (isVideo && removeItemAboutVideo || isArticle && removeItemAboutArticle || isTip && removeItemAboutPin)) {
          message2 = `列表种类屏蔽，${nodeContentItem.classList.value}`;
        }
        if (!message2 && removeLessVote && (cardContent["upvote_num"] || 0) < lessVoteNumber) {
          message2 = `屏蔽低赞内容: ${title}, ${cardContent["upvote_num"] || 0}`;
        }
        if (!message2 && removeItemQuestionAsk && nodeItem.querySelector(".TopstoryQuestionAskItem")) {
          message2 = "屏蔽邀请回答";
        }
        if (!message2 && (removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion) && nodeItem.classList.contains("TopstoryItem-isFollow")) {
          const nodeFirstLine = nodeItem.querySelector(".FeedSource-firstline");
          const textFollowerOperate = nodeFirstLine ? nodeFirstLine.innerText : "";
          for (let itemOperate of FILTER_FOLLOWER_OPERATE) {
            const thisRep = new RegExp(itemOperate.rep);
            if (pfConfig[itemOperate.key] && thisRep.test(textFollowerOperate)) {
              message2 = `屏蔽关注人操作: ${textFollowerOperate}`;
              break;
            }
          }
        }
        !message2 && (message2 = this.replaceBlockWord(title, nodeContentItem, filterKeywords, title, "标题"));
        if (!message2) {
          const domRichContent = nodeItem.querySelector(".RichContent");
          const innerText = domRichContent ? domRichContent.innerText : "";
          message2 = this.replaceBlockWord(innerText, nodeContentItem, blockWordsAnswer, title, "内容");
        }
        if (message2) {
          fnHidden(nodeItem, message2);
        } else {
          if (highlightOriginal) {
            const userNameE = nodeItem.querySelector(".FeedSource-firstline .UserLink-link");
            const userName = userNameE ? userNameE.innerText : "";
            if (dataZop && dataZop.authorName === userName) {
              const dark = await isDark();
              const highlight = `background: ${dark ? `${THEME_CONFIG_DARK[themeDark].background2}!important;` : +themeLight === 0 /* 默认 */ ? "#fff3d4!important;" : `${THEME_CONFIG_LIGHT[themeLight].background}!important;`}`;
              const nodeActions = nodeItem.querySelector(".ContentItem-actions");
              nodeItem.style.cssText = `${highlight}border: 1px solid #aaa;`;
              nodeActions && (nodeActions.style.cssText = highlight);
            }
          }
          const nodeItemTitle = nodeItem.querySelector(".ContentItem-title");
          if (nodeItemTitle) {
            if (listOutPutNotInterested && fetchInterceptStatus && !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`)) {
              nodeItemTitle.appendChild(createButtonST("不感兴趣", CLASS_NOT_INTERESTED, { _params: { id: dataZop.itemId, type: dataZop.type } }));
            }
            if (listOutputToQuestion && !isVideo && !isArticle && !isTip && !nodeItem.querySelector(`.${CLASS_TO_QUESTION}`)) {
              const domUrl = nodeContentItem.querySelector('[itemprop="url"]');
              const pathAnswer = domUrl ? domUrl.getAttribute("content") || "" : "";
              nodeItemTitle.appendChild(createButtonST("直达问题", CLASS_TO_QUESTION, { _params: { path: pathAnswer.replace(/\/answer[\W\w]+/, "") } }));
            }
          }
        }
        if (domP(nodeItem, "class", "Topstory-recommend") && nodeItem.querySelector(".ContentItem-title a")) {
          const nodeA = nodeItem.querySelector(".ContentItem-title a");
          if (nodeA) {
            const typeObj = isVideo ? RECOMMEND_TYPE.zvideo : isArticle ? RECOMMEND_TYPE.article : isTip ? RECOMMEND_TYPE.pin : RECOMMEND_TYPE.answer;
            const historyItem = `<a href="${nodeA.href}" target="_blank"><b style="${typeObj.style}">「${typeObj.name}」</b>${nodeA.innerText}</a>`;
            !historyList.includes(historyItem) && historyList.unshift(historyItem);
          }
        }
        fnJustNum(nodeItem);
        if (i === len - 1) {
          needIndex && (this.index = i);
          myStorage.updateHistoryItem("list", historyList);
        }
      }
      if (highPerformanceRecommend) {
        setTimeout(() => {
          const nodes2 = domA(".TopstoryItem");
          if (nodes2.length > 30) {
            const nIndex = nodes2.length - 30;
            nodes2.forEach((item, index2) => {
              if (index2 < nIndex) {
                item.remove();
              }
            });
            this.index = this.index - nIndex;
            fnLog(`已开启高性能模式，删除${nIndex}条推荐内容`);
          }
        }, 500);
      }
    },
    reset: function() {
      this.index = 0;
    },
    restart: function() {
      this.reset();
      this.init();
    },
    replaceBlockWord: function(innerText, nodeItemContent, blockWords, title, byWhat) {
      if (innerText) {
        let matchedWord = "";
        for (let word of blockWords) {
          const rep = new RegExp(word.toLowerCase());
          if (rep.test(innerText.toLowerCase())) {
            matchedWord += `「${word}」`;
            break;
          }
        }
        if (matchedWord) {
          const elementItemProp = nodeItemContent.querySelector('[itemprop="url"]');
          const routeURL = elementItemProp && elementItemProp.getAttribute("content");
          return `${byWhat}屏蔽词匹配，匹配内容：${matchedWord}，《${title}》，链接：${routeURL}`;
        }
      }
      return "";
    }
  };
  var RECOMMEND_TYPE = {
    answer: {
      name: "问题",
      style: "color: #ec7259"
    },
    article: {
      name: "文章",
      style: "color: #00965e"
    },
    zvideo: {
      name: "视频",
      style: "color: #12c2e9"
    },
    pin: {
      name: "想法",
      style: "color: #9c27b0"
    }
  };
  var myListenSearchListItem = {
    index: 0,
    init: async function() {
      const nodes = domA('.SearchResult-Card[role="listitem"]');
      if (this.index + 1 === nodes.length) return;
      const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber = 0 } = await myStorage.getConfig();
      for (let i = this.index === 0 ? 0 : this.index + 1, len = nodes.length; i < len; i++) {
        let message2 = "";
        const elementThis = nodes[i];
        if (!elementThis) continue;
        const haveAD = removeItemAboutAD && elementThis.querySelector(".KfeCollection-PcCollegeCard-root");
        const haveArticle = removeItemAboutArticle && elementThis.querySelector(".ArticleItem");
        const haveVideo = removeItemAboutVideo && elementThis.querySelector(".ZvideoItem");
        (haveAD || haveArticle || haveVideo) && (message2 = "列表种类屏蔽");
        if (removeLessVote && !message2) {
          const elementUpvote = elementThis.querySelector(".ContentItem-actions .VoteButton--up");
          if (elementUpvote) {
            const ariaLabel = elementUpvote.getAttribute("aria-label");
            if (ariaLabel) {
              const upvoteText = ariaLabel.trim().replace(/\W+/, "");
              const upvote = upvoteText.includes("万") ? +upvoteText.replace("万", "").trim() * 1e4 : +upvoteText;
              if (upvote > -1 && upvote < lessVoteNumber) {
                message2 = `屏蔽低赞内容: ${upvote || 0}赞`;
              }
            }
          }
        }
        fnJustNum(elementThis);
        message2 && fnHidden(elementThis, message2);
        if (i === len - 1) {
          this.index = i;
        }
      }
    },
    reset: function() {
      this.index = 0;
    },
    restart: function() {
      this.reset();
      this.init();
    }
  };
  var initImagePreview = async () => {
    const { zoomImageType } = await myStorage.getConfig();
    const images = [domA(".TitleImage:not(.ctz-processed)"), domA(".ArticleItem-image:not(.ctz-processed)"), domA(".ztext figure .content_image:not(.ctz-processed)")];
    for (let i = 0, imageLen = images.length; i < imageLen; i++) {
      const ev = images[i];
      for (let index = 0, len = ev.length; index < len; index++) {
        const nodeItem = ev[index];
        nodeItem.classList.add("ctz-processed");
        const src = nodeItem.src || nodeItem.style.backgroundImage && nodeItem.style.backgroundImage.split('("')[1].split('")')[0];
        nodeItem.onclick = () => myPreview.open(src);
      }
    }
    if (zoomImageType === "2") {
      const originImages = domA(".origin_image:not(.ctz-processed)");
      for (let i = 0, len = originImages.length; i < len; i++) {
        const nodeItem = originImages[i];
        nodeItem.src = nodeItem.getAttribute("data-original") || nodeItem.src;
        nodeItem.classList.add("ctz-processed");
        nodeItem.style.cssText = "max-width: 100%;";
      }
    }
  };
  var doFetchNotInterested = ({ id, type }) => {
    const nHeader = store.getStorageConfigItem("fetchHeaders");
    delete nHeader["vod-authorization"];
    delete nHeader["content-encoding"];
    delete nHeader["Content-Type"];
    delete nHeader["content-type"];
    const idToNum = +id;
    if (String(idToNum) === "NaN") {
      fnLog(`调用不感兴趣接口错误，id为NaN, 原ID：${id}`);
      return;
    }
    fetch("/api/v3/feed/topstory/uninterestv2", {
      body: `item_brief=${encodeURIComponent(JSON.stringify({ source: "TS", type, id: idToNum }))}`,
      method: "POST",
      headers: new Headers({
        ...nHeader,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      })
    }).then((res) => res.json());
  };
  var classTarget = ["RichContent-cover", "RichContent-inner", "ContentItem-more", "ContentItem-arrowIcon"];
  var canFindTargeted = (e) => {
    let isFind = false;
    classTarget.forEach((item) => {
      (e.classList.contains(item) || e.parentElement.classList.contains(item)) && (isFind = true);
    });
    return isFind;
  };
  var cbEventListener = async (event) => {
    const target = event.target;
    const nodeItem = domP(target, "class", "ContentItem");
    if (!nodeItem) return;
    const { showBlockUser, topExportContent, fetchInterceptStatus, listItemCreatedAndModifiedTime } = await myStorage.getConfig();
    if (target.classList.contains(CLASS_NOT_INTERESTED) && fetchInterceptStatus) {
      const { id, type } = target._params;
      doFetchNotInterested({ id, type });
      const nodeTopStoryItem = domP(target, "class", "TopstoryItem");
      nodeTopStoryItem && (nodeTopStoryItem.style.display = "none");
    }
    if (target.classList.contains(CLASS_TO_QUESTION)) {
      const { path } = target._params;
      path && window.open(path);
    }
    if (canFindTargeted(target)) {
      setTimeout(() => {
        updateTopVote(nodeItem);
        listItemCreatedAndModifiedTime && updateItemTime(nodeItem);
        initVideoDownload(nodeItem);
        addAnswerCopyLink(nodeItem);
        if (fetchInterceptStatus) {
          showBlockUser && myBlack.addButton(nodeItem.parentElement);
          if (topExportContent) {
            printAnswer(nodeItem.parentElement);
            printArticle(nodeItem.parentElement);
          }
        }
      }, 0);
    }
  };
  var recommendTimeout;
  var indexTopStoryInit = 0;
  var initTopStoryRecommendEvent = () => {
    const nodeTopStoryRecommend = dom(".Topstory-recommend") || dom(".Topstory-follow") || dom(".zhuanlan .css-1voxft1");
    if (nodeTopStoryRecommend) {
      nodeTopStoryRecommend.removeEventListener("click", cbEventListener);
      nodeTopStoryRecommend.addEventListener("click", cbEventListener);
    }
    if (indexTopStoryInit < 5) {
      indexTopStoryInit++;
      clearTimeout(recommendTimeout);
      recommendTimeout = setTimeout(initTopStoryRecommendEvent, 500);
    } else {
      indexTopStoryInit = 0;
    }
  };
  var initRootEvent = async () => {
    const domRoot = dom("#root");
    if (!domRoot) return;
    const classForVideoOne = CLASS_VIDEO_ONE.replace(".", "");
    const { videoUseLink } = await myStorage.getConfig();
    domRoot.addEventListener("click", function(event) {
      const target = event.target;
      if (videoUseLink) {
        if (target.classList.contains(classForVideoOne)) {
          const domVideo = target.querySelector("video");
          const videoSrc = domVideo ? domVideo.src : "";
          if (!videoSrc) return;
          window.open(videoSrc, "_blank");
        }
      }
    });
  };
  var initResizeObserver = () => {
    const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
    resizeObserver.observe(document.body);
  };
  async function resizeFun() {
    if (!HTML_HOOTS.includes(location.hostname)) return;
    const { hiddenSearchBoxTopSearch, contentRemoveKeywordSearch, globalTitle } = await myStorage.getConfig();
    const nodeTopStoryC = domById("TopstoryContent");
    if (nodeTopStoryC) {
      const heightTopStoryContent = nodeTopStoryC.offsetHeight;
      if (heightTopStoryContent < 200) {
        myListenListItem.restart();
        initTopStoryRecommendEvent();
      } else {
        myListenListItem.init();
      }
      heightTopStoryContent < window.innerHeight && windowResize();
    }
    contentRemoveKeywordSearch && fnContentRemoveKeywordSearch(document.body);
    initLinkChanger();
    previewGIF();
    initImagePreview();
    myListenSearchListItem.init();
    myListenAnswerItem.init();
    pathnameHasFn({
      collection: () => myCollectionExport.init()
    });
    globalTitle !== document.title && changeTitle();
    const nodeSearchBarInput = dom(".SearchBar-input input");
    if (hiddenSearchBoxTopSearch && nodeSearchBarInput) {
      nodeSearchBarInput.placeholder = "";
    }
  }
  var echoHistory = async () => {
    const history = await myStorage.getHistory();
    const { list, view } = history;
    const nodeList = dom("#CTZ_HISTORY_LIST .ctz-set-content");
    const nodeView = dom("#CTZ_HISTORY_VIEW .ctz-set-content");
    nodeList && (nodeList.innerHTML = list.join(""));
    nodeView && (nodeView.innerHTML = view.join(""));
  };
  var myDialog = {
    open: async () => {
      const nodeDialog = domById(ID_DIALOG);
      nodeDialog && (nodeDialog.style.display = "flex");
      myScroll.stop();
      echoData();
      echoHistory();
    },
    hide: () => {
      const nodeDialog = domById(ID_DIALOG);
      nodeDialog && (nodeDialog.style.display = "none");
      myScroll.on();
    }
  };
  var appendHidden = async () => {
    const config = await myStorage.getConfig();
    let hiddenContent = "";
    HIDDEN_ARRAY.forEach((item) => {
      item.content.forEach((content) => {
        content.forEach((hiddenItem) => {
          config[hiddenItem.value] && (hiddenContent += hiddenItem.css);
        });
      });
    });
    HIDDEN_ARRAY_MORE.forEach(({ keys, value }) => {
      let trueNumber = 0;
      keys.forEach((key) => config[key] && trueNumber++);
      trueNumber === keys.length && (hiddenContent += value);
    });
    fnAppendStyle("CTZ_STYLE_HIDDEN", hiddenContent);
  };
  var fnChanger = async (ev) => {
    const doCssVersion = [
      "questionTitleTag",
      "fixedListItemMore",
      "linkShopping",
      "highlightListItem",
      "zoomImageSize",
      "zoomImageHeight",
      "zoomImageHeightSize",
      "versionHome",
      "versionAnswer",
      "versionArticle",
      "versionHomePercent",
      "versionAnswerPercent",
      "versionArticlePercent",
      "fontSizeForListTitle",
      "fontSizeForAnswerTitle",
      "fontSizeForArticleTitle",
      "fontSizeForList",
      "fontSizeForAnswer",
      "fontSizeForArticle",
      "contentLineHeight",
      "zoomListVideoType",
      "zoomListVideoSize",
      "commitModalSizeSameVersion",
      "videoUseLink"
    ];
    const { name, value, checked, type } = ev;
    const changeBackground = () => {
      myVersion.change();
      myBackground.init();
      myListenListItem.restart();
      onUseThemeDark();
    };
    const rangeChoosePercent = () => {
      const rangeName = name.replace("IsPercent", "");
      const rangeNamePercent = `${rangeName}Percent`;
      const domRange = dom(`.ctz-range-${rangeName}`);
      const domRangePercent = dom(`.ctz-range-${rangeNamePercent}`);
      if (domRange && domRangePercent) {
        domRange.style.display = checked ? "none" : "flex";
        domRangePercent.style.display = !checked ? "none" : "flex";
      }
      myVersion.change();
    };
    const ob = {
      [INPUT_NAME_THEME]: changeBackground,
      [INPUT_NAME_ThEME_LIGHT]: changeBackground,
      [INPUT_NAME_THEME_DARK]: changeBackground,
      colorText1: changeBackground,
      suspensionHomeTab: () => {
        myVersion.change();
        changeSuspensionTab();
      },
      suspensionFind: cacheHeader,
      suspensionSearch: cacheHeader,
      suspensionUser: cacheHeader,
      titleIco: changeICO,
      showGIFinDialog: previewGIF,
      questionCreatedAndModifiedTime: addQuestionTime,
      highlightOriginal: myListenListItem.restart,
      listOutPutNotInterested: myListenListItem.restart,
      articleCreateTimeToTop: addArticleTime,
      versionHomeIsPercent: rangeChoosePercent,
      versionAnswerIsPercent: rangeChoosePercent,
      versionArticleIsPercent: rangeChoosePercent,
      zoomImageType: () => {
        myVersion.change();
        initImagePreview();
      },
      globalTitleRemoveMessage: changeTitle
    };
    await myStorage.updateConfigItem(name, type === "checkbox" ? checked : value);
    const nodeName = domById(name);
    type === "range" && nodeName && (nodeName.innerText = value);
    if (/^hidden/.test(name)) {
      appendHidden();
      return;
    }
    if (doCssVersion.includes(name)) {
      myVersion.change();
      return;
    }
    ob[name] && ob[name]();
  };
  var onInitStyleExtra = () => {
    appendHidden();
    myBackground.init();
    myVersion.init();
    loadFindTheme();
  };
  var initOperate = () => {
    const nodeContent = dom(".ctz-content");
    nodeContent.onclick = (e) => {
      const target = e.target;
      if (target.classList.contains(CLASS_INPUT_CLICK)) {
        fnChanger(target);
      }
      if (target.classList.contains("ctz-button")) {
        myButtonOperation[target.name] && myButtonOperation[target.name]();
      }
    };
    nodeContent.onchange = (e) => {
      const target = e.target;
      if (target.classList.contains(CLASS_INPUT_CHANGE)) {
        fnChanger(target);
        return;
      }
      if (target.classList.contains("ctz-input-config-import")) {
        configImport(e);
        return;
      }
    };
    dom(".ctz-menu-top").onclick = myMenu.click;
    domA(".ctz-preview").forEach((item) => {
      item.onclick = function() {
        myPreview.hide(this);
      };
    });
    domA('[name="button_history_clear"]').forEach((item) => {
      item.onclick = async (event) => {
        const prevHistory = await myStorage.getHistory();
        const target = event.target;
        const dataId = target.getAttribute("data-id");
        const isClear = confirm(`是否清空${target.innerText}`);
        if (!isClear) return;
        prevHistory[dataId] = [];
        await myStorage.updateHistory(prevHistory);
        echoHistory();
      };
    });
    const nodeOpenButton = domById("CTZ_OPEN_BUTTON");
    const nodeCloseDialog = domById("CTZ_CLOSE_DIALOG");
    nodeOpenButton && (nodeOpenButton.onclick = myDialog.open);
    nodeCloseDialog && (nodeCloseDialog.onclick = myDialog.hide);
    initTopStoryRecommendEvent();
    initRootEvent();
  };
  var myButtonOperation = {
    configExport: async () => {
      const config = await myStorage.get("pfConfig") || "{}";
      const link = domC("a", {
        href: "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(config),
        download: `知乎编辑器配置-${+/* @__PURE__ */ new Date()}.txt`
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    configRemove: async () => {
      GM.deleteValue("pfConfig");
      localStorage.removeItem("pfConfig");
    },
    configReset: async function() {
      const isUse = confirm("是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存");
      if (!isUse) return;
      const { filterKeywords = [], removeBlockUserContentList = [] } = await myStorage.getConfig();
      await myStorage.updateConfig({
        ...CONFIG_DEFAULT,
        filterKeywords,
        removeBlockUserContentList
      });
      resetData();
    },
    styleCustom: async function() {
      const nodeText = dom('[name="textStyleCustom"]');
      const value = nodeText ? nodeText.value : "";
      await myStorage.updateConfigItem("customizeCss", value);
      myCustomStyle.change(value);
    },
    syncBlack: () => myBlack.sync(0),
    buttonConfirmTitle: async function() {
      const nodeTitle = dom('[name="globalTitle"]');
      await myStorage.updateConfigItem("globalTitle", nodeTitle ? nodeTitle.value : "");
      changeTitle();
      message("网页标题修改成功");
    },
    buttonResetTitle: async function() {
      const { getStorageConfigItem } = store;
      const nodeTitle = dom('[name="globalTitle"]');
      nodeTitle && (nodeTitle.value = getStorageConfigItem("cacheTitle"));
      await myStorage.updateConfigItem("globalTitle", "");
      changeTitle();
      message("网页标题已还原");
    },
    configImport: () => {
      dom("#IMPORT_BY_FILE input").click();
    }
  };
  var configImport = (e) => {
    const target = e.target;
    const configFile = (target.files || [])[0];
    if (!configFile) return;
    const reader = new FileReader();
    reader.readAsText(configFile);
    reader.onload = async (oFREvent) => {
      let config = oFREvent.target ? oFREvent.target.result : "";
      if (typeof config === "string") {
        const nConfig = JSON.parse(config);
        await myStorage.updateConfig(nConfig);
        resetData();
      }
    };
    target.value = "";
  };
  var resetData = () => {
    onInitStyleExtra();
    initData();
    onUseThemeDark();
  };
  var needRedirect = () => {
    const { pathname, origin } = location;
    const phoneQuestion = "/tardis/sogou/qus/";
    const phoneArt = "/tardis/zm/art/";
    if (pathname.includes(phoneQuestion)) {
      const questionId = pathname.replace(phoneQuestion, "");
      location.href = origin + "/question/" + questionId;
      return true;
    }
    if (pathname.includes(phoneArt)) {
      const questionId = pathname.replace(phoneArt, "");
      location.href = "https://zhuanlan.zhihu.com/p/" + questionId;
      return true;
    }
    return false;
  };
  var BLOCK_WORDS_LIST = `#CTZ_BLOCK_WORD_LIST .ctz-block-words-content`;
  var BLOCK_WORDS_ANSWER = `#CTZ_BLOCK_WORD_CONTENT .ctz-block-words-content`;
  var NAME_BY_KEY = {
    filterKeywords: BLOCK_WORDS_LIST,
    blockWordsAnswer: BLOCK_WORDS_ANSWER
  };
  var onRemove = async (e, key) => {
    const domItem = e.target;
    if (!domItem.classList.contains("ctz-filter-word-remove")) return;
    const title = domItem.innerText;
    const config = await myStorage.getConfig();
    domItem.remove();
    myStorage.updateConfigItem(
      key,
      (config[key] || []).filter((i) => i !== title)
    );
  };
  var onAddWord = async (target, key) => {
    const word = target.value;
    const configChoose = (await myStorage.getConfig())[key];
    if (!Array.isArray(configChoose)) return;
    if (configChoose.includes(word)) {
      message("屏蔽词已存在");
      return;
    }
    configChoose.push(word);
    await myStorage.updateConfigItem(key, configChoose);
    const domItem = domC("span", { innerText: word });
    domItem.classList.add("ctz-filter-word-remove");
    const nodeFilterWords = dom(NAME_BY_KEY[key]);
    nodeFilterWords && nodeFilterWords.appendChild(domItem);
    target.value = "";
  };
  var initBlockedWords = async () => {
    const config = await myStorage.getConfig();
    const arr = [
      { domFind: dom(BLOCK_WORDS_LIST), name: "filterKeywords", domInput: dom('[name="inputBlockedWord"]') },
      { domFind: dom(BLOCK_WORDS_ANSWER), name: "blockWordsAnswer", domInput: dom('[name="inputBlockedWordAnswer"]') }
    ];
    for (let i = 0, len = arr.length; i < len; i++) {
      const { domFind, name, domInput } = arr[i];
      if (domFind) {
        const children = (config[name] || []).map((i2) => `<span class="ctz-filter-word-remove">${i2}</span>`).join("");
        domFind.innerHTML = children || "";
        domFind.onclick = (e) => onRemove(e, name);
      }
      domInput && (domInput.onchange = (e) => onAddWord(e.target, name));
    }
  };
  var myCtzTypeOperation = {
    init: function() {
      const params = new URLSearchParams(location.search);
      let ctzType = params.get("ctzType");
      this[ctzType] && this[ctzType]();
    },
    "1": function() {
      const domQuestion = dom(".QuestionPage");
      if (domQuestion && domQuestion.getAttribute("data-za-extra-module")) {
        this.clickAndClose(".QuestionButtonGroup button");
      } else {
        setTimeout(() => {
          this["1"]();
        }, 500);
      }
    },
    "2": function() {
      this.clickAndClose(".TopicActions .FollowButton");
    },
    "3": function() {
      const domQuestion = dom(".CollectionsDetailPage");
      if (domQuestion && domQuestion.getAttribute("data-za-extra-module")) {
        this.clickAndClose(".CollectionDetailPageHeader-actions .FollowButton");
      } else {
        setTimeout(() => {
          this["3"]();
        }, 500);
      }
    },
    clickAndClose: function(eventname) {
      const nodeItem = dom(eventname);
      if (nodeItem) {
        nodeItem.click();
        setTimeout(() => {
          window.close();
        }, 300);
      }
    }
  };
  var myFollowRemove = {
    init: function() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        pathnameHasFn({
          questions: () => this.addButtons(this.classOb.questions),
          collections: () => this.addButtons(this.classOb.collections)
        });
      }, 500);
    },
    addButtons: function(initTypeOb) {
      const me = this;
      const { classNameItem, classHref, ctzType } = initTypeOb;
      if (dom(`div.PlaceHolder.${classNameItem}`)) {
        this.init();
        return;
      }
      domA(`.${classNameItem}`).forEach((item) => {
        const elementButton = domC("button", {
          className: `${me.className} ${me.classNameRemove} ctz-button-block ctz-button`,
          innerText: "移除关注",
          style: "position: absolute;right: 16px;bottom: 16px;background: transparent;"
        });
        elementButton.onclick = function() {
          const nodeThis = this;
          const nItem = domP(nodeThis, "class", classNameItem);
          const nodeHref = nItem ? nItem.querySelector(classHref) : void 0;
          const qHref = nodeHref ? nodeHref.href : "";
          if (!qHref) return;
          const nHref = qHref + `?ctzType=${ctzType}`;
          window.open(nHref);
          if (nodeThis.classList.contains(me.classNameRemove)) {
            nodeThis.innerText = "添加关注";
            nodeThis.classList.remove(me.classNameRemove);
          } else {
            nodeThis.innerText = "移除关注";
            nodeThis.classList.add(me.classNameRemove);
          }
        };
        const nodeClassName = item.querySelector(`.${me.className}`);
        nodeClassName && nodeClassName.remove();
        item.appendChild(elementButton);
      });
    },
    className: "ctz-remove-follow",
    classNameRemove: "ctz-button-red",
    classOb: {
      questions: {
        classNameItem: "List-item",
        classHref: ".QuestionItem-title a",
        ctzType: 1
      },
      topics: {
        classNameItem: "List-item",
        classHref: ".ContentItem-title .TopicLink",
        ctzType: 2
      },
      collections: {
        classNameItem: "List-item",
        classHref: ".ContentItem-title a",
        ctzType: 3
      }
    },
    timer: void 0
  };
  var initOneClickInvitation = () => {
    setTimeout(() => {
      const domInvitation = dom(".QuestionInvitation");
      if (!domInvitation || dom(".ctz-invite-once")) return;
      const nButton = domC("button", {
        className: "ctz-button ctz-invite-once",
        innerHTML: "一键邀请",
        style: "margin-left: 12px;"
      });
      nButton.onclick = () => {
        const fnToMore = () => {
          const moreAction = dom(".QuestionMainAction");
          if (moreAction) {
            moreAction.click();
            setTimeout(() => {
              fnToMore();
            }, 50);
          } else {
            fnToInviteAll();
          }
        };
        const fnToInviteAll = () => {
          const nodeInvites = domA(".QuestionInvitation .ContentItem-extra button");
          nodeInvites.forEach((item) => {
            !item.disabled && !item.classList.contains("AutoInviteItem-button--closed") && item.click();
          });
        };
        fnToMore();
      };
      const nodeTopBar = domInvitation.querySelector(".Topbar");
      nodeTopBar && nodeTopBar.appendChild(nButton);
    }, 500);
  };
  var myPageFilterSetting = {
    timeout: void 0,
    init: function() {
      clearTimeout(this.timeout);
      if (/\/settings\/filter/.test(location.pathname)) {
        this.timeout = setTimeout(() => {
          this.addHTML();
          this.init();
        }, 500);
      }
    },
    addHTML: () => {
      const nButton = domC("button", {
        className: "ctz-button",
        style: "margin-left: 12px;",
        innerHTML: "移除当前页所有屏蔽话题"
      });
      nButton.onclick = () => {
        domA(".Tag button").forEach((item) => item.click());
      };
      domA(".css-j2uawy").forEach((item) => {
        if (/已屏蔽话题/.test(item.innerText) && !item.querySelector(".ctz-button")) {
          item.appendChild(nButton);
        }
      });
    }
  };
  var timer = void 0;
  var userHomeAnswers = async () => {
    const { userHomeContentTimeTop } = await myStorage.getConfig();
    if (!userHomeContentTimeTop) return;
    const doContent = (domList) => {
      for (let i = 0, len = domList.length; i < len; i++) {
        const nodeItem = domList[i];
        const nodeTitle = nodeItem.querySelector(".ContentItem-title");
        if (!nodeTitle || nodeItem.querySelector(`.${CLASS_TIME_ITEM}`)) continue;
        const nodeDateCreate = nodeItem.querySelector('[itemprop="dateCreated"]');
        const nodeDatePublished = nodeItem.querySelector('[itemprop="datePublished"]');
        const nodeDateModified = nodeItem.querySelector('[itemprop="dateModified"]');
        let innerHTML = "";
        if (nodeDateCreate) {
          const dateCreate = nodeDateCreate.getAttribute("content") || "";
          const dateCreateFormatter = formatTime(dateCreate);
          innerHTML += `<div>创建时间：${dateCreateFormatter}</div>`;
        }
        if (nodeDatePublished) {
          const datePublished = nodeDatePublished.getAttribute("content") || "";
          const datePublishedFormatter = formatTime(datePublished);
          innerHTML += `<div>发布时间：${datePublishedFormatter}</div>`;
        }
        if (nodeDateModified) {
          const dateModified = nodeDateModified.getAttribute("content") || "";
          const dateModifiedFormatter = formatTime(dateModified);
          innerHTML += `<div>最后修改时间：${dateModifiedFormatter}</div>`;
        }
        insertAfter(
          domC("div", {
            className: CLASS_TIME_ITEM,
            innerHTML,
            style: "line-height: 24px;padding-top: 2px;font-size: 14px;"
          }),
          nodeTitle
        );
      }
    };
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      const domPlaceHolder = dom(".List-item.PlaceHolder");
      const domList = domA(".List-item:not(.PlaceHolder)");
      !domPlaceHolder ? doContent(domList) : userHomeAnswers();
    }, 500);
  };
  var CLASS_TOP_BLOCK = "ctz-top-block-in-user-home";
  var blockObserver;
  var topBlockUser = async () => {
    const { userHomeTopBlockUser } = await myStorage.getConfig();
    const nodeUserHeaderOperate = dom(".ProfileHeader-contentFooter .MemberButtonGroup");
    const nodeFooterOperations = dom(".Profile-footerOperations");
    if (!nodeUserHeaderOperate || !userHomeTopBlockUser || !nodeFooterOperations) return;
    const isMe = nodeUserHeaderOperate.innerText.includes("编辑个人资料");
    if (isMe) return;
    const isBlocked = nodeUserHeaderOperate.innerText.includes("已屏蔽");
    const domFind = dom(`.${CLASS_TOP_BLOCK}`);
    domFind && domFind.remove();
    const nDomButton = domC("button", {
      className: `Button Button--primary Button--red ${CLASS_TOP_BLOCK}`,
      innerText: isBlocked ? "解除屏蔽" : "屏蔽用户"
    });
    const domUnblock = nodeUserHeaderOperate.firstChild;
    const domBlock = nodeFooterOperations.firstChild;
    nDomButton.onclick = function() {
      isBlocked ? domUnblock.click() : domBlock.click();
    };
    nodeUserHeaderOperate.insertBefore(nDomButton, domUnblock);
    blockObserver = new MutationObserver(() => {
      topBlockUser();
    });
    blockObserver.observe(nodeFooterOperations, {
      attributes: false,
      childList: true,
      characterData: false,
      characterDataOldValue: false,
      subtree: true
    });
  };
  (function() {
    if (needRedirect()) return;
    GM_registerMenuCommand("⚙️ 设置", () => {
      myDialog.open();
    });
    const T0 = performance.now();
    const { hostname, href } = location;
    const { setStorageConfigItem, getStorageConfigItem, findRemoveRecommends, setUserAnswer, setUserArticle, setUserinfo } = store;
    let isHaveHeadWhenInit = true;
    async function onDocumentStart() {
      if (!HTML_HOOTS.includes(hostname) || window.frameElement) return;
      if (!document.head) {
        fnLog("not find document.head, waiting for reload...");
        isHaveHeadWhenInit = false;
        return;
      }
      fixVideoAutoPlay();
      fnAppendStyle("CTZ_STYLE", INNER_CSS);
      let config = await myStorage.getConfig();
      if (!config || config.fetchInterceptStatus === void 0) {
        fnLog("您好，欢迎使用本插件，第一次进入，初始化中...");
        await myStorage.updateConfig(CONFIG_DEFAULT);
        config = CONFIG_DEFAULT;
      }
      await myStorage.getHistory();
      initHistoryView();
      onInitStyleExtra();
      dom("html").classList.add(/www\.zhihu\.com\/column/.test(href) ? "zhuanlan" : EXTRA_CLASS_HTML[hostname]);
      const { fetchInterceptStatus } = config;
      if (fetchInterceptStatus) {
        fnLog("已开启 fetch 接口拦截");
        const prevHeaders = getStorageConfigItem("fetchHeaders");
        const originFetch = fetch;
        const myWindow = isSafari ? window : unsafeWindow;
        myWindow.fetch = (url, opt) => {
          if (opt && opt.headers) {
            setStorageConfigItem("fetchHeaders", {
              ...prevHeaders,
              ...opt.headers
            });
          }
          return originFetch(url, opt).then((res) => {
            if (/\/api\/v3\/feed\/topstory\/recommend/.test(res.url)) {
              res.clone().json().then((r) => findRemoveRecommends(r.data));
            }
            if (/\api\/v4\/members\/[^/]+\/answers/.test(res.url)) {
              res.clone().json().then((r) => setUserAnswer(r.data));
            }
            if (/\api\/v4\/members\/[^/]+\/articles/.test(res.url)) {
              res.clone().json().then((r) => setUserArticle(r.data));
            }
            if (/\/api\/v4\/me\?/.test(res.url)) {
              res.clone().json().then((r) => {
                appendHomeLink(r);
                setUserinfo(r);
              });
            }
            return res;
          });
        };
      }
    }
    onDocumentStart();
    const timerLoadHead = () => {
      setTimeout(() => {
        if (!isHaveHeadWhenInit) {
          document.head ? onDocumentStart() : timerLoadHead();
        }
      }, 100);
    };
    timerLoadHead();
    const timerLoadBody = () => {
      setTimeout(() => {
        document.body ? createLoad() : timerLoadBody();
      }, 100);
    };
    timerLoadBody();
    const createLoad = async () => {
      if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
        try {
          const JsData = JSON.parse(domById("js-initialData") ? domById("js-initialData").innerText : "{}");
          const prevData = JsData.initialState.topstory.recommend.serverPayloadOrigin.data;
          findRemoveRecommends(prevData || []);
        } catch {
        }
        const { removeTopAD } = await myStorage.getConfig();
        initHTML();
        initOperate();
        initData();
        myBackground.init();
        myVersion.initAfterLoad();
        myCustomStyle.init();
        initBlockedWords();
        initResizeObserver();
        myCtzTypeOperation.init();
        echoHistory();
        dom('[name="useSimple"]').onclick = async function() {
          const isUse = confirm("是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存");
          if (!isUse) return;
          const prevConfig = await myStorage.getConfig();
          myStorage.updateConfig({
            ...prevConfig,
            ...CONFIG_SIMPLE
          });
          onDocumentStart();
          initData();
        };
        if (removeTopAD) {
          setTimeout(() => {
            mouseEventClick(dom("svg.css-1p094v5"));
          }, 300);
        }
      }
      historyToChangePathname();
      if (hostname === "zhuanlan.zhihu.com") {
        addArticleTime();
        const nodeArticle = dom(".Post-content");
        if (nodeArticle) {
          printArticle(nodeArticle);
          initVideoDownload(nodeArticle);
        }
      }
      fnLog(`加载完毕, 加载时长: ${Math.floor((performance.now() - T0) / 10) / 100}s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗`);
    };
    const historyToChangePathname = () => {
      pathnameHasFn({
        question: () => {
          addQuestionTime();
          const nodeQuestionAnswer = dom(".QuestionAnswer-content");
          nodeQuestionAnswer && fnJustNum(nodeQuestionAnswer);
          initOneClickInvitation();
        },
        filter: () => myPageFilterSetting.init(),
        collection: () => myCollectionExport.init(),
        following: () => myFollowRemove.init(),
        answers: () => {
          throttle(printPeopleAnswer)();
          userHomeAnswers();
        },
        posts: () => {
          throttle(printPeopleArticles)();
          userHomeAnswers();
        },
        people: topBlockUser
      });
    };
    const changeHistory = () => {
      historyToChangePathname();
      myListenListItem.reset();
      myListenSearchListItem.reset();
      myListenAnswerItem.reset();
    };
    window.addEventListener("popstate", throttle(changeHistory));
    window.addEventListener("pushState", throttle(changeHistory));
    window.addEventListener("load", () => {
      const nodeSignModal = dom(".signFlowModal");
      const nodeSignClose = nodeSignModal && nodeSignModal.querySelector(".Modal-closeButton");
      nodeSignClose && nodeSignClose.click();
      if (hostname === "zhuanlan.zhihu.com") {
        const nodeArticle = dom(".Post-content");
        if (nodeArticle) {
          initVideoDownload(nodeArticle);
        }
      }
      pathnameHasFn({
        zvideo: () => {
          const domFind = dom(".ZVideo-mainColumn");
          domFind && initVideoDownload(domFind);
        }
      });
    });
    window.addEventListener("keydown", async (event) => {
      const { hotKey } = await myStorage.getConfig();
      if (hotKey) {
        if (event.key === ">" || event.key === "》") {
          const nodeDialog = domById(ID_DIALOG);
          nodeDialog && nodeDialog.style.display === "none" ? myDialog.open() : myDialog.hide();
        }
      }
      if (event.key === "Escape") {
        myDialog.hide();
      }
      keydownNextImage(event);
    });
    document.addEventListener("copy", function(event) {
      let clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData) return;
      const selection = window.getSelection();
      let text = selection ? selection.toString() : "";
      if (text) {
        event.preventDefault();
        clipboardData.setData("text/plain", text);
      }
    });
    window.addEventListener(
      "scroll",
      throttle(async () => {
        const { suspensionPickUp } = await myStorage.getConfig();
        if (suspensionPickUp) {
          suspensionPackUp(domA(".List-item"));
          suspensionPackUp(domA(".TopstoryItem"));
          suspensionPackUp(domA(".AnswerCard"));
        }
      }, 100),
      false
    );
  })();
})();
