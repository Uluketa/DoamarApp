import { ActiveType } from "../shared/Active";
import { Client } from "./Client"
import { Institution } from "./Institution";
import { TimestampsType } from "../shared/Timestamps";

export type ClientFavorite = {
    client: Client;
    institution: Institution;
}
    & ActiveType
    & TimestampsType;