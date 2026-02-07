import { Institution } from '~/types/entities/Institution';

export const mockInstitution: Institution = {
  id: 1,
  name: 'Instituto Esperança',
  email: 'contato@instituto.org',
  cellphone: 11999999999,
  cnpj: '00.000.000/0001-00',
  accountType: 'R',
  pathLogoImage: undefined,
  pathBackgroundImage: undefined,

  social_issue: {
    id: 1,
    title: 'Combate à fome',
    description: 'Ajuda alimentar',
    created_at: '',
    updated_at: '',
    icon: 'alert',
    pathImage: ''
  },

  addressLine: '',
  addressNumber: '',
  addressCep: '',
  addressCity: '',
  addressState: '',
  addressNeighborhood: '',
  addressComplement: '',
  addressReference: '',

  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  active: 'S',
};
