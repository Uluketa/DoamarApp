import axios from 'axios';
import { InitialUserState, UserStateType } from '~/store/modules/user/reducer';

const URL = (__DEV__) ? "192.168.15.17:8000" : "NOT DEFINED";
const API = axios.create({
  baseURL: `http://${URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

type ResponsePattern = {
  ok: "S" | "N";
  msg: string;
}

type AuthLoginReturnType = ResponsePattern & UserStateType;

type AuthLoginProps = {
  username: string;
  password: string;
}

export async function authLogin({ username, password }: AuthLoginProps): Promise<AuthLoginReturnType> {
  try {
    const { data } = await API.post('/authLogin', {
      username,
      password
    });

    return data;

  } catch (error: any) {
    console.log(error)
    if (error.response) {
      return {
        ok: "N",
        msg: error.response.data?.msg || "Erro ao processar a solicitação.",
        ...InitialUserState
      };

    } else {
      return {
        ok: "N",
        msg: "Ocorreu um erro. Tente novamente mais tarde!",
        ...InitialUserState
      };
    }
  }
}
