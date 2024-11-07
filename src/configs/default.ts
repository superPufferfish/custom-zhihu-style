import { ETheme, EThemeDark, EThemeLight } from '../types';
import { IConfigFilter, IConfigHidden, IConfigSuspension, IPfConfig } from '../types/configs.type';

/** 隐藏内容模块默认为 true 的配置 */
export const CONFIG_HIDDEN_DEFAULT: IConfigHidden = {
  hiddenAnswerRightFooter: true,
  hiddenReadMoreText: true,
  hiddenAD: true,
  hiddenDetailFollow: true,
  hidden618HongBao: true,
  hiddenZhihuZhiShop: true,
};

/** 屏蔽内容模块默认配置 */
export const CONFIG_FILTER_DEFAULT: IConfigFilter = {
  removeZhihuOfficial: false,
  removeStoryAnswer: true,
  removeYanxuanAnswer: true,
  removeYanxuanRecommend: true,
  removeYanxuanCPRecommend: true,
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
  removeTopAD: true,
};

/** 悬浮模块默认配置 */
export const CONFIG_SUSPENSION: IConfigSuspension = {
  suspensionHomeTab: false,
  suspensionHomeTabPo: 'left: 20px; top: 100px;',
  suspensionHomeTabFixed: true,
  suspensionFind: false,
  suspensionFindPo: 'left: 10px; top: 380px;',
  suspensionFindFixed: true,
  suspensionSearch: false,
  suspensionSearchPo: 'left: 10px; top: 400px;',
  suspensionSearchFixed: true,
  suspensionUser: false,
  suspensionUserPo: 'right: 60px; top: 100px;',
  suspensionUserFixed: true,
  suspensionPickUp: true,
  suspensionPickupRight: 60,
};

/** 极简模式配置 */
export const CONFIG_SIMPLE: IPfConfig = {
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
  removeZhihuOfficial: false,
  removeStoryAnswer: true,
  removeYanxuanAnswer: true,
  removeYanxuanRecommend: true,
  removeYanxuanCPRecommend: true,
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
  suspensionHomeTabPo: 'left: 20px; top: 100px;',
  suspensionHomeTabFixed: true,
  suspensionFind: false,
  suspensionFindPo: 'left: 10px; top: 380px;',
  suspensionFindFixed: true,
  suspensionSearch: true,
  suspensionSearchPo: 'left: 10px; top: 400px;',
  suspensionSearchFixed: true,
  suspensionUser: true,
  suspensionUserPo: 'right: 60px; top: 100px;',
  suspensionUserFixed: true,
  suspensionPickUp: true,
  answerOpen: 'off',
  showBlockUser: false,
  zoomImageType: '2',
  zoomImageSize: '200',
  questionTitleTag: true,
  listOutPutNotInterested: true,
  fixedListItemMore: true,
  highlightOriginal: true,
  highlightListItem: true,
  listItemCreatedAndModifiedTime: true,
  answerItemCreatedAndModifiedTime: true,
  questionCreatedAndModifiedTime: true,
  articleCreateTimeToTop: true,
  linkShopping: '1',
  hiddenAnswerItemActions: true,
  hiddenAnswerItemTime: true,
  videoUseLink: true,
  commitModalSizeSameVersion: true,
};

/** 默认配置 */
export const CONFIG_DEFAULT: IPfConfig = {
  ...CONFIG_HIDDEN_DEFAULT,
  ...CONFIG_FILTER_DEFAULT,
  ...CONFIG_SUSPENSION,
  fetchInterceptStatus: true,
  customizeCss: '',
  answerOpen: '',
  filterKeywords: [],
  blockWordsAnswer: [],
  showBlockUser: true,
  versionHome: '1000',
  versionAnswer: '1000',
  versionArticle: '1000',
  versionHomeIsPercent: false,
  versionHomePercent: '70',
  versionAnswerIsPercent: false,
  versionAnswerPercent: '70',
  versionArticleIsPercent: false,
  versionArticlePercent: '70',
  zoomImageType: '0',
  zoomImageSize: '600',
  showGIFinDialog: false,
  globalTitle: '',
  titleIco: '',
  questionTitleTag: true,
  listOutPutNotInterested: false,
  fixedListItemMore: false,
  highlightOriginal: true,
  highlightListItem: false,
  listItemCreatedAndModifiedTime: true,
  answerItemCreatedAndModifiedTime: true,
  questionCreatedAndModifiedTime: true,
  articleCreateTimeToTop: true,
  linkShopping: '0',
  fontSizeForList: 15,
  fontSizeForAnswer: 15,
  fontSizeForArticle: 16,
  fontSizeForListTitle: 18,
  fontSizeForAnswerTitle: 22,
  fontSizeForArticleTitle: 24,
  zoomListVideoType: '0',
  zoomListVideoSize: '500',
  hotKey: true,
  theme: ETheme.自动,
  themeLight: EThemeLight.默认,
  themeDark: EThemeDark.深色护眼一,
  colorText1: '',
  commitModalSizeSameVersion: true,
  listOutputToQuestion: false,
  userHomeContentTimeTop: true,
  userHomeTopBlockUser: true,
  copyAnswerLink: true,
  contentRemoveKeywordSearch: false,
  topExportContent: true,
  zoomImageHeight: '0',
  zoomImageHeightSize: '100',
};

/** 缓存的历史记录数量 */
export const SAVE_HISTORY_NUMBER = 500;
