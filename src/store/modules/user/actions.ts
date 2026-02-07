import { createAction } from "@reduxjs/toolkit";
import { UserStateType } from "./reducer";
import { User } from '~/types/entities/User';
import { Client } from '~/types/entities/Client';

export const clearUser = createAction('user/clearUser');
export const setUser = createAction<UserStateType>('user/setUser');
export const updateUserData = createAction<Partial<User>>('user/updateUserData');
export const updateClientData = createAction<Partial<Client>>('user/updateClientData');
export const setToken = createAction<string>('user/setToken');