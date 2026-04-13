import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function ProfileScreen(
  _props: NativeStackScreenProps<ProfileStackParamList, 'Profile'>,
): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.body}>
        Account and settings will live here in a future release.
      </Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={(): void => {
          Alert.alert('Coming Soon');
        }}
      >
        <Text style={styles.buttonLabel}>More</Text>
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
