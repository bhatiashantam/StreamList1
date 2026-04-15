import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface DetailSectionErrorProps {
  message: string;
  onRetry: () => void;
}

export function DetailSectionError({
  message,
  onRetry,
}: DetailSectionErrorProps): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={(): void => {
          onRetry();
        }}
      >
        <Text style={styles.buttonLabel}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
  },
  message: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    marginBottom: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface_container_high,
    borderRadius: spacing.md,
  },
  buttonLabel: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
});
