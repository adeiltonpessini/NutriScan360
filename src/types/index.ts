export type UserRole = 'admin' | 'veterinario' | 'empresa' | 'cliente'

export interface Empresa {
  id: string
  nome: string
  cnpj: string
  email: string
  telefone?: string
  endereco?: string
}

export interface Animal {
  id: string
  nome: string
  especie: string
  raca: string
  idade: number
  peso: number
  empresa_id: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  role: UserRole
  empresa_id?: string
}

export interface Diagnostico {
  id: string
  animal_id: string
  data: string
  resultado: string
  recomendacoes: string
}
