import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientFavorite } from '~/types/entities/ClientFavorite';

export type FavoritesStateType = {
  items: ClientFavorite[];
  isLoading: boolean;
};

const initialState: FavoritesStateType = {
  items: [],
  isLoading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoritesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setFavorites(state, action: PayloadAction<ClientFavorite[]>) {
      state.items = action.payload;
    },

    addFavoriteItem(state, action: PayloadAction<ClientFavorite>) {
      state.items.push(action.payload);
    },

    removeFavoriteItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(fav => fav.institution.id !== action.payload);
    },

    clearFavorites() {
      return initialState;
    },
  },
});

export const { setFavoritesLoading, setFavorites, addFavoriteItem, removeFavoriteItem, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
