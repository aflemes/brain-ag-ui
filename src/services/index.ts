import api from './api';
import type { Produtor, Propriedade, Cultura, Safra } from '../interfaces';

export const ProdutorService = {
  getAll: () => api.get<Produtor[]>('/produtores'),
  getById: (id: number) => api.get<Produtor>(`/produtores/${id}`),
  create: (produtor: Omit<Produtor, 'id'>) => api.post<Produtor>('/produtores', produtor),
  update: (id: number, produtor: Partial<Produtor>) => api.patch<Produtor>(`/produtores/${id}`, produtor),
  delete: (id: number) => api.delete(`/produtores/${id}`),
};

export const PropriedadeService = {
  getAll: () => api.get<Propriedade[]>('/propriedades'),
  getById: (id: number) => api.get<Propriedade>(`/propriedades/${id}`),
  create: (propriedade: Omit<Propriedade, 'id'>) => api.post<Propriedade>('/propriedades', propriedade),
  update: (id: number, propriedade: Partial<Propriedade>) => api.patch<Propriedade>(`/propriedades/${id}`, propriedade),
  delete: (id: number) => api.delete(`/propriedades/${id}`),
};

export const CulturaService = {
  getAll: () => api.get<Cultura[]>('/culturas'),
  getById: (id: number) => api.get<Cultura>(`/culturas/${id}`),
  create: (cultura: Omit<Cultura, 'id'>) => api.post<Cultura>('/culturas', cultura),
  update: (id: number, cultura: Partial<Cultura>) => api.patch<Cultura>(`/culturas/${id}`, cultura),
  delete: (id: number) => api.delete(`/culturas/${id}`),
};

export const SafraService = {
  getAll: () => api.get<Safra[]>('/safras'),
  getById: (id: number) => api.get<Safra>(`/safras/${id}`),
  create: (safra: Omit<Safra, 'id'>) => api.post<Safra>('/safras', safra),
  update: (id: number, safra: Partial<Safra>) => api.patch<Safra>(`/safras/${id}`, safra),
  delete: (id: number) => api.delete(`/safras/${id}`),
};
