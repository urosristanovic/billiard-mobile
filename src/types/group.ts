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
  description: string | null;
  groupId: string | null;
  createdBy: string;
  provisionalThreshold: number;
  isPublic: boolean;
  memberCount: number;
  createdAt: string;
  /** Present in list responses */
  isCreator?: boolean;
  /** Present in list responses for leaderboards the user created */
  pendingCount?: number;
}

export interface BrowseLeaderboardResult extends CustomLeaderboard {
  isMember: boolean;
  isPending: boolean;
}

export type MembershipStatus = 'active' | 'pending';

export interface CreateCustomLeaderboardInput {
  name: string;
  description?: string;
  provisionalThreshold?: number;
  isPublic?: boolean;
}

export interface UpdateCustomLeaderboardInput {
  name?: string;
  description?: string | null;
  provisionalThreshold?: number;
  isPublic?: boolean;
}
