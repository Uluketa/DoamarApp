import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN = "1g0273nbj1h4398dsn329uis2113x4";
export const URL = "192.168.15.3:8080";

export const conectado = async () => {
    const response = await NetInfo.fetch();
    
    return response.isConnected;
}

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
}