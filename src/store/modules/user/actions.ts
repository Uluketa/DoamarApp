import { createAction } from "@reduxjs/toolkit";
import { UserStateType } from "./reducer";
import { User } from '~/types/entities/User';
import { Client } from '~/types/entities/Client';
import { Institution } from '~/types/entities/Institution';

export const clearUser = createAction('user/clearUser');
export const setUser = createAction<UserStateType>('user/setUser');
export const updateUserData = createAction<Partial<User>>('user/updateUserData');
export const updateClientData = createAction<Partial<Client>>('user/updateClientData');
export const updateInstitutionData = createAction<Partial<Institution>>('user/updateInstitutionData');
export const setToken = createAction<string>('user/setToken');
export const setRefreshToken = createAction<{ refreshToken: string; refreshTokenExpiresAt?: string | null }>('user/setRefreshToken');