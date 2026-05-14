import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import {
  IconHome, IconHomeActive,
  IconDiet, IconDietActive,
  IconDiary, IconDiaryActive,
  IconMyPage, IconMyPageActive,
  IconWrite,
} from '../components/Icons';

import HomeFeedScreen from '../screens/HomeFeedScreen';
import DietScreen from '../screens/DietScreen';
import DiaryScreen from '../screens/DiaryScreen';
import WritePostScreen from '../screens/WritePostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

import MyPageScreen from '../screens/MyPageScreen';
import { User } from '../types';

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



// ── 플로팅 커스텀 탭바 ────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: any) {
  const tabs = [
    { name: 'HomeTab',  label: '피드',  Icon: IconHome,   IconActive: IconHomeActive },
    { name: 'DietTab',  label: '식단',  Icon: IconDiet,   IconActive: IconDietActive },
    { name: 'WriteTab', label: '',      Icon: null,       IconActive: null, isFab: true },
    { name: 'DiaryTab', label: '일기',  Icon: IconDiary,  IconActive: IconDiaryActive },
    { name: 'MyPage',   label: '마이',  Icon: IconMyPage, IconActive: IconMyPageActive },
  ];

  return (
    <View style={styles.tabBarWrapper} pointerEvents="box-none">
      <View style={styles.tabBarContainer}>
        {tabs.map((tab, index) => {
          const route = state.routes.find((r: any) => r.name === tab.name);
          const isFocused = route ? state.index === state.routes.indexOf(route) : false;

          if (tab.isFab) {
            // Center FAB — navigate to WritePost in HomeTab stack
            return (
              <TouchableOpacity
                key="fab"
                style={styles.fabButton}
                onPress={() => {
                  const homeRoute = state.routes.find((r: any) => r.name === 'HomeTab');
                  if (homeRoute) {
                    navigation.navigate('HomeTab', { screen: 'WritePost' });
                  }
                }}
                activeOpacity={0.85}
              >
                <IconWrite size={24} />
              </TouchableOpacity>
            );
          }

          if (!route) return null;
          const { Icon, IconActive, label } = tab;
          const routeIndex = state.routes.indexOf(route);

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              activeOpacity={0.8}
            >
              {isFocused ? (
                <View style={styles.activeIconContainer}>
                  {IconActive && <IconActive size={22} />}
                </View>
              ) : (
                Icon && <Icon size={22} />
              )}
              {label ? (
                <Text style={[
                  styles.tabLabel,
                  isFocused && styles.tabLabelActive,
                ]}>
                  {label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    height: 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.tabBar,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 2,
  },
  activeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.6)',
  },
  tabLabelActive: {
    color: COLORS.accent,
  },
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...SHADOWS.card,
  },
});

export default function AppNavigator({ user, onLogout, onNewPost }: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab">
        {() => <HomeStack user={user} onNewPost={onNewPost} />}
      </Tab.Screen>

      <Tab.Screen name="DietTab">
        {() => (
          <DietScreen
            userDiseaseIds={user.disease_ids}
            userId={user.id}
          />
        )}
      </Tab.Screen>

      {/* WriteTab — 실제로 렌더링 안 됨, FAB이 처리 */}
      <Tab.Screen name="WriteTab">
        {() => <View style={{ flex: 1, backgroundColor: COLORS.background }} />}
      </Tab.Screen>

      <Tab.Screen name="DiaryTab">
        {() => (
          <DiaryScreen
            nickname={user.nickname}
            userRole={user.role}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="MyPage">
        {() => <MyPageScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
