import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  DetailParentStackParamList,
  DetailScreenParams,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function DetailScreen({
  route,
}: NativeStackScreenProps<DetailParentStackParamList, 'Detail'>): React.JSX.Element {
  const { id, mediaType }: DetailScreenParams = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail</Text>
      <Text style={styles.meta}>
        {mediaType.toUpperCase()} · #{id}
      </Text>
      <Text style={styles.body}>
        Detail content hooks will load TMDB data for this item. Use the header
        back control to return to the screen you opened from (Home, Search, or
        Watchlist).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.headlineMd,
    color: colors.on_surface,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginBottom: spacing.lg,
  },
  body: {
    ...typography.bodyMd,
    color: colors.on_surface,
  },
});
