import { TimestampsType } from "../shared/Timestamps";
import { User } from "./User";

export type UserClassification = {
    id: number;
    user: User;
    rating?: number;
}
    & TimestampsType;