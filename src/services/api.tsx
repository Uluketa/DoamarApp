import loginData from '../../api/login.json';

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

export async function login(login: string, password: string): Promise<{ typeUser?: string, id?: string, receiveDonationQuest?: boolean, error: boolean, errormsg: string }> {
  try {
    const { login: storedLogin, password: storedPassword, typeUser, id, receiveDonationQuest, error, errormsg } = loginData as UserData;

    if (login === storedLogin && password === storedPassword) {
      return { typeUser, id, receiveDonationQuest, error: false, errormsg: '' };
    }

    return { typeUser: '', id: '', receiveDonationQuest: false, error: true, errormsg: 'Login ou senha incorretos' };

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { typeUser: '', id: '', receiveDonationQuest: false, error: true, errormsg: 'Erro ao processar a solicitação' };
  }
}
