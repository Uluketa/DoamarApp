import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '~/types/entities/User';
import { Client } from '~/types/entities/Client';
import { Institution } from '~/types/entities/Institution';

export type UserStateType = {
  accountType: 'R' | 'D' | 'B';  //Recipient (R) || Donor (D) || Both (B)
  token: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string | null;
  userData: User;
}

export const InitialUserState: UserStateType = {
  accountType: 'R',
  token: '',
  refreshToken: '',
  refreshTokenExpiresAt: null,
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
    // Login: Define usuário e token
    setUser(state, action: PayloadAction<UserStateType>) {
      state.accountType = action.payload.accountType;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? '';
      state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt ?? null;
      state.userData = action.payload.userData;
    },

    // Logout: Limpa todos os dados
    clearUser() {
      return InitialUserState;
    },

    // Atualizar perfil do cliente
    updateUserData(state, action: PayloadAction<Partial<User>>) {
      state.userData = {
        ...state.userData,
        ...action.payload
      };
    },

    // Atualizar dados do cliente relacionado
    updateClientData(state, action: PayloadAction<Partial<Client>>) {
      if (state.userData.client) {
        state.userData.client = {
          ...state.userData.client,
          ...action.payload
        };
      }
    },

    // Atualizar dados da instituição relacionada
    updateInstitutionData(state, action: PayloadAction<Partial<Institution>>) {
      if (state.userData.institution) {
        state.userData.institution = {
          ...state.userData.institution,
          ...action.payload
        };
      }
    },

    // Atualizando apenas o token
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },

    setRefreshToken(state, action: PayloadAction<{ refreshToken: string; refreshTokenExpiresAt?: string | null }>) {
      state.refreshToken = action.payload.refreshToken;
      state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt ?? null;
    }
  }
});

export const { setUser, clearUser, updateUserData, updateClientData, updateInstitutionData, setToken, setRefreshToken } = userSlice.actions;
export default userSlice.reducer;