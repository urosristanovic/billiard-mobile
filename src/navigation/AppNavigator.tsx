import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/theme';

import HomeScreen from '@/screens/home/HomeScreen';
import MatchDetailScreen from '@/screens/match/MatchDetailScreen';
import UserSearchScreen from '@/screens/leaderboard/UserSearchScreen';
import PlayerProfileScreen from '@/screens/leaderboard/PlayerProfileScreen';
import ProfileScreen from '@/screens/user/ProfileScreen';
import ProfileSetupScreen from '@/screens/user/ProfileSetupScreen';
import ChangePasswordScreen from '@/screens/user/ChangePasswordScreen';
import FeedbackScreen from '@/screens/user/FeedbackScreen';
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
import { AppDrawerContent } from './DrawerContent';

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
export type AppDrawerParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList> | undefined;
};
const Drawer = createDrawerNavigator<AppDrawerParamList>();

const TabsNavigator = () => {
  const { t } = useTranslation('home');
  const { t: tT } = useTranslation('tournaments');
  const { t: tLB } = useTranslation('leaderboard');
  const { tk } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName='Home'
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
        name='Home'
        component={HomeNavigator}
        options={{
          tabBarLabel: t('tab'),
          tabBarIcon: ({ color }) => (
            <Text
              style={{
                fontSize: 14,
                color,
                fontFamily: typography.family.display,
              }}
            >
              HM
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name='Leaderboard'
        component={LeaderboardNavigator}
        options={{
          tabBarLabel: tLB('title'),
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

export const AppNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerPosition: 'right',
      drawerType: 'front',
      overlayColor: 'rgba(0,0,0,0.45)',
      drawerStyle: { width: 320 },
    }}
    drawerContent={props => <AppDrawerContent {...props} />}
  >
    <Drawer.Screen name='MainTabs' component={TabsNavigator} />
  </Drawer.Navigator>
);
