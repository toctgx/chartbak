import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

import HomeFeedScreen from '../screens/HomeFeedScreen';
import LoungeListScreen from '../screens/LoungeListScreen';
import WritePostScreen from '../screens/WritePostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import MyPageScreen from '../screens/MyPageScreen';
import { User, Post } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface AppNavigatorProps {
  user: User;
  onLogout: () => void;
  onNewPost: (post: any) => void;
}

function HomeStack({ user, onNewPost }: { user: User; onNewPost: (post: any) => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed">
        {(props) => (
          <HomeFeedScreen
            {...props}
            userDiseaseIds={user.disease_ids}
            userRole={user.role}
            nickname={user.nickname}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PostDetail">
        {(props) => (
          <PostDetailScreen
            {...props}
            nickname={user.nickname}
            userRole={user.role}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="WritePost">
        {(props) => (
          <WritePostScreen
            {...props}
            userDiseaseIds={user.disease_ids}
            userRole={user.role}
            nickname={user.nickname}
            onSubmit={onNewPost}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function LoungeStack({ user, onNewPost }: { user: User; onNewPost: (post: any) => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoungeList">
        {(props) => (
          <LoungeListScreen
            {...props}
            userDiseaseIds={user.disease_ids}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PostDetail">
        {(props) => (
          <PostDetailScreen
            {...props}
            nickname={user.nickname}
            userRole={user.role}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function AppNavigator({ user, onLogout, onNewPost }: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
          paddingBottom: 8,
          paddingTop: 8,
          height: 72,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: { fontSize: FONTS.sizes.xs, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: '피드',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      >
        {() => <HomeStack user={user} onNewPost={onNewPost} />}
      </Tab.Screen>
      <Tab.Screen
        name="LoungeTab"
        options={{
          tabBarLabel: '라운지',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏥</Text>,
        }}
      >
        {() => <LoungeStack user={user} onNewPost={onNewPost} />}
      </Tab.Screen>
      <Tab.Screen
        name="MyPage"
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      >
        {() => <MyPageScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
