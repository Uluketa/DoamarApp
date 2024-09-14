export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const RESET_STATE = 'RESET_STATE';

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  payload: {
    login: string;
    password: string;
  };
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: {
    userType: 'cliente' | 'instituicao';
    typeDonation: string;
    id: number;
  };
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: {
    error: string;
  };
}

export interface ResetStateAction {
  type: typeof RESET_STATE;
}

export type UserActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | ResetStateAction;
