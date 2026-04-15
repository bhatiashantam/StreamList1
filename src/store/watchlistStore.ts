import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type WatchlistMediaType = 'movie' | 'tv';

export interface WatchlistItem {
  id: number;
  mediaType: WatchlistMediaType;
}

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (item: WatchlistItem) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item: WatchlistItem): void => {
        set((s) => {
          const exists = s.items.some(
            (i) => i.id === item.id && i.mediaType === item.mediaType,
          );
          if (exists) {
            return s;
          }
          return { items: [...s.items, item] };
        });
      },
      removeItem: (item: WatchlistItem): void => {
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.id === item.id && i.mediaType === item.mediaType),
          ),
        }));
      },
    }),
    {
      name: 'streamlist-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: WatchlistState): Pick<WatchlistState, 'items'> => ({
        items: state.items,
      }),
    },
  ),
);

export function selectWatchlistCount(state: WatchlistState): number {
  return state.items.length;
}

export function selectIsInWatchlist(
  id: number,
  mediaType: WatchlistMediaType,
): (state: WatchlistState) => boolean {
  return (state: WatchlistState): boolean =>
    state.items.some((i) => i.id === id && i.mediaType === mediaType);
}
