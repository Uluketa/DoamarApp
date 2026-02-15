import { createAction } from "@reduxjs/toolkit";
import { ClientFavorite } from "~/types/entities/ClientFavorite";

export const setFavoritesLoading = createAction<boolean>('favorites/setFavoritesLoading');
export const setFavorites = createAction<ClientFavorite[]>('favorites/setFavorites');
export const addFavoriteItem = createAction<ClientFavorite>('favorites/addFavoriteItem');
export const removeFavoriteItem = createAction<number>('favorites/removeFavoriteItem');
export const clearFavorites = createAction('favorites/clearFavorites');
