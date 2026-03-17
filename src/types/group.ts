export type GroupRole = 'admin' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  isPublic: boolean;
  memberCount: number;
  myRole: GroupRole | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: GroupRole;
  joinedAt: string;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string | null;
  isPublic?: boolean;
}

export interface CustomLeaderboard {
  id: string;
  name: string;
  groupId: string | null;
  createdBy: string;
  provisionalThreshold: number;
  isPublic: boolean;
  memberCount: number;
  createdAt: string;
}

export interface CreateCustomLeaderboardInput {
  name: string;
  groupId?: string;
  provisionalThreshold?: number;
  isPublic?: boolean;
}

export interface UpdateCustomLeaderboardInput {
  name?: string;
  provisionalThreshold?: number;
  isPublic?: boolean;
}
