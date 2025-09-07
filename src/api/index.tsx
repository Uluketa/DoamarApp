import axios from 'axios';
import { InitialUserState } from '~/store/modules/user/reducer';
import * as prop from './types/props';
import * as res from './types/response';

export const URL = (__DEV__) ? "192.168.18.8:8000" : "NOT DEFINED";
const API = axios.create({
  baseURL: `http://${URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export async function authLogin({ username, password }: prop.AuthLoginProps):
  Promise<res.AuthLoginReturn> {
  try {
    const { data } = await API.post('/auth/login', {
      username,
      password
    });

    return data;

  } catch (error: any) {
    if (error.response) {
      return {
        ok: "N",
        msg: error.response.data?.msg || "Erro ao processar a solicitação.",
        data: InitialUserState
      };

    } else {
      return {
        ok: "N",
        msg: "Ocorreu um erro. Tente novamente mais tarde!",
        data: InitialUserState
      };
    }
  }
}

export async function clientHome(userId: number, token: string) {
  try {
    const { data } = await API.get(`/home/client/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

export async function listSocialIssues() {
  try {
    const { data } = await API.get(`/social-issues`);
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

export async function getInstitution(id: number) {
  try {
    const { data } = await API.get(`/institutions/${id}`);
    return data;

  } catch (error: any) {
    return {
      ok: "N",
      msg: error.response?.data?.msg || "Erro ao processar a solicitação.",
      ...InitialUserState
    };
  }
}

export async function getOrdersByInstitution(id: number, token: string) {
  try {
    const { data } = await API.get(`/institutions/${id}/orders/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;

  } catch (error: any) {
    return {
      ok: "N",
      msg: error.response?.data?.msg || "Erro ao processar a solicitação.",
      ...InitialUserState
    };
  }
}

export async function getClientFavorites(id: number, token: string) {
  try {
    const { data } = await API.get(`/client-favorites/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    console.log(error.response?.data);
    return {
      ok: "N",
      msg: error.response?.data?.msg || "Erro ao processar a solicitação."
    };
  }
}

export async function fetchCepData(cep: string) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;
    if (data.erro) {
      return {
        ok: "N",
        msg: "CEP não encontrado.",
        cidade: "",
        logradouro: "",
        bairro: "",
        uf: "",
        localidade: "",
        complemento: ""
      };
    }
    return {
      ok: "S",
      msg: "CEP encontrado.",
      cidade: data.localidade || "",
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      uf: data.uf || "",
      localidade: data.localidade || "",
      complemento: data.complemento || ""
    };
  } catch (error) {
    return {
      ok: "N",
      msg: "Erro ao buscar CEP.",
      cidade: "",
      logradouro: "",
      bairro: "",
      uf: "",
      localidade: "",
      complemento: ""
    };
  }
}

export async function saveSignUpData(props: prop.SignUpProps) {
  try {
    let endpoint = '';

    if (props.userType === 'I') {
      endpoint = '/institutions';

    } else if (props.userType === 'C') {
      endpoint = '/clients';

    } else {
      return { ok: 'N', msg: 'Tipo de usuário inválido.' };
    }

    const { data } = await API.post(endpoint, props);
    return data;

  } catch (error: any) {
    console.log(error.response?.data);
    return {
      ok: 'N',
      msg: error.response?.data?.msg || 'Erro ao salvar cadastro.'
    };
  }
}

export async function indexInstitutions(token: string) {
  try {
    const { data } = await API.get(`/institutions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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