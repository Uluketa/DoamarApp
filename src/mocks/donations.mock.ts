import { Donation } from '~/types/entities/Donation';
import { ORDER_TYPES, ORDER_TYPE_ID } from '~/constants/orderTypes';

export const mockDonations: Donation[] = [
  {
    id: 1,
    created_at: '2025-12-12',
    updated_at: '2025-12-12',
    user: {
      id: 1,
      username: 'joao_cliente',
      password: '',
      type: 'client',
      hash: '',
      active: 'S',
      created_at: '',
      updated_at: '',
    },
    order: {
      id: 1,
      name: 'Arroz 5kg',
      has_limit: true,
      limit: 100,
      image_url: 'https://via.placeholder.com/300',
      status: 'completed',
      order_type: {
        ...ORDER_TYPES[ORDER_TYPE_ID.ALIMENTOS],
        active: 'S',
        created_at: '',
        updated_at: '',
      },
      institution: {} as any,
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 2,
    created_at: '2026-01-02',
    updated_at: '2026-01-02',
    user: {
      id: 2,
      username: 'maria_cliente',
      password: '',
      type: 'client',
      hash: '',
      active: 'S',
      created_at: '',
      updated_at: '',
    },
    order: {
      id: 2,
      name: 'Cobertor',
      has_limit: false,
      image_url: 'https://via.placeholder.com/300',
      status: 'completed',
      order_type: {
        ...ORDER_TYPES[ORDER_TYPE_ID.ROUPAS],
        active: 'S',
        created_at: '',
        updated_at: '',
      },
      institution: {} as any,
      created_at: '',
      updated_at: '',
    },
  },
];
