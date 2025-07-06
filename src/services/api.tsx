import axios from 'axios';
import { InitialUserState, UserStateType } from '~/store/modules/user/reducer';

export const URL = (__DEV__) ? "192.168.15.17:8000" : "NOT DEFINED";
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

export async function listHomeClient(userId: number) {
  try {
    const { data } = await API.get(`/listHomeClient/${userId}`);
    return data;

  } catch (error: any) {
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

export async function listSocialIssues() {
  try {
    const { data } = await API.get(`/social-issues/`);
    return data;

  } catch (error: any) {
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

export async function listInstitution(id: number) {
  try {
    const { data } = await API.get(`/company/${id}/list`);
    return data;

  } catch (error: any) {
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

export async function getDonationsByInstitution(id: number) {
  try {
    const { data } = await API.get(`/company/${id}/donations`);
    return data;

  } catch (error: any) {
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

export async function getClientFavorites(id: number) {
  try {
    const { data } = await API.get(`/user/${id}/favorites`);
    return data;

  } catch (error: any) {
    if (error.response) {
      return {
        ok: "N",
        msg: error.response.data?.msg || "Erro ao processar a solicitação."
      };

    } else {
      return {
        ok: "N",
        msg: "Ocorreu um erro. Tente novamente mais tarde!"
      };
    }
  }
}