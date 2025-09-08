import { createAction } from "@reduxjs/toolkit";
import { CartStateType } from "./reducer";

export const clearAll = createAction('cart/clearAll');
export const setCartItems = createAction<CartStateType>('cart/setCartItems');