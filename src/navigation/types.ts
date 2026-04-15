import type { NavigatorScreenParams } from '@react-navigation/native';

/** Params for the shared Detail screen (TMDB-style id + media type). */
export type DetailScreenParams = {
  id: number;
  mediaType: 'movie' | 'tv';
};

export type SeeAllListKind = 'trending' | 'top_rated' | 'discover';

export type SeeAllScreenParams = {
  listKind: SeeAllListKind;
  genreId: number | null;
  title: string;
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: DetailScreenParams;
  SeeAll: SeeAllScreenParams;
};

export type SearchStackParamList = {
  Search: undefined;
  Detail: DetailScreenParams;
};

export type WatchlistStackParamList = {
  Watchlist: undefined;
  Detail: DetailScreenParams;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

/** Stacks that include the shared `Detail` screen (for typing the component once). */
export type DetailParentStackParamList =
  | HomeStackParamList
  | SearchStackParamList
  | WatchlistStackParamList;

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  WatchlistTab: NavigatorScreenParams<WatchlistStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootNavigatorParamList = MainTabParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootNavigatorParamList {}
  }
}
