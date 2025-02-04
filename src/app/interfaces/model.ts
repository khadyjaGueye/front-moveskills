import { UserInfo } from "../auth/interfaces/auth-interface"
import { ApprenantsAyantAchete, Formateur, Inscrit, TopParcour, Vente } from "../core/components/admin/interface/model"
import { Apprenant } from "../core/components/apprenant/interface/apprenant"
import { Parcours } from "../core/components/formateur/interface/model"


export interface Model<T> {
  data: T
  status: string
}

export interface Data {
  userInfo: UserInfo
  token: string
  status_code: number
  message: string
  apprenants: Apprenant[]
  videos: ContentItem[]
  documents: ContentItem[]
  parcour: InfoData
  parcours: Parcour[]
  statusCode: boolean
  videos1: Video[]
  chapitres: Chapitre[];
  chapitre_id: string
  contenu: Contenu[]
  users: User[]
  tests: Test[];
  competences: Competence[];
  skills: Skill[];
  userDetails: UserDetail[];
  lois: Lois[];
  report: Report;
  resultats: ResultatLois[]
  affiliations: Affiliation[]
  parcoursAcheter: ParcourAcheter[]
  formateurs: User[];
  // formateurs: Formateur[]
  ventes: Vente[]
  inscrits: Inscrit[]
  apprenants_ayant_achete: ApprenantsAyantAchete[]
  inscriptions_par_mois: number[]
  months: string[]
  parcours_par_mois: number[]
  top_parcours: TopParcour[]
  total_vente: number;
  profils: Profil[];
  citations: Citation[];
  //c'est la partie formateur
  nombreAchat: number
  transactions: Transactions[]
  parcoursPlusAchetes: ParcoursPlusAchetes[]
  totalAffilition: User[]
  registeredAffiliations: User[]
  notregisteredAffiliations: User[]
  userAchetesParcourDetails: any[]
  vente_par_mois: number[];
  totalRevenu: number;
  nombreTotalParcours: Parcour[];
  nombreTotalSuperviseur: User[]
  nombreParcourPublie: Parcour[];
  nombreParcourNonPublie: Parcour[]
  nombreParcourAchete: NombreParcourAchete[];
  data: Citation[];
  listeParcoursAchete: Parcours[];
  nombreTestFait: number;
  nombreparcourAchete: number;
  //c'est la partie admi top_parcours:TopParcour[]
}

export interface Transactions {
  id: number;
  user_name: string;
  parcour_name: string
  parcour_prix: number
  purchase_date: string

}

export interface ParcoursPlusAchetes {
  id: number
  parcour_name: string
  total_achats: number
}

export interface NombreParcourAchete{
  parcour_id:number
  parcour:Parcour

}

export interface UserAchetesParcourDetails {
  id: number
  user_name: string
  user_email: string
  purchase_date: string
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
  nom: string
}

export interface InfoData {
  id?: number
  nom_parcour: string;
  objectif: string;
  status_type: string;
  status_audiance: string;
  duree: number;
  competences: string[];
  status_disponibilite: number
  prix: number;
  image: string;
  description: string;
  profils: number[];
  aptitudes: number[];

}

export interface ContentData {
  videos: File[] | null;
  documents: File[] | null;
}

export interface SummaryData {
  confirmation: boolean;
}

// Définir l'interface complète du formulaire
export interface FormDataT {
  info: InfoData;
  content: ContentData;
  summary: SummaryData;
  libelle: string;
  chapitre_id: number
}

//Definir l'interface pour ajouter des videos

export interface FormDataVideo {
  content: ContentData;
  libelle: string;
  chapitre_id: number
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
  user: User
  nombre_videos: number
  nombre_documents: number
  image: string;
  description: string;
  tests_pre_evaluation: TestsPreEvaluation;
  status:string
  created_at:string
}

export interface TestsPreEvaluation {
  id: number;
  parour_id: number;
  type: string;
  test: TestEvaluation[];
}

export interface TestEvaluation {
  id: number;
  test_id: number
  question_text: string;
  note: number;
  created_at: string;
  user: User;
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
  parcour_id: number;
  updated_at: string

}
export interface Contenu {
  id: number
  libelle: string
  file_path: string
  created_at: string
  is_viewed?: boolean
  is_watched?: boolean
}

export interface User {
  id: number;
  phoneNumber: number;
  name: string;
  email: string;
  code_invitaion: string;
  role: string
  question1: Question1[];
  created_at: string
}
export interface Question1 {
  id: number;
  user_id: number;
  rouge: number;
  vert: number;
  jaune: number;
  bleu: number;
}
export interface Test {
  rouge: number
  vert: number
  bleu: number
  jaune: number
  dominant_color: string
  timestamp: string
}

export interface Competence {
  id: number;
  nom: string;
  created_at: string;
  updated_at: string;
}

export interface UserDetail {
  id: number
  name: string
  email: string
  couleur_dominante: string
}

export interface Report {
  total_participants: number
  color_distribution: ColorDistribution
  percentage_distribution: PercentageDistribution
}

export interface ColorDistribution {
  vert: number
  jaune: number
  rouge: number
  bleu: number
}

export interface PercentageDistribution {
  vert: number
  jaune: number
  rouge: number
  bleu: number
}
export interface Item {
  name: string;
  color: string;
  target: number;
  counter: number;
  startAngle?: number;
}

export interface Lois {
  id: number
  title: string
  description: string
  questions: Question1[]
  scores: number[]
  total: number
  evaluation: string
}

export interface Question1 {
  id: number
  question: string
}

export interface AutoEvaluation {
  loi: string;
  description: string
  total: number
  evaluation: string
}

export interface ResultatLois {
  id: number
  user: User
  description: string
  lois: Lois[]
  auto_evaluation: AutoEvaluation[]
  created_at: string;
}

export interface Affiliation {
  id: number
  nom: string
  prenom: string
  email: string
  password: string
  role: string
  numero: number
  password_confirmation: string
  code: string
  isInscrit: number
  created_at: string
}


export interface ParcourAcheter {
  id: number
  nom_parcour: string;
  description: string;
  duree: number;
}

export interface Profil {
  id: number;
  libelle: string;
  aptitudes: Aptitude[];
  created_at: string

}

export interface Aptitude {
  id: number;
  libelle: string;
  profid_id: number;
  created_at: string
}

export interface Citation {
  id: number;
  libelle: string;
  content: string;
  auteur: string;
  created_at:string
}
