import { createAction } from "@reduxjs/toolkit";
import { CartStateType, CartItem } from "./reducer";
import { Institution } from '~/types/entities/Institution';

export const clearCart = createAction('cart/clearCart');
export const setCartItems = createAction<CartStateType>('cart/setCartItems');
export const addCartItem = createAction<CartItem>('cart/addCartItem');
export const removeCartItem = createAction<number>('cart/removeCartItem');
export const updateCartItemQuantity = createAction<{ orderId: number; quantity: number }>('cart/updateCartItemQuantity');
export const setCartInstitution = createAction<Institution | null>('cart/setCartInstitution');