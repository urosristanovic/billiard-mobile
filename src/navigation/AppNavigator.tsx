import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { CustomTabBar } from './CustomTabBar';

import HomeScreen from '@/screens/home/HomeScreen';
import MatchDetailScreen from '@/screens/match/MatchDetailScreen';
import UserSearchScreen from '@/screens/leaderboard/UserSearchScreen';
import PlayerProfileScreen from '@/screens/leaderboard/PlayerProfileScreen';
import ProfileScreen from '@/screens/user/ProfileScreen';
import ProfileSetupScreen from '@/screens/user/ProfileSetupScreen';
import ChangePasswordScreen from '@/screens/user/ChangePasswordScreen';
import FeedbackScreen from '@/screens/user/FeedbackScreen';
import SettingsScreen from '@/screens/user/SettingsScreen';
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
import CreateGroupScreen from '@/screens/leaderboard/CreateGroupScreen';
import GroupDetailScreen from '@/screens/leaderboard/GroupDetailScreen';
import CreateCustomLeaderboardScreen from '@/screens/leaderboard/CreateCustomLeaderboardScreen';
import CustomLeaderboardDetailScreen from '@/screens/leaderboard/CustomLeaderboardDetailScreen';

// ─── Stack param lists ────────────────────────────────────────────────────────

export type HomeStackParamList = {
  HomeFeed: undefined;
  MatchDetail: { matchId: string };
  UserSearch: undefined;
  PlayerProfile: { userId: string };
  Profile: { edit?: boolean } | undefined;
  ProfileSetup: undefined;
  ChangePassword: undefined;
  Feedback: undefined;
  Settings: undefined;
};

export type LeaderboardStackParamList = {
  LeaderboardMain: undefined;
  PlayerProfile: { userId: string };
  UserSearch: { groupId?: string; leaderboardId?: string } | undefined;
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
  CustomLeaderboardDetail: { leaderboardId: string };
  CreateCustomLeaderboard: undefined;
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

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name='HomeFeed' component={HomeScreen} />
    <HomeStack.Screen name='MatchDetail' component={MatchDetailScreen} />
    <HomeStack.Screen name='UserSearch' component={UserSearchScreen} />
    <HomeStack.Screen name='PlayerProfile' component={PlayerProfileScreen} />
    <HomeStack.Screen name='Profile' component={ProfileScreen} />
    <HomeStack.Screen name='ProfileSetup' component={ProfileSetupScreen} />
    <HomeStack.Screen name='ChangePassword' component={ChangePasswordScreen} />
    <HomeStack.Screen name='Feedback' component={FeedbackScreen} />
    <HomeStack.Screen name='Settings' component={SettingsScreen} />
  </HomeStack.Navigator>
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
    <LeaderboardStack.Screen name='UserSearch' component={UserSearchScreen} />
    <LeaderboardStack.Screen name='GroupDetail' component={GroupDetailScreen} />
    <LeaderboardStack.Screen name='CreateGroup' component={CreateGroupScreen} />
    <LeaderboardStack.Screen name='CustomLeaderboardDetail' component={CustomLeaderboardDetailScreen} />
    <LeaderboardStack.Screen name='CreateCustomLeaderboard' component={CreateCustomLeaderboardScreen} />
  </LeaderboardStack.Navigator>
);

// ─── Bottom Tabs ──────────────────────────────────────────────────────────────

export type AppTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Tournaments: NavigatorScreenParams<TournamentsStackParamList> | undefined;
  Leaderboard: NavigatorScreenParams<LeaderboardStackParamList> | undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => (
  <Tab.Navigator
    initialRouteName='Home'
    screenOptions={{ headerShown: false }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen name='Home' component={HomeNavigator} />
    <Tab.Screen name='Tournaments' component={TournamentsNavigator} />
    <Tab.Screen name='Leaderboard' component={LeaderboardNavigator} />
  </Tab.Navigator>
);
