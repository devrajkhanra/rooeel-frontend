export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: AuthUser;
}
