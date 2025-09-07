import { TimestampsType } from "../shared/Timestamps";
import { Order } from "./Order";
import { User } from "./User";

export type Donation = {
    id: number;
    user: User;
    order: Order;
}
    & TimestampsType;