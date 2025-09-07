import { ActiveType } from "../shared/Active";
import { TimestampsType } from "../shared/Timestamps";

export type OrderType = {
    id: number;
    name: string;
    description: string;
}
    & ActiveType
    & TimestampsType;