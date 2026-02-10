export interface SuccessLogin {
  message: string
  user: UserInterface
  token: string
}

export interface FailureLogin {
  message: string
  statusMsg: string
}

export interface UserInterface {
  name: string
  email: string
  role: string
}
export interface RegisterRes {
  message: string
  user: UserRegister
  token: string
}

export interface UserRegister {
  name: string
  email: string
  password: string
}
