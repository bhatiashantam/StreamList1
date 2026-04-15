import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

/** ~44pt — design circular glass controls */
export const DETAIL_HEADER_ICON_CIRCLE = spacing.xxl + spacing.md;

/** Height of the header action row below the status bar (back / share). */
const HEADER_ACTION_ROW = 48;

function blurPropsIcon(): Record<string, string | number> {
  if (Platform.OS === 'ios') {
    return {
      blurType: 'chromeMaterialDark',
      blurAmount: 50,
      reducedTransparencyFallbackColor: colors.surface,
    };
  }
  return {
    blurType: 'dark',
    blurAmount: 24,
    blurRadius: 24,
    downsampleFactor: 16,
    overlayColor: colors.header_blur_android_overlay,
  };
}

function blurPropsBar(): Record<string, string | number> {
  if (Platform.OS === 'ios') {
    return {
      blurType: 'chromeMaterialDark',
      blurAmount: 48,
      reducedTransparencyFallbackColor: colors.surface,
    };
  }
  return {
    blurType: 'dark',
    blurAmount: 28,
    blurRadius: 22,
    downsampleFactor: 16,
    overlayColor: colors.header_blur_android_overlay,
  };
}

/**
 * Full-width frosted strip behind the native stack header (hero scrolls underneath).
 * Pair with `headerTransparent: true` on the Detail screen.
 */
export function DetailScreenHeaderBackground(): React.JSX.Element {
  return (
    <View style={styles.headerBarRoot}>
      <BlurView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        {...blurPropsBar()}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.headerBarTint]}
      />
    </View>
  );
}

/**
 * Absolute header over the detail ScrollView so BlurView samples the hero behind it.
 * Use with `headerShown: false` on the Detail screen.
 */
export function DetailFloatingHeaderChrome({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const height = insets.top + HEADER_ACTION_ROW;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.floatingChromeRoot, { height }]}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <BlurView
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          {...blurPropsBar()}
        />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.headerBarTint]}
        />
      </View>
      <View
        pointerEvents="box-none"
        style={[styles.floatingActionsRow, { paddingTop: insets.top }]}
      >
        <View pointerEvents="auto">{left}</View>
        <View pointerEvents="auto">{right}</View>
      </View>
    </View>
  );
}

/**
 * Circular glass behind back / share — BlurView + light tint; icon layer is absolutely stacked on top.
 */
export function DetailHeaderIconBlur({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <View style={styles.iconCircle}>
      <BlurView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        {...blurPropsIcon()}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.iconCircleTint]}
      />
      <View style={styles.iconCircleForeground} pointerEvents="auto">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingChromeRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 24,
  },
  floatingActionsRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  headerBarRoot: {
    flex: 1,
    overflow: 'hidden',
  },
  headerBarTint: {
    backgroundColor: colors.header_bar_glass_overlay,
  },
  iconCircle: {
    width: DETAIL_HEADER_ICON_CIRCLE,
    height: DETAIL_HEADER_ICON_CIRCLE,
    borderRadius: DETAIL_HEADER_ICON_CIRCLE,
    overflow: 'hidden',
  },
  iconCircleTint: {
    backgroundColor: colors.header_glass_icon_overlay,
  },
  iconCircleForeground: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
