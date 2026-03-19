import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/theme';

import MatchHistoryScreen from '@/screens/match/MatchHistoryScreen';
import MatchDetailScreen from '@/screens/match/MatchDetailScreen';
import CreateMatchScreen from '@/screens/match/CreateMatchScreen';
import UserSearchScreen from '@/screens/match/UserSearchScreen';
import ProfileScreen from '@/screens/user/ProfileScreen';
import ProfileSetupScreen from '@/screens/user/ProfileSetupScreen';
import ChangePasswordScreen from '@/screens/user/ChangePasswordScreen';
import type { UserSearchResult } from '@/services/user';
import type { Tournament } from '@/types/tournament';

import {
  TournamentsHomeScreen,
  CreateTournamentScreen,
  BrowseTournamentsScreen,
  TournamentDetailScreen,
  InvitationDetailScreen,
  InviteParticipantsScreen,
} from '@/screens/tournament';

import LeaderboardMainScreen from '@/screens/leaderboard/LeaderboardScreen';
import PlayerProfileScreen from '@/screens/leaderboard/PlayerProfileScreen';
import LeaderboardUserSearchScreen from '@/screens/leaderboard/UserSearchScreen';
import CreateGroupScreen from '@/screens/leaderboard/CreateGroupScreen';
import GroupDetailScreen from '@/screens/leaderboard/GroupDetailScreen';
import CreateCustomLeaderboardScreen from '@/screens/leaderboard/CreateCustomLeaderboardScreen';
import CustomLeaderboardDetailScreen from '@/screens/leaderboard/CustomLeaderboardDetailScreen';

// ─── Stack param lists ────────────────────────────────────────────────────────

export type LeaderboardStackParamList = {
  LeaderboardMain: undefined;
  PlayerProfile: { userId: string };
  UserSearch: { groupId?: string; leaderboardId?: string } | undefined;
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
  CustomLeaderboardDetail: { leaderboardId: string };
  CreateCustomLeaderboard: undefined;
};

export type MatchesStackParamList = {
  MatchHistory: undefined;
  MatchDetail: { matchId: string };
  Profile: undefined;
  ProfileSetup: undefined;
  ChangePassword: undefined;
};

export type CreateMatchStackParamList = {
  CreateMatch: { selectedOpponent?: UserSearchResult };
  UserSearch: { excludeId?: string };
};

export type TournamentsStackParamList = {
  TournamentsHome: undefined;
  CreateTournament: { tournament?: Tournament } | undefined;
  BrowseTournaments: undefined;
  TournamentDetail: { tournamentId: string };
  InvitationDetail: { requestId: string };
  InviteParticipants: { tournamentId: string };
};

// ─── Stacks ───────────────────────────────────────────────────────────────────

const MatchesStack = createNativeStackNavigator<MatchesStackParamList>();
const MatchesNavigator = () => (
  <MatchesStack.Navigator screenOptions={{ headerShown: false }}>
    <MatchesStack.Screen name='MatchHistory' component={MatchHistoryScreen} />
    <MatchesStack.Screen name='MatchDetail' component={MatchDetailScreen} />
    <MatchesStack.Screen name='Profile' component={ProfileScreen} />
    <MatchesStack.Screen name='ProfileSetup' component={ProfileSetupScreen} />
    <MatchesStack.Screen
      name='ChangePassword'
      component={ChangePasswordScreen}
    />
  </MatchesStack.Navigator>
);

const CreateStack = createNativeStackNavigator<CreateMatchStackParamList>();
const CreateMatchNavigator = () => (
  <CreateStack.Navigator screenOptions={{ headerShown: false }}>
    <CreateStack.Screen
      name='CreateMatch'
      component={CreateMatchScreen}
      initialParams={{}}
    />
    <CreateStack.Screen name='UserSearch' component={UserSearchScreen} />
  </CreateStack.Navigator>
);

const TournamentsStack = createNativeStackNavigator<TournamentsStackParamList>();
const TournamentsNavigator = () => (
  <TournamentsStack.Navigator screenOptions={{ headerShown: false }}>
    <TournamentsStack.Screen
      name='TournamentsHome'
      component={TournamentsHomeScreen}
    />
    <TournamentsStack.Screen
      name='CreateTournament'
      component={CreateTournamentScreen}
    />
    <TournamentsStack.Screen
      name='BrowseTournaments'
      component={BrowseTournamentsScreen}
    />
    <TournamentsStack.Screen
      name='TournamentDetail'
      component={TournamentDetailScreen}
    />
    <TournamentsStack.Screen
      name='InvitationDetail'
      component={InvitationDetailScreen}
    />
    <TournamentsStack.Screen
      name='InviteParticipants'
      component={InviteParticipantsScreen}
    />
  </TournamentsStack.Navigator>
);

const LeaderboardStack = createNativeStackNavigator<LeaderboardStackParamList>();
const LeaderboardNavigator = () => (
  <LeaderboardStack.Navigator screenOptions={{ headerShown: false }}>
    <LeaderboardStack.Screen name='LeaderboardMain' component={LeaderboardMainScreen} />
    <LeaderboardStack.Screen name='PlayerProfile' component={PlayerProfileScreen} />
    <LeaderboardStack.Screen name='UserSearch' component={LeaderboardUserSearchScreen} />
    <LeaderboardStack.Screen name='GroupDetail' component={GroupDetailScreen} />
    <LeaderboardStack.Screen name='CreateGroup' component={CreateGroupScreen} />
    <LeaderboardStack.Screen name='CustomLeaderboardDetail' component={CustomLeaderboardDetailScreen} />
    <LeaderboardStack.Screen name='CreateCustomLeaderboard' component={CreateCustomLeaderboardScreen} />
  </LeaderboardStack.Navigator>
);

// ─── Bottom Tabs ──────────────────────────────────────────────────────────────

export type AppTabParamList = {
  Matches: undefined;
  NewMatch: undefined;
  Tournaments: undefined;
  Leaderboard: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => {
  const { t } = useTranslation('matches');
  const { t: tT } = useTranslation('tournaments');
  const { tk } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tk.background.primary,
          borderTopColor: tk.primary[900],
          borderTopWidth: 1,
          paddingTop: 4,
          height: 100,
        },
        tabBarActiveTintColor: tk.primary[400],
        tabBarInactiveTintColor: tk.text.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: typography.family.heading,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name='Matches'
        component={MatchesNavigator}
        options={{
          tabBarLabel: t('tabs.history'),
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontSize: 14,
                color,
                fontFamily: typography.family.display,
              }}
            >
              MH
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name='NewMatch'
        component={CreateMatchNavigator}
        options={{
          tabBarLabel: t('tabs.record'),
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontSize: 16,
                color,
                fontFamily: typography.family.display,
              }}
            >
              +
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name='Tournaments'
        component={TournamentsNavigator}
        options={{
          tabBarLabel: tT('tab'),
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontSize: 14,
                color,
                fontFamily: typography.family.display,
              }}
            >
              TR
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name='Leaderboard'
        component={LeaderboardNavigator}
        options={{
          tabBarLabel: t('tabs.leaderboard'),
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontSize: 14,
                color,
                fontFamily: typography.family.display,
              }}
            >
              LB
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
