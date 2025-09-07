import { UserStateType } from '~/store/modules/user/reducer';

export type ResponsePattern = {
    ok: "S" | "N";
    msg: string;
}

export type AuthLoginReturn = {
    data: UserStateType
} & ResponsePattern;

