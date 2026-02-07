import { TimestampsType } from "../shared/Timestamps";
import { Order } from "./Order";
import { User } from "./User";

export type DonationStatus = 'pending' | 'approved' | 'rejected';

export type Donation = {
    id: number;
    user: User;
    order: Order;
    quantity?: number;
    status?: DonationStatus;
}
    & TimestampsType;