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
    // Define itens e instituição do carrinho
    setCartItems(state, action: PayloadAction<CartStateType>) {
      state.items = action.payload.items;
      state.institution = action.payload.institution;
    },

    // Adiciona um item ao carrinho
    addCartItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    // Remove item do carrinho
    removeCartItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Atualiza quantidade de um item
    updateCartItemQuantity(state, action: PayloadAction<{ orderId: number; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.orderId);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== item.id);
        }
      }
    },

    // Define instituição do carrinho
    setCartInstitution(state, action: PayloadAction<Institution | null>) {
      state.institution = action.payload;
    },

    // Limpa carrinho completamente
    clearCart() {
      return InitialCartState;
    },
  }
});

export const { setCartItems, addCartItem, removeCartItem, updateCartItemQuantity, setCartInstitution, clearCart } = cartSlice.actions;
export default cartSlice.reducer;