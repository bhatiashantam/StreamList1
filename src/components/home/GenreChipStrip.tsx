import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HomeGenreChip } from '../../hooks/useMovieGenres';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface GenreChipStripProps {
  chips: HomeGenreChip[];
  selectedLabel: string;
  onSelect: (chip: HomeGenreChip) => void;
}

export function GenreChipStrip({
  chips,
  selectedLabel,
  onSelect,
}: GenreChipStripProps): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {chips.map((chip, index) => {
          const active = chip.label === selectedLabel;
          return (
            <Pressable
              key={chip.label}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.chip,
                active ? styles.chipActive : styles.chipIdle,
                index < chips.length - 1 ? styles.chipSpacing : null,
              ]}
              onPress={(): void => {
                onSelect(chip);
              }}
            >
              <Text
                style={[
                  styles.chipLabel,
                  active ? styles.chipLabelActive : styles.chipLabelIdle,
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSpacing: {
    marginRight: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.lg,
  },
  chipActive: {
    backgroundColor: colors.secondary_container,
  },
  chipIdle: {
    backgroundColor: colors.surface_container_high,
  },
  chipLabel: {
    ...typography.titleSm,
  },
  chipLabelActive: {
    color: colors.on_surface,
  },
  chipLabelIdle: {
    color: colors.on_surface_variant,
  },
});
