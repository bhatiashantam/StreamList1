import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const HEADER_MIN_HEIGHT = 52;

export interface HomeHeaderProps {
  scrollY: Animated.Value;
  paddingTopInset: number;
}

export function HomeHeader({
  scrollY,
  paddingTopInset,
}: HomeHeaderProps): React.JSX.Element {
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 36],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.shell, { paddingTop: paddingTopInset }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.backdrop, { opacity: headerOpacity }]}
      />
      <View style={styles.row}>
        <View style={styles.brand}>
          <Ionicons
            name="flame"
            size={spacing.xl}
            color={colors.primary_container}
          />
          <Text style={styles.wordmark}>STREAMLIST</Text>
        </View>
        <Ionicons
          name="notifications-outline"
          size={spacing.xl}
          color={colors.on_surface_variant}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    minHeight: HEADER_MIN_HEIGHT,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
  },
  row: {
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmark: {
    ...typography.titleSm,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.primary_container,
  },
});
