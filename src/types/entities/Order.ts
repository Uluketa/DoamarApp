import { TimestampsType } from "../shared/Timestamps";
import { Institution } from "./Institution";
import { OrderType } from "./OrderType";

export type Order = {
  id: number;
  name: string;
  description?: string;
  has_limit: boolean;
  limit?: number | null;
  image_url?: string;
  order_type: OrderType;
  institution: Institution;
}
  & OrderStatusType
  & TimestampsType;

export type OrderStatusType = {
  status: 'available' | 'canceled' | 'completed'
}
