import { ActiveType } from "../shared/Active";
import { AddressType } from "../shared/Address";
import { TimestampsType } from "../shared/Timestamps";
import { SocialIssue } from "./SocialIssue";

export type Institution = {
    id: number,
    name: string,
    email: string,
    cellphone: number,
    cnpj: string,
    pathLogoImage?: string,
    pathBackgroundImage?: string,
    accountType: 'R' | 'D' | 'B',
    social_issue: SocialIssue
}
    & AddressType
    & TimestampsType
    & ActiveType;

export const InitialInstitutionState = {
    id: 0,
    name: '',
    email: '',
    cellphone: 0,
    cnpj: '',
    addressLine: '',
    addressNumber: '',
    addressCep: '',
    addressCity: '',
    addressState: '',
    addressNeighborhood: '',
    addressComplement: '',
    addressReference: '',
    accountType: 'R',
    active: 'S'
}