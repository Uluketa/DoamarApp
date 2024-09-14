import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './actions';
import { URL } from '~/core/helpers';

interface LoginResponse {
  userType: string;
  typeDonation: string;
  userId: number | string;
  error: string | null;
}

interface LoginAction {
  type: string;
  payload: {
    login: string;
    password: string;
  };
}

function* loginUserSaga(action: LoginAction): Generator<any, void, AxiosResponse<LoginResponse>> {
  try {
    const response = yield call(axios.post, `http://${URL}/api/login`, {
      login: action.payload.login,
      senha: action.payload.password,
    });

    const data = response.data;

    if (data.error) {
      yield put({ type: LOGIN_FAILURE, payload: { error: data.error } });
    } else {
      yield put({
        type: LOGIN_SUCCESS,
        payload: {
          userType: data.userType,
          typeDonation: data.typeDonation,
          id: data.userId,
        },
      });
    }
  } catch (error) {
    yield put({ type: LOGIN_FAILURE, payload: { error: 'Login failed' } });
  }
}

function* watchLoginRequest() {
  yield takeLatest(LOGIN_REQUEST, loginUserSaga);
}

export default function* userSaga() {
  yield all([watchLoginRequest()]);
}
