
export interface UserInfo {
  id: number
  name: string
  prenom: string
  email: string
  password: string
  role: string
  phoneNumber: number
  password_confirmation: string
  Code_invitaion:string
}

export interface ResetPassword {
  email: string
  token: string
  password: string
  password_confirmation: string
}
