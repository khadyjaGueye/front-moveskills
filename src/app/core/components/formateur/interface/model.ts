export type Root = Root2[]

export interface Root2 {
  id: number
  type: string
  parcours_id: number
  created_at: string
  updated_at: string
  questionstests: Questionstest[]
}

export interface Questionstest {
  id: number
  test_id: number
  question_text: string
  note: string
  created_at: string
  updated_at: string
  choices: Choice[]
}

export interface Choice {
  id: number
  questionstest_id: number
  choice_text: string
  is_correct: number
  created_at: string
  updated_at: string
}



export interface Question {
  id: number;
  text: string;
  choices: {
    id: number;
    text: string;
    is_true: boolean;
  }[];
}

export interface Evaluation {
  type: 'pre' | 'post';
  questions: Question[];
}

export interface Parcours {
  id: number;
  name: string;
  evaluations: Evaluation[];
  user_id: number,
  nom_parcour: string,
  status_audiance: number,
  status_type: number,
  prix: number,
  status: string,
  duree: number,
  created_at: string,
  updated_at: string,
  description: string,
}

export interface ParcourAcheter {
  id: number,
  parcour_id: number,
  user_id: number,
  montant: number,
  created_at: string,
  updated_at: string,
  parcour: Parcours
}
