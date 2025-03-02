import { combineReducers } from 'redux';
import userReducer, { UserState } from './user/reducer';
import { AnyAction } from 'redux-saga';

const rootReducer = combineReducers({
  user: userReducer,
}) as (state: { user: UserState } | undefined, action: AnyAction) => { user: UserState };

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
