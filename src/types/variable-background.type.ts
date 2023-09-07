/** 主题风格 */
export enum ETheme {
  浅色 = '0',
  深色 = '1',
  自动 = '2',
}

/** 主题风格 - 浅色 */
export enum EThemeLight {
  默认 = '0',
  护眼红 = '1',
  杏仁黄 = '2',
  青草绿 = '3',
  极光灰 = '4',
  葛巾紫 = '5',
}

/** 主题风格 - 深色 */
export enum EThemeDark {
  夜间模式默认 = '0',
  夜间护眼一 = '1',
  夜间护眼二 = '2',
  夜间护眼三 = '3',
}

/** 浅色主题色配置 */
export type IThemeConfigLight = Record<EThemeLight, IThemeValueLight>;

export interface IThemeValueLight {
  /** 名称 */
  name: string;
  /** 字体颜色 */
  color?: string;
  /** 背景色 */
  background: string;
  /** 第二背景色 */
  background2: string;
}

/** 深色主题色配置 */
export type IThemeConfigDark = Record<EThemeDark, IThemeValueDark>;
export interface IThemeValueDark {
  /** 名称 */
  name: string;
  /** 字体颜色 */
  color: string;
  /** 第二字体色 */
  color2: string;
  /** 背景色 */
  background: string;
  /** 第二背景色 */
  background2: string;
}
