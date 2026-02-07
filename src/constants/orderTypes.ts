export enum ORDER_TYPE_ID {
  ALIMENTOS = 1,
  UTENSILIOS = 2,
  ROUPAS = 3,
  HIGIENE = 4,
  MATERIAL_ESCOLAR = 5,
}

export const ORDER_TYPES = {
  [ORDER_TYPE_ID.ALIMENTOS]: {
    id: ORDER_TYPE_ID.ALIMENTOS,
    name: 'Alimentos',
    description: 'Pacotes de alimentos para doação',
  },
  [ORDER_TYPE_ID.UTENSILIOS]: {
    id: ORDER_TYPE_ID.UTENSILIOS,
    name: 'Utensílios domésticos',
    description: 'Itens de cozinha e casa',
  },
  [ORDER_TYPE_ID.ROUPAS]: {
    id: ORDER_TYPE_ID.ROUPAS,
    name: 'Roupas',
    description: 'Roupas novas ou usadas em bom estado',
  },
  [ORDER_TYPE_ID.HIGIENE]: {
    id: ORDER_TYPE_ID.HIGIENE,
    name: 'Higiene pessoal',
    description: 'Produtos de higiene pessoal',
  },
  [ORDER_TYPE_ID.MATERIAL_ESCOLAR]: {
    id: ORDER_TYPE_ID.MATERIAL_ESCOLAR,
    name: 'Material escolar',
    description: 'Cadernos, mochilas, lápis, etc',
  },
};
