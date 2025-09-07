export type AuthLoginProps = {
    username: string;
    password: string;
}

export type SignUpProps = {
    name: string;
    email: string;
    cellphone: string;
    addressLine: string;
    addressCep: string;
    addressNumber: string;
    addressNeighborhood: string;
    addressCity: string;
    addressState: string;
    addressComplement?: string;
    addressReference?: string;
    username: string;
    password: string;
    accountType: "D" | "R";
    cpf?: string;
    cnpj?: string;
    userType: "C" | "I";
}