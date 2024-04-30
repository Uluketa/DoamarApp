import loginData from '../api/login.json';

interface UserData {
  login: string;
  password: string;
  typeUser: string;
  hash: string;
  id: string;
}

export async function login(login: string, password: string): Promise<{ success: boolean, typeUser?: string, id?: string }> {
  try {
    const { login: storedLogin, password: storedPassword, typeUser, id } = loginData as UserData;
    if (login === storedLogin && password === storedPassword) {
      return { success: true, typeUser, id };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false };
  }
}
