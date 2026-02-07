import { combineReducers } from 'redux';
import userReducer, { UserStateType } from './user/reducer';
import cartReducer, { CartStateType } from './cart/reducer';
import navigationReducer, { NavigationStateType } from './navigation/reducer';
import homeReducer, { HomeStateType } from './home/reducer';
import { AnyAction } from 'redux-saga';

const rootReducer = combineReducers({
  user: userReducer,
  navigation: navigationReducer,
  cart: cartReducer,
  home: homeReducer,
}) as (
  state: {
    user: UserStateType;
    navigation: NavigationStateType;
    cart: CartStateType;
    home: HomeStateType;
  } | undefined,
  action: AnyAction
) => {
  user: UserStateType;
  navigation: NavigationStateType;
  cart: CartStateType;
  home: HomeStateType;
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
