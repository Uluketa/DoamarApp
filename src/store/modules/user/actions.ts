import { createAction } from "@reduxjs/toolkit";
import { UserStateType } from "./reducer";

export const setUser = createAction<UserStateType>('user/setUser');
export const clearUser = createAction<UserStateType>('user/clearUser');
