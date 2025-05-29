export interface Produtor {
  id?: number;
  nome: string;
  documento: string;
  propriedades: Propriedade[];
}

export interface Propriedade {
  id?: number;
  nome: string;
  cidade: string;
  estado: string;
  area_total: number;
  area_agricultavel: number;
  area_vegetacao: number;
  produtor_id: number;
}

export interface Cultura {
  id?: number;
  nome: string;
}

export interface Safra {
  id?: number;
  ano: number;
  area_plantada: number;
  observacoes?: string;
  cultura_id: number;
  propriedade_id: number;
}
