export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  active?: boolean;
}

export interface GetUserResponse {
  data?: User;
  message?: string;
}

export interface UpdateUserResponse {
  message: string;
  data?: User;
}