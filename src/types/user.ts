import type { BaseEntity } from './api';

export type UserRole = 'member' | 'admin';

export interface User extends BaseEntity {
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  location: string | null;
  bio: string | null;
  role: UserRole;
  countryId: string | null;
  cityId: string | null;
  countryName: string | null;
  cityName: string | null;
  locationChangedAt: string | null;
}

export interface SignupInput {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  countryId?: string | null;
  cityId?: string | null;
}
