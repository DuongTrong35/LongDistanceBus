export type RegisterRequest = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  fullName: string;
};
