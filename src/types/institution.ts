export type InstitutionType = {
    id: number,
    name: string,
    email: string,
    cellphone: number,
    cnpj: string,
    address: string,
    addressNumber: number,
    addressCep: string,
    complement: string,
    reference: string,
    assets: string,
    accountType: 'R' | 'D' | 'B',
    active: 'S' | 'N',
    background: string | null,
    logo: string | null,
    created_at: string | null,
    updated_at: string | null
}

export const InitialInstitutionState = {
    id: 0,
    name: '',
    email: '',
    cellphone: 0,
    cnpj: '',
    address: '',
    addressNumber: 0,
    addressCep: '',
    complement: '',
    reference: '',
    assets: '',
    accountType: 'R',
    active: 'S',
    created_at: null,
    updated_at: null
}