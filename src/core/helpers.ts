import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export const TOKEN = '1g0273nbj1h4398dsn329uis2113x4';
export const EMAIL = 'doamarapp@gmail.com';
export const URL = '127.0.0.1:8000';

export const PATH_INSTITUTION_PHOTO = '/storage/profile/institution.png';
export const PATH_INSTITUTION_COVER = '/storage/profile/institution_background.png'
export const PATH_CLIENT_PHOTO = '/storage/profile/client.png';

export const conectado = async () => {
  const response = await NetInfo.fetch();

  return response.isConnected;
};

export const timestamp = () => {
  const data = new Date();

  const dia = data.getDate();
  const mes = data.getMonth();
  const ano = data.getFullYear();

  const hora = data.getHours();
  const minutos = data.getMinutes();
  const segundos = data.getSeconds();

  const dataFormatada = `${ano}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;

  return dataFormatada;
};

export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';

  return cnpj
    .replace(/\D/g, '') // Remove todos os não números
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export const normalizeUri = (uri: string) => {
  if (Platform.OS === 'android' && !uri.startsWith('file://')) {
    return 'file://' + uri;
  }
  return uri;
};

export const getImageData = (uri: string) => {
  const extension = uri.split('.').pop()?.toLowerCase();

  let type = 'image/jpeg';
  if (extension === 'png') type = 'image/png';
  if (extension === 'jpg' || extension === 'jpeg') type = 'image/jpeg';

  return { type, extension };
};

