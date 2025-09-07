import { combineReducers } from 'redux';
import userReducer, { UserStateType } from './user/reducer';
import navigationReducer, { NavigationStateType } from './navigation/reducer';
import { AnyAction } from 'redux-saga';

const rootReducer = combineReducers({
  user: userReducer,
  navigation: navigationReducer
}) as (
  state: {
    user: UserStateType,
    navigation: NavigationStateType
  } | undefined, action: AnyAction) => { user: UserStateType, navigation: NavigationStateType };

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
