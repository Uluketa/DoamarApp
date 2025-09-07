import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '~/types/entities/User';

export type UserStateType = {
  accountType: 'R' | 'D' | 'B';  //Recipient (R) || Donor (D) || Both (B)
  token: string;
  userData: User;
}

export const InitialUserState: UserStateType = {
  accountType: 'R',
  token: '',
  userData: {
    id: 0,
    username: '',
    password: '',
    type: 'client',
    hash: '',
    active: 'S'
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState: InitialUserState,
  reducers: {
    setUser(state, action: PayloadAction<UserStateType>) {
      state.accountType = action.payload.accountType;
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    clearAll() {
      return InitialUserState;
    },
  }
});

export const { setUser, clearAll } = userSlice.actions;
export default userSlice.reducer;