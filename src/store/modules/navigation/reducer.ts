import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientScreenType, InstitutionScreenType } from "~/types/Navigation";

export type NavigationStateType = {
  screen: ClientScreenType | InstitutionScreenType;
}

export const InitialNavigationState: NavigationStateType = {
  screen: 'Home',
};

const userSlice = createSlice({
  name: 'navigation',
  initialState: InitialNavigationState,
  reducers: {
    setNavigationScreen(state, action: PayloadAction<NavigationStateType>) {
      state.screen = action.payload.screen;
    },
    clearAll() {
      return InitialNavigationState;
    },
  }
});

export const { setNavigationScreen, clearAll } = userSlice.actions;
export default userSlice.reducer;