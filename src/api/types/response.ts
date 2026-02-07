import { UserStateType } from '~/store/modules/user/reducer';
import { Client } from '~/types/entities/Client';
import { Institution } from '~/types/entities/Institution';
import { Order } from '~/types/entities/Order';
import { ClientFavorite } from '~/types/entities/ClientFavorite';
import { Donation } from '~/types/entities/Donation';

// ============================================================
// Generic Response Pattern
// ============================================================
export type ResponsePattern<T = any> = {
    ok: "S" | "N";
    msg: string;
    data?: T;
}

// ============================================================
// Auth Responses
// ============================================================
export type AuthLoginReturn = {
    data: UserStateType
} & ResponsePattern;

// ============================================================
// Client Responses
// ============================================================
export type UpdateClientProfileReturn = ResponsePattern<Client>;

// ============================================================
// Institution Responses
// ============================================================
export type UpdateInstitutionProfileReturn = ResponsePattern<Institution>;

// ============================================================
// Order Responses
// ============================================================
export type GetOrdersReturn = ResponsePattern<Order[]>;

// ============================================================
// Donation Responses
// ============================================================
export type CreateDonationReturn = ResponsePattern<Donation>;

// ============================================================
// Favorite Responses
// ============================================================
export type FavoriteReturn = ResponsePattern<ClientFavorite | null>;
export type GetFavoritesReturn = ResponsePattern<ClientFavorite[]>;

