import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const URL = (__DEV__) ? "192.168.15.3:8080" : "NOT DEFINED";

interface LoginData {
  error: boolean;
  msg: string;
  userId: number|null;
  userType: string|null;
  typeDonation: string|null;
}

export async function login(login: string, password: string): Promise<LoginData> {
  try {
    const response = await axios.post(`http://${URL}/api/login`, {
      login,
      senha: password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = response.data;

    return {
      error: data.error,
      msg: data.msg,
      userId: data.userId,
      userType: data.userType,
      typeDonation: data.typeDonation
    };

  } catch (error: any) {

    if (error.response) {
      return {
        error: true,
        msg: error.response.data?.msg || "Erro ao processar a solicitação.",
        userType: null,
        typeDonation: null
      };
    } else {
      return {
        error: true,
        msg: "Ocorreu um erro. Tente novamente mais tarde!",
        userType: null,
        typeDonation: null
      };
    }
  }
}
