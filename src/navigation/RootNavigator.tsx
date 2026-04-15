import React, { useMemo } from 'react';
import type { RouteProp } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import type { ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useWatchlistStore, selectWatchlistCount } from '../store/watchlistStore';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { SeeAllScreen } from '../screens/SeeAllScreen';
import type {
  HomeStackParamList,
  SearchStackParamList,
  WatchlistStackParamList,
  ProfileStackParamList,
  MainTabParamList,
} from './types';

/** Full-screen stack routes: tab bar should not show (detail, see-all). */
const ROUTES_HIDE_TAB_BAR = new Set<string>(['Detail', 'SeeAll']);

function tabBarStyleForNestedStack(
  route: RouteProp<MainTabParamList, keyof MainTabParamList>,
  visibleStyle: ViewStyle,
): ViewStyle {
  const focused = getFocusedRouteNameFromRoute(route);
  if (focused != null && ROUTES_HIDE_TAB_BAR.has(focused)) {
    return { display: 'none' };
  }
  return visibleStyle;
}

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const WatchlistStack = createNativeStackNavigator<WatchlistStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.on_surface,
  headerTitleStyle: { color: colors.on_surface },
  contentStyle: { backgroundColor: colors.surface },
};

/** Detail: custom floating header in DetailScreen (blur over hero). */
const detailScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.surface },
  ...(Platform.OS === 'android' ? { statusBarTranslucent: true } : {}),
};

/** Matches @react-navigation/bottom-tabs default row height (icon + label). */
const TAB_BAR_CONTENT_HEIGHT = 49;

/** Slightly under default 25 from TabBarIcon — reads cleaner in the bar. */
const TAB_BAR_ICON_SIZE = 22;

function GlassTabBarBackground(): React.JSX.Element {
  return (
    <View style={[StyleSheet.absoluteFill, styles.glassRoot]}>
      {/* Dark base so rounded corners never show OS/window white behind blur */}
      <View
        style={[StyleSheet.absoluteFill, styles.glassBase]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={Platform.OS === 'ios' ? 28 : 24}
        reducedTransparencyFallbackColor={colors.surface}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.tab_bar_overlay },
        ]}
      />
    </View>
  );
}

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Detail"
        component={DetailScreen}
        options={detailScreenOptions}
      />
      <HomeStack.Screen
        name="SeeAll"
        component={SeeAllScreen}
        options={({ route }): { title: string } => ({
          title: route.params.title,
        })}
      />
    </HomeStack.Navigator>
  );
}

function SearchStackNavigator(): React.JSX.Element {
  return (
    <SearchStack.Navigator screenOptions={stackScreenOptions}>
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <SearchStack.Screen
        name="Detail"
        component={DetailScreen}
        options={detailScreenOptions}
      />
      <SearchStack.Screen
        name="SeeAll"
        component={SeeAllScreen}
        options={({ route }): { title: string } => ({
          title: route.params.title,
        })}
      />
    </SearchStack.Navigator>
  );
}

function WatchlistStackNavigator(): React.JSX.Element {
  return (
    <WatchlistStack.Navigator screenOptions={stackScreenOptions}>
      <WatchlistStack.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ title: 'My Watchlist' }}
      />
      <WatchlistStack.Screen
        name="Detail"
        component={DetailScreen}
        options={detailScreenOptions}
      />
      <WatchlistStack.Screen
        name="SeeAll"
        component={SeeAllScreen}
        options={({ route }): { title: string } => ({
          title: route.params.title,
        })}
      />
    </WatchlistStack.Navigator>
  );
}

function ProfileStackNavigator(): React.JSX.Element {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </ProfileStack.Navigator>
  );
}

export function RootNavigator(): React.JSX.Element {
  const watchlistCount = useWatchlistStore(selectWatchlistCount);
  const insets = useSafeAreaInsets();

  const tabBarStyleVisible = useMemo((): ViewStyle => {
    const padBottom = Math.max(
      insets.bottom - (Platform.OS === 'ios' ? 4 : 0),
      0,
    );
    const topInset = spacing.sm;
    const height = TAB_BAR_CONTENT_HEIGHT + topInset + padBottom;
    return {
      ...StyleSheet.flatten([styles.tabBar, { height, paddingTop: topInset }]),
    };
  }, [insets.bottom]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary_container,
        tabBarInactiveTintColor: colors.on_surface_variant,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: tabBarStyleVisible,
        tabBarBackground: () => <GlassTabBarBackground />,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={({ route }) => ({
          title: 'Home',
          tabBarStyle: tabBarStyleForNestedStack(route, tabBarStyleVisible),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={TAB_BAR_ICON_SIZE}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={({ route }) => ({
          title: 'Search',
          tabBarStyle: tabBarStyleForNestedStack(route, tabBarStyleVisible),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={TAB_BAR_ICON_SIZE}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStackNavigator}
        options={({ route }) => ({
          title: 'Watchlist',
          tabBarBadge:
            watchlistCount > 0 ? String(watchlistCount) : undefined,
          tabBarBadgeStyle: styles.watchlistBadge,
          tabBarStyle: tabBarStyleForNestedStack(route, tabBarStyleVisible),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={TAB_BAR_ICON_SIZE}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={TAB_BAR_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  glassRoot: {
    overflow: 'hidden',
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
  },
  glassBase: {
    backgroundColor: colors.surface,
  },
  tabBar: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    paddingHorizontal: spacing.xs,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
  },
  tabBarItem: {
    paddingHorizontal: spacing.sm,
  },
  tabBarLabel: {
    ...typography.labelSm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  watchlistBadge: {
    backgroundColor: colors.primary_container,
    color: colors.on_surface,
    fontSize: 11,
    fontWeight: '600',
    minWidth: spacing.lg,
  },
});
