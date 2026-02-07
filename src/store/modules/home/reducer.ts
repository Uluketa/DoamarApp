import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Institution } from '~/types/entities/Institution';
import { SocialIssue } from '~/types/entities/SocialIssue';

export type HomeStateType = {
  institutions: Institution[];
  socialIssues: SocialIssue[];
  isLoading: boolean;
};

const initialState: HomeStateType = {
  institutions: [],
  socialIssues: [],
  isLoading: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomeData(
      state,
      action: PayloadAction<{ institutions?: Institution[]; socialIssues?: SocialIssue[] }>
    ) {
      if (action.payload.institutions !== undefined) {
        state.institutions = action.payload.institutions;
      }
      if (action.payload.socialIssues !== undefined) {
        state.socialIssues = action.payload.socialIssues;
      }
    },
    setHomeLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearHome() {
      return initialState;
    },
  },
});

export const { setHomeData, setHomeLoading, clearHome } = homeSlice.actions;
export default homeSlice.reducer;
