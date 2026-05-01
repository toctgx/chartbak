import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, FONTS } from '../constants/theme';
import { IconHome, IconHomeActive, IconLounge, IconLoungeActive, IconMyPage, IconMyPageActive } from '../components/Icons';

import HomeFeedScreen from '../screens/HomeFeedScreen';
import LoungeListScreen from '../screens/LoungeListScreen';
import LoungeDetailScreen from '../screens/LoungeDetailScreen';
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
      <Stack.Screen name="LoungeDetail">
        {(props) => (
          <LoungeDetailScreen
            {...props}
            nickname={user.nickname}
            userRole={user.role}
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

const styles = StyleSheet.create({
  iconBox: {
    width: 40, height: 36, borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default function AppNavigator({ user, onLogout, onNewPost }: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: 'rgba(30,42,22,0.97)',
          paddingBottom: 8,
          paddingTop: 8,
          height: 72,
        },
        tabBarActiveTintColor: '#E8A838',
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: { fontSize: FONTS.sizes.xs, fontWeight: '700', marginTop: 2 },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: '피드',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconBox : undefined}>
              {focused ? <IconHomeActive size={24} /> : <IconHome size={24} />}
            </View>
          ),
        }}
      >
        {() => <HomeStack user={user} onNewPost={onNewPost} />}
      </Tab.Screen>
      <Tab.Screen
        name="LoungeTab"
        options={{
          tabBarLabel: '라운지',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconBox : undefined}>
              {focused ? <IconLoungeActive size={24} /> : <IconLounge size={24} />}
            </View>
          ),
        }}
      >
        {() => <LoungeStack user={user} onNewPost={onNewPost} />}
      </Tab.Screen>
      <Tab.Screen
        name="MyPage"
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.iconBox : undefined}>
              {focused ? <IconMyPageActive size={24} /> : <IconMyPage size={24} />}
            </View>
          ),
        }}
      >
        {() => <MyPageScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
