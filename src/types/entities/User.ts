import { ActiveType } from "../shared/Active";
import { TimestampsType } from "../shared/Timestamps";
import { Client } from "./Client";
import { Donation } from "./Donation";
import { Institution } from "./Institution";
import { UserClassification } from "./UserClassification";

export type User = {
    id: number;
    username: string;
    password?: string;
    type: 'client' | 'institution';
    hash: string;
    client?: Client;
    institution?: Institution;
    classification?: UserClassification;
    donations?: Array<Donation>;
}
    & ActiveType
    & TimestampsType;

export const InitialUserState: User = {
    id: 0,
    username: '',
    password: '',
    type: 'client',
    hash: '',
    client: undefined,
    institution: undefined,
    active: 'S'
}