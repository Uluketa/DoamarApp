import axios, { AxiosError } from 'axios';
import { InitialUserState } from '~/store/modules/user/reducer';
import * as prop from './types/props';
import * as res from './types/response';

export const URL = (__DEV__) ? "192.168.18.8:8000" : "NOT DEFINED";
/** Base URL para imagens (precisa do protocolo para Image.uri) */
export const IMAGE_BASE_URL = `http://${URL}`;

// ============================================================
// API Instance Configuration
// ============================================================
const API = axios.create({
  baseURL: `http://${URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ============================================================
// Helper: Error Handler
// ============================================================
const handleApiError = (error: any, defaultMessage: string = "Erro ao processar a solicitação.") => {
  if (error.response?.data?.msg) {
    return error.response.data.msg;
  }
  if (error.response?.status === 401) {
    return "Não autorizado. Faça login novamente.";
  }
  if (error.response?.status === 404) {
    return "Recurso não encontrado.";
  }
  if (error.response?.status === 422) {
    return error.response.data?.msg || "Dados inválidos.";
  }
  if (error.response?.status === 500) {
    return "Erro no servidor. Tente novamente mais tarde.";
  }
  return defaultMessage;
};

// ============================================================
// AUTHENTICATION ENDPOINTS
// ============================================================

export async function authLogin({ username, password }: prop.AuthLoginProps):
  Promise<res.AuthLoginReturn> {
  try {
    const { data } = await API.post('/auth/login', {
      username,
      password
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao fazer login.");
    return {
      ok: "N",
      msg,
      data: InitialUserState
    };
  }
}

export async function authLogout(token: string) {
  try {
    const { data } = await API.post('/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    // Mesmo em erro, consideramos logout bem-sucedido (token será removido localmente)
    const msg = handleApiError(error, "Logout realizado (com aviso do servidor).");
    return {
      ok: "S",
      msg,
      data: null
    };
  }
}

export async function authMe(token: string) {
  try {
    const { data } = await API.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar dados do usuário.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

export async function saveSignUpData(props: prop.SignUpProps) {
  try {
    const endpoint = props.userType === 'I' ? '/institutions' : '/clients';
    
    if (!endpoint || !props.userType) {
      return { ok: 'N', msg: 'Tipo de usuário inválido.' };
    }

    const { data } = await API.post(endpoint, props);
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao salvar cadastro.");
    return { ok: 'N', msg };
  }
}

// ============================================================
// CEP ENDPOINTS (External)
// ============================================================

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

// ============================================================
// CLIENT ENDPOINTS
// ============================================================

export async function clientHome(userId: number, token: string) {
  try {
    const { data } = await API.get(`/home/client/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar dados da home.");
    return {
      ok: "N",
      msg,
      data: { institutions: [], user: InitialUserState }
    };
  }
}

export async function updateClientProfile(
  clientId: number,
  profileData: prop.UpdateClientProfileProps,
  profileImage?: any,
  token?: string
) {
  try {
    // Se houver imagem, usar FormData para multipart
    if (profileImage) {
      const formData = new FormData();
      
      // Adicionar todos os campos do perfil
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key as keyof typeof profileData]);
      });

      // Adicionar imagem
      formData.append('profileImage', {
        uri: profileImage.uri,
        type: profileImage.type || 'image/jpeg',
        name: profileImage.name || `profile-${clientId}.jpg`
      } as any);

      // Do not set explicit Content-Type for multipart FormData here;
      // axios (and the native environment) will add the proper boundary
      // when FormData is provided.
      const { data } = await API.patch(`/clients/${clientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return data;
    } else {
      // Sem imagem, usar JSON
      const { data } = await API.patch(`/clients/${clientId}`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    }
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao atualizar perfil.");
    return {
      ok: "N",
      msg
    };
  }
}

// ============================================================
// INSTITUTION ENDPOINTS
// ============================================================

export async function indexInstitutions(token?: string) {
  try {
    const config = token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};

    const { data } = await API.get(`/institutions`, config);
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao listar instituições.");
    return {
      ok: "N",
      msg,
      data: []
    };
  }
}

export async function getInstitution(id: number, token?: string) {
  try {
    const config = token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};

    const { data } = await API.get(`/institutions/${id}`, config);
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar instituição.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

export async function updateInstitutionProfile(
  institutionId: number,
  profileData: prop.UpdateInstitutionProfileProps,
  token: string
) {
  try {
    const { data } = await API.patch(`/institutions/${institutionId}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao atualizar perfil da instituição.");
    return {
      ok: "N",
      msg
    };
  }
}

// ============================================================
// ORDERS ENDPOINTS
// ============================================================

export async function getOrdersByInstitution(id: number, token?: string) {
  try {
    const config = token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};

    const { data } = await API.get(`/institutions/${id}/orders`, config);
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar pedidos.");
    return {
      ok: "N",
      msg,
      data: []
    };
  }
}

// ============================================================
// DONATIONS ENDPOINTS
// ============================================================

export async function createDonation(userId: number, orderId: number, quantity: number = 1, token: string) {
  try {
    const { data } = await API.post('/donations', {
      user_id: userId,
      order_id: orderId,
      quantity: quantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao criar doação.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

export async function createBulkDonations(donations: Array<{user_id: number, order_id: number, quantity: number}>, token: string) {
  try {
    const { data } = await API.post('/donations', {
      donations
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao criar doações em lote.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

export async function getDonationsByUser(userId: number, token: string) {
  try {
    const { data } = await API.get(`/donations/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar doações do usuário.");
    return {
      ok: "N",
      msg,
      data: []
    };
  }
}

export async function getDonationsByInstitution(institutionId: number, token: string) {
  try {
    const { data } = await API.get(`/donations/institution/${institutionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar doações da instituição.");
    return {
      ok: "N",
      msg,
      data: []
    };
  }
}

export async function updateDonationStatus(
  donationId: number,
  status: 'pending' | 'approved' | 'rejected',
  token: string
) {
  try {
    const { data } = await API.patch(`/donations/${donationId}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao atualizar status da doação.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

// ============================================================
// ORDERS (create by institution)
// ============================================================

export async function createOrder(
  payload: {
    name: string;
    description?: string;
    has_limit: boolean;
    limit?: number | null;
    image_url?: string | null;
    institution_id: number;
    order_type_id: number;
  },
  token: string
) {
  try {
    const { data } = await API.post('/orders', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao criar pedido.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

// ============================================================
// FAVORITES ENDPOINTS
// ============================================================

export async function listSocialIssues() {
  try {
    const { data } = await API.get(`/social-issues`);
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar temas sociais.");
    return {
      ok: "N",
      msg,
      data: []
    };
  }
}

export async function getClientFavorites(clientId: number, token: string) {
  try {
    const { data } = await API.get(`/client-favorites/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao buscar favoritos.");
    return {
      ok: "N",
      msg,
      data: []
    };
  }
}

export async function addFavorite(clientId: number, institutionId: number, token: string) {
  try {
    const { data } = await API.post('/client-favorites', {
      client_id: clientId,
      institution_id: institutionId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao adicionar favorito.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}

export async function removeFavorite(clientId: number, institutionId: number, token: string) {
  try {
    const { data } = await API.delete(`/client-favorites`, {
      data: {
        client_id: clientId,
        institution_id: institutionId
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error: any) {
    const msg = handleApiError(error, "Erro ao remover favorito.");
    return {
      ok: "N",
      msg,
      data: null
    };
  }
}