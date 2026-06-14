export type UserStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
