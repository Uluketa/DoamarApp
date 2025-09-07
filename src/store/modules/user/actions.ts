import { createAction } from "@reduxjs/toolkit";
import { UserStateType } from "./reducer";

export const clearAll = createAction('user/clearAll');
export const setUser = createAction<UserStateType>('user/setUser');