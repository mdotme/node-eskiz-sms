export interface EskizAuthLoginPayload {
  email: string;
  password: string;
}

export interface EskizAuthTokenRes {
  message: string | 'token_generated';
  data: {
    token: string;
  };
  token_type: string | 'bearer';
}

export interface EskizAuthUser {
  id: number;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  email: string;
  password: string;
  role: string | 'user';
  status: string | 'active';
  is_vip: boolean;
  balance: number;
}

export interface EskizAuthUserRes {
  status: string | 'success';
  data: EskizAuthUser;
  id: null;
}
