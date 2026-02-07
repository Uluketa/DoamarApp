import { createAction } from "@reduxjs/toolkit";
import { NavigationStateType } from "./reducer";

export const resetNavigation = createAction('navigation/resetNavigation');
export const setNavigationScreen = createAction<NavigationStateType>('navigation/setNavigationScreen');