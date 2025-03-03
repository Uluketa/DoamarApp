import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserStateType = {
  userId: number;
  userType: 'client' | 'institution';
  accountType: 'R' | 'D' | 'B';  //Recipient (R) || Donor (D) || Both (B)
  token: string;
}

export const InitialUserState: UserStateType = {
  userType: 'client',
  accountType: 'R',
  userId: 0,
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: InitialUserState,
  reducers: {
    setUser(state, action: PayloadAction<UserStateType>) {
      state.accountType = action.payload.accountType;
      state.userType = action.payload.userType;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    clearUser() {
      return InitialUserState;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;