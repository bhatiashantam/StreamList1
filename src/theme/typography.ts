import type { TextStyle } from 'react-native';

/**
 * Logical font families. After loading via react-native-google-fonts, use the
 * matching *face* names below in `typography` so weights resolve on device.
 */
export const fontFamily = {
  /** Manrope — display, headlines, card titles */
  manrope: {
    /** 800 — display-lg, display-md */
    extraBold: 'Manrope_800ExtraBold',
    /** 700 — headline-md */
    bold: 'Manrope_700Bold',
    /** 600 — title-lg */
    semiBold: 'Manrope_600SemiBold',
  },
  /** Inter — title-sm, body, labels */
  inter: {
    /** 600 — title-sm (buttons, labels) */
    semiBold: 'Inter_600SemiBold',
    /** 400 — body-md, label-sm */
    regular: 'Inter_400Regular',
  },
} as const;

/**
 * Design tokens: sizes and weights match the spec; letter spacing is em-based
 * in design tools — converted to px for React Native (`letterSpacing` is in px).
 */
export const typography = {
  /** Hero titles — Manrope 56 / 800 / -0.02em */
  displayLg: {
    fontFamily: fontFamily.manrope.extraBold,
    fontSize: 56,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.02 * 56,
  },
  /** Screen titles (e.g. "My Watchlist") — Manrope 40 / 800 / -0.02em */
  displayMd: {
    fontFamily: fontFamily.manrope.extraBold,
    fontSize: 40,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.02 * 40,
  },
  /** Detail page title under hero — Manrope 30 / 800 / -0.02em (design: large display) */
  detailTitle: {
    fontFamily: fontFamily.manrope.extraBold,
    fontSize: 30,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.02 * 30,
  },
  /** Section headers ("Trending Now") — Manrope 28 / 700 / -0.01em */
  headlineMd: {
    fontFamily: fontFamily.manrope.bold,
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.01 * 28,
  },
  /** Card titles — Manrope 20 / 600 / 0 */
  titleLg: {
    fontFamily: fontFamily.manrope.semiBold,
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  /** Buttons, labels — Inter 14 / 600 / 0 */
  titleSm: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  /** Synopsis, body copy — Inter 14 / 400 / 0 */
  bodyMd: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  /** Metadata (year, genre, rating) — Inter 12 / 400 / 0 */
  labelSm: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
} as const;

export type TypographyToken = keyof typeof typography;

export type TypographyStyle = (typeof typography)[TypographyToken];
