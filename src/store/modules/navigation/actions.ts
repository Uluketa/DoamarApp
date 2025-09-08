import { createAction } from "@reduxjs/toolkit";
import { NavigationStateType } from "./reducer";

export const clearAll = createAction('navigation/clearAll');
export const setNavigationScreen = createAction<NavigationStateType>('navigation/setNavigationScreen');