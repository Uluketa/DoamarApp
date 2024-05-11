import loginData from '../api/login.json';

interface UserData {
  id: string;
  login: string;
  password: string;
  typeUser: string;
  hash: string;
  receiveDonationQuest: boolean;
  error: boolean;
  errormsg: string;
}

export async function login(login: string, password: string): Promise<{ success: boolean, typeUser?: string, id?: string, receiveDonationQuest?: boolean}> {
  try {
    const { login: storedLogin, password: storedPassword, typeUser, id, receiveDonationQuest } = loginData as UserData;
    if (login === storedLogin && password === storedPassword) {
      return { success: true, typeUser, receiveDonationQuest };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false };
  }
}
