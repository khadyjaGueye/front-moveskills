import { UserInfo } from "../auth/interfaces/auth-interface"
import { Apprenant } from "../core/components/apprenant/interface/apprenant"


export interface Model<T> {
  data: T
}

export interface Data {
  userInfo: UserInfo
  message: string
  apprenants: Apprenant[]
  videos: ContentItem[]
  documents: ContentItem[]
  token: string
  status_code: number
  parcour: InfoData
  parcours: Parcour[]
  statusCode: boolean
  videos1: Video[]
  chapitres:Chapitre[];
  chapitre_id: string
  contenu: Contenu[]
}
export interface Question {
  text: string;
  answers: Answer[];
}
export interface Scores {
  red: number;
  green: number;
  blue: number;
  yellow: number;
}
export interface Competences {
  id: number
  nom: string
}


export interface Skill {
  id: number;
  name: string;
}

export interface InfoData {
  id?: number
  nom_parcour: string;
  objectif: string;
  status_type: number;
  status_audiance: number;
  duree: number;
  competences: string[];
  status_disponibilite: number
  prix: number
}

export interface ContentData {
  video: File[] | null;
  document: File[] | null;
}

export interface SummaryData {
  confirmation: boolean;
}

// Définir l'interface complète du formulaire
export interface FormDataT {
  info: InfoData;
  content: ContentData;
  summary: SummaryData;
}

export interface Document {
  name: string;
  url: string;
  type: string;
}

export interface VideoFile extends File {
  id: number; // Ajoute des propriétés supplémentaires si nécessaire
  name: string; // Nom de la vidéo
  url: string; // URL ou chemin vers la vidéo
}

export interface MyDocument {
  id: number;
  name: string;
  url: string;
}
export interface Role {
  id: number
  nom: string
}
export interface Answer {
  text: string;
  points: number;
  color: string;
}
export interface Parcour {
  id: number;
  nom_parcour: string;
  objectif: string;
  type: number;
  prix: number;
  duree: number;
  competences: Competences[];
  videos: Document[];
  documents: Document[];
  status_type: number
  status_audiance: number;
  status_disponibilite: string
}
export interface ContentItem {
  id: number
  name: string;
  url: string;
  type: string;
  parcour_id: number
  file_path: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: number
  parcour_id: number
  file_path: string
  created_at: string
  updated_at: string
}

export interface Chapitre {
  id: number;
  nom_chapitre: string;
  parcour_id:number
}
export interface Contenu {
  id: number
  libelle: string
  file_path: string
  created_at: string
  is_viewed?: boolean
  is_watched?: boolean
}
