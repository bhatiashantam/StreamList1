import { create } from 'zustand';

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

export const useWatchlistStore = create<WatchlistState>((set) => ({
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
}));

export function selectWatchlistCount(state: WatchlistState): number {
  return state.items.length;
}
