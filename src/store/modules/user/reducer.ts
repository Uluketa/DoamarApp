import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  RESET_STATE,
  UserActionTypes,
} from './actions';

interface UserState {
  userType: 'cliente' | 'instituicao' | null;
  typeDonation: string | null;
  id: number | null;
  error: string | null;
}

const initialState: UserState = {
  userType: null,
  typeDonation: null,
  id: null,
  error: null,
};

export default function userReducer(state = initialState, action: UserActionTypes): UserState {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        userType: action.payload.userType,
        typeDonation: action.payload.typeDonation,
        id: action.payload.id,
        error: null, 
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error, 
      };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}
