import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Institution } from "~/types/entities/Institution";
import { Order } from "~/types/entities/Order";

export type CartItem = Order & { quantity: number };

export type CartStateType = {
  items: CartItem[];
  institution: Institution | null;
};

export const InitialCartState: CartStateType = {
  items: [],
  institution: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: InitialCartState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartStateType>) {
      state.items = action.payload.items;
    },
    clearAll() {
      return InitialCartState;
    },
  }
});

export const { setCartItems, clearAll } = cartSlice.actions;
export default cartSlice.reducer;