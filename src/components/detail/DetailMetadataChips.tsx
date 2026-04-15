import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type ChipVariant = 'default' | 'rating';

export interface ChipItem {
  key: string;
  label: string;
  variant?: ChipVariant;
  /** When variant is `rating`, used to render star + score with correct colors */
  ratingValue?: number;
}

export interface DetailMetadataChipsProps {
  chips: ChipItem[];
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${m}m`;
}

export function buildMetadataChips(input: {
  releaseYearLabel: string | null;
  voteAverage: number;
  genres: { name: string }[];
  runtimeMinutes: number | null;
}): ChipItem[] {
  const out: ChipItem[] = [];
  if (input.releaseYearLabel) {
    out.push({ key: 'year', label: input.releaseYearLabel, variant: 'default' });
  }
  if (input.voteAverage > 0) {
    out.push({
      key: 'rating',
      label: `★ ${input.voteAverage.toFixed(1)} Rating`,
      variant: 'rating',
      ratingValue: input.voteAverage,
    });
  }
  const genreNames = input.genres.map((g) => g.name).filter(Boolean);
  if (genreNames.length > 0) {
    out.push({
      key: 'genre',
      label: genreNames.join(', '),
      variant: 'default',
    });
  }
  if (input.runtimeMinutes != null && input.runtimeMinutes > 0) {
    out.push({
      key: 'runtime',
      label: formatRuntime(input.runtimeMinutes),
      variant: 'default',
    });
  }
  return out;
}

export function DetailMetadataChips({
  chips,
}: DetailMetadataChipsProps): React.JSX.Element | null {
  if (chips.length === 0) {
    return null;
  }
  return (
    <View style={styles.row}>
      {chips.map((c) => {
        const isRating = c.variant === 'rating';
        if (isRating && c.ratingValue != null) {
          return (
            <View key={c.key} style={[styles.chip, styles.chipRating]}>
              <Text style={styles.chipText} numberOfLines={1}>
                <Text style={styles.chipRatingStar}>★ </Text>
                <Text style={styles.chipRatingRest}>
                  {`${c.ratingValue.toFixed(1)} Rating`}
                </Text>
              </Text>
            </View>
          );
        }
        return (
          <View
            key={c.key}
            style={[styles.chip, styles.chipDefault]}
          >
            <Text
              style={[styles.chipText, styles.chipTextDefault]}
              numberOfLines={1}
            >
              {c.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    maxWidth: '100%',
  },
  chipDefault: {
    backgroundColor: colors.surface_container_highest,
  },
  chipRating: {
    backgroundColor: colors.secondary_container,
  },
  chipText: {
    ...typography.labelSm,
  },
  chipTextDefault: {
    color: colors.on_hero,
  },
  chipRatingStar: {
    ...typography.labelSm,
    color: colors.primary_container,
  },
  chipRatingRest: {
    ...typography.labelSm,
    color: colors.on_hero,
  },
});
