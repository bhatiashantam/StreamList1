import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function HomeScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, 'Home'>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.body}>
        Trending and featured content will appear here.
      </Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={(): void => {
          navigation.navigate('Detail', { id: 550, mediaType: 'movie' });
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
    marginBottom: spacing.xl,
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
