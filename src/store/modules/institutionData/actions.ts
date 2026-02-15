import { createAction } from "@reduxjs/toolkit";
import { Donation } from "~/types/entities/Donation";
import { Order } from "~/types/entities/Order";

export const setDonationsLoading = createAction<boolean>('institutionData/setDonationsLoading');
export const setDonations = createAction<Donation[]>('institutionData/setDonations');
export const setOrdersLoading = createAction<boolean>('institutionData/setOrdersLoading');
export const setOrders = createAction<Order[]>('institutionData/setOrders');
export const addOrder = createAction<Order>('institutionData/addOrder');
export const clearInstitutionData = createAction('institutionData/clearInstitutionData');
