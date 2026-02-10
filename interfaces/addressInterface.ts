export interface Address {
  _id: string;
  name?: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddAddressResponse {
  status: string;
  message: string;
  data?: Address;
}

export interface GetAddressesResponse {
  status: string;
  results?: number;
  data?: Address[];
}
