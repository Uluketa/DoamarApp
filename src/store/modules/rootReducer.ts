import { combineReducers } from 'redux';
import userReducer, { UserStateType } from './user/reducer';
import cartReducer, { CartStateType } from './cart/reducer';
import navigationReducer, { NavigationStateType } from './navigation/reducer';
import { AnyAction } from 'redux-saga';

const rootReducer = combineReducers({
  user: userReducer,
  navigation: navigationReducer,
  cart: cartReducer
}) as (
  state: {
    user: UserStateType,
    navigation: NavigationStateType,
    cart: CartStateType
  } | undefined, action: AnyAction) => {
    user: UserStateType,
    navigation: NavigationStateType,
    cart: CartStateType
  };

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
