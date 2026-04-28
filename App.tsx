import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import PhoneScreen from './src/screens/onboarding/PhoneScreen';
import RoleScreen from './src/screens/onboarding/RoleScreen';
import DiseaseSelectScreen from './src/screens/onboarding/DiseaseSelectScreen';
import NicknameScreen from './src/screens/onboarding/NicknameScreen';
import BasicInfoScreen from './src/screens/onboarding/BasicInfoScreen';
import AppNavigator from './src/navigation/AppNavigator';

import { User, UserRole } from './src/types';
import { MOCK_USER } from './src/lib/mockData';
import { generateNickname } from './src/lib/supabase';
import { DISEASES } from './src/constants/diseases';

type AppStep =
  | 'splash'
  | 'phone'
  | 'role'
  | 'disease'
  | 'nickname'
  | 'basicinfo'
  | 'app';

export default function App() {
  const [step, setStep] = useState<AppStep>('splash');
  const [user, setUser] = useState<User | null>(null);

  // 온보딩 임시 상태
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [diseaseIds, setDiseaseIds] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');

  // MVP: 자동 로그인 시뮬레이션 (실제로는 Supabase session 확인)
  // setUser(MOCK_USER); setStep('app'); // 개발 시 주석 해제로 바로 앱 진입 가능

  const handleOnboardingComplete = (ageGroup: string, diagnosisYear: number) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      phone_hash: `hashed_${phone.slice(-4)}`,
      nickname,
      role,
      disease_ids: diseaseIds,
      age_group: ageGroup,
      diagnosis_year: diagnosisYear,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setStep('app');
  };

  const handleNewPost = (post: any) => {
    // MVP: 새 글 추가 (실제로는 Supabase insert)
    console.log('New post:', post);
  };

  if (step === 'splash') {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setStep('phone')} />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  if (step === 'phone') {
    return (
      <SafeAreaProvider>
        <PhoneScreen onNext={(p) => { setPhone(p); setStep('role'); }} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (step === 'role') {
    return (
      <SafeAreaProvider>
        <RoleScreen onNext={(r) => { setRole(r); setStep('disease'); }} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (step === 'disease') {
    return (
      <SafeAreaProvider>
        <DiseaseSelectScreen onNext={(ids) => { setDiseaseIds(ids); setStep('nickname'); }} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (step === 'nickname') {
    return (
      <SafeAreaProvider>
        <NicknameScreen
          diseaseIds={diseaseIds}
          onNext={(nick) => { setNickname(nick); setStep('basicinfo'); }}
        />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (step === 'basicinfo') {
    return (
      <SafeAreaProvider>
        <BasicInfoScreen
          nickname={nickname}
          onNext={handleOnboardingComplete}
        />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (step === 'app' && user) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator
              user={user}
              onLogout={() => { setUser(null); setStep('phone'); }}
              onNewPost={handleNewPost}
            />
          </NavigationContainer>
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return null;
}
