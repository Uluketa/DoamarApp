import { Order } from '~/types/entities/Order';
import { mockInstitution } from './institution.mock';
import { mockOrderType } from './order-type.mock';

export const mockOrders: Order[] = [
  {
    id: 1,
    name: 'Cestas Básicas',
    description: 'Alimentos não perecíveis',
    has_limit: true,
    limit: 100,
    image_url: undefined,
    status: 'available',
    institution: mockInstitution,
    order_type: mockOrderType,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
];
