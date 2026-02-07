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

export type UpdateClientProfileProps = {
    name?: string;
    email?: string;
    cellphone?: string;
    cpf?: string;
    addressLine?: string;
    addressNumber?: string;
    addressCep?: string;
    addressCity?: string;
    addressState?: string;
    addressNeighborhood?: string;
    addressComplement?: string;
    addressReference?: string;
    accountType?: "D" | "R" | "B";
}

export type UpdateInstitutionProfileProps = {
    name?: string;
    email?: string;
    cellphone?: string;
    cnpj?: string;
    addressLine?: string;
    addressNumber?: string;
    addressCep?: string;
    addressCity?: string;
    addressState?: string;
    addressNeighborhood?: string;
    addressComplement?: string;
    addressReference?: string;
    accountType?: "D" | "R" | "B";
    social_issue_id?: number;
}