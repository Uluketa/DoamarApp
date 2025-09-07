import { ActiveType } from "../shared/Active";
import { AddressType } from "../shared/Address";
import { TimestampsType } from "../shared/Timestamps";

export type Client = {
    id: number,
    name: string,
    email: string,
    cellphone: string,
    cpf: string,
    pathProfileImage?: string,
    accountType: 'R' | 'D' | 'B'
} & AddressType & TimestampsType & ActiveType;

export const InitialClientState: Client = {
    id: 0,
    name: '',
    email: '',
    cellphone: '',
    cpf: '',
    addressLine: '',
    addressNumber: '',
    addressCep: '',
    addressCity: '',
    addressState: '',
    addressNeighborhood: '',
    addressComplement: '',
    addressReference: '',
    active: 'S',
    accountType: 'R'
}