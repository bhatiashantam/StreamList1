import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { WatchlistStackParamList } from '../navigation/types';
import { useWatchlistStore } from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function WatchlistScreen({
  navigation,
}: NativeStackScreenProps<WatchlistStackParamList, 'Watchlist'>): React.JSX.Element {
  const addItem = useWatchlistStore((s) => s.addItem);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Watchlist</Text>
      <Text style={styles.body}>
        Saved titles will appear here. Add a sample item to show the tab badge.
      </Text>
      <Pressable
        accessibilityRole="button"
        style={styles.secondaryButton}
        onPress={(): void => {
          addItem({ id: 603, mediaType: 'movie' });
        }}
      >
        <Text style={styles.secondaryLabel}>Add sample to watchlist</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={(): void => {
          navigation.navigate('Detail', { id: 603, mediaType: 'movie' });
        }}
      >
        <Text style={styles.buttonLabel}>Open sample detail</Text>
      </Pressable>
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
    ...typography.displayMd,
    color: colors.on_surface,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    marginBottom: spacing.lg,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  secondaryLabel: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
  },
  buttonLabel: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
});
