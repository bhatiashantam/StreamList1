import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useWatchlistStore, selectWatchlistCount } from '../store/watchlistStore';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DetailScreen } from '../screens/DetailScreen';
import type {
  HomeStackParamList,
  SearchStackParamList,
  WatchlistStackParamList,
  ProfileStackParamList,
  MainTabParamList,
} from './types';

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

function GlassTabBarBackground(): React.JSX.Element {
  return (
    <View style={[StyleSheet.absoluteFill, styles.glassRoot]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={Platform.OS === 'ios' ? 24 : 20}
        reducedTransparencyFallbackColor={colors.surface_container}
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
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Details' }}
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
        options={{ title: 'Details' }}
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
        options={{ title: 'Details' }}
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

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary_container,
        tabBarInactiveTintColor: colors.on_surface_variant,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <GlassTabBarBackground />,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStackNavigator}
        options={{
          title: 'Watchlist',
          tabBarBadge:
            watchlistCount > 0 ? String(watchlistCount) : undefined,
          tabBarBadgeStyle: styles.watchlistBadge,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
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
  },
  tabBar: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  watchlistBadge: {
    backgroundColor: colors.primary_container,
    color: colors.on_surface,
    fontSize: 11,
    fontWeight: '600',
    minWidth: spacing.lg,
  },
});
