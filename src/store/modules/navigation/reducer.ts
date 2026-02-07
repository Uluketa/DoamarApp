import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientScreenType, InstitutionScreenType } from "~/types/Navigation";

export type NavigationStateType = {
  screen: ClientScreenType | InstitutionScreenType;
}

export const InitialNavigationState: NavigationStateType = {
  screen: 'Home',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: InitialNavigationState,
  reducers: {
    // Define tela ativa
    setNavigationScreen(state, action: PayloadAction<NavigationStateType>) {
      state.screen = action.payload.screen;
    },

    // Reseta para Home
    resetNavigation() {
      return InitialNavigationState;
    },
  }
});

export const { setNavigationScreen, resetNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;