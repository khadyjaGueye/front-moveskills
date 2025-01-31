import { User } from "../../../../interfaces/model"

export interface Formateur {
  id: number
  name: string
  email: string
}

export interface Vente {
  id: number
  name: string
  email: string
  purchased_parcours: PurchasedParcour[]
}

export interface Inscrit {
  id: number
  name: string
  email: string
}

export interface PurchasedParcour {
  id: number
  nom_parcour: string
  pivot: Pivot
}

export interface Pivot {
  user_id: number
  parcour_id: number
  created_at: string
  updated_at: string
}

export interface Inscrit {
  id: number
  name: string
  email: string
}

export interface ApprenantsAyantAchete {
  id: number
  name: string
  email: string
}

export interface TopParcour {
  id: number
  nom_parcour: string
  total_achats: number
  user:User
}
