import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Donation } from '~/types/entities/Donation';
import { Order } from '~/types/entities/Order';

export type InstitutionDataStateType = {
  donations: Donation[];
  orders: Order[];
  isLoadingDonations: boolean;
  isLoadingOrders: boolean;
};

const initialState: InstitutionDataStateType = {
  donations: [],
  orders: [],
  isLoadingDonations: false,
  isLoadingOrders: false,
};

const institutionDataSlice = createSlice({
  name: 'institutionData',
  initialState,
  reducers: {
    setDonationsLoading(state, action: PayloadAction<boolean>) {
      state.isLoadingDonations = action.payload;
    },

    setDonations(state, action: PayloadAction<Donation[]>) {
      state.donations = action.payload;
    },

    setOrdersLoading(state, action: PayloadAction<boolean>) {
      state.isLoadingOrders = action.payload;
    },

    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },

    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },

    clearInstitutionData() {
      return initialState;
    },
  },
});

export const {
  setDonationsLoading,
  setDonations,
  setOrdersLoading,
  setOrders,
  addOrder,
  clearInstitutionData,
} = institutionDataSlice.actions;
export default institutionDataSlice.reducer;
