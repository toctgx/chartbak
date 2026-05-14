import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';

import SplashScreenComp from './src/screens/SplashScreen';
import PhoneScreen from './src/screens/onboarding/PhoneScreen';
import RoleScreen from './src/screens/onboarding/RoleScreen';
import DiseaseSelectScreen from './src/screens/onboarding/DiseaseSelectScreen';
import NicknameScreen from './src/screens/onboarding/NicknameScreen';
import BasicInfoScreen from './src/screens/onboarding/BasicInfoScreen';
import AppNavigator from './src/navigation/AppNavigator';

import { User, UserRole } from './src/types';
import { MOCK_USER } from './src/lib/mockData';

SplashScreen.preventAutoHideAsync();

type AppStep =
  | 'splash'
  | 'phone'
  | 'role'
  | 'disease'
  | 'nickname'
  | 'basicinfo'
  | 'app';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [step, setStep] = useState<AppStep>('splash');
  const [user, setUser] = useState<User | null>(null);

  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [diseaseIds, setDiseaseIds] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
    console.log('New post:', post);
  };

  if (step === 'splash') {
    return (
      <SafeAreaProvider>
        <SplashScreenComp onFinish={() => setStep('phone')} />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  if (step === 'phone') {
    return (
      <SafeAreaProvider>
        <PhoneScreen onNext={(p) => { setPhone(p); setStep('role'); }} />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  if (step === 'role') {
    return (
      <SafeAreaProvider>
        <RoleScreen onNext={(r) => { setRole(r); setStep('disease'); }} />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  if (step === 'disease') {
    return (
      <SafeAreaProvider>
        <DiseaseSelectScreen
          onNext={(ids) => { setDiseaseIds(ids); setStep('nickname'); }}
          onBack={() => setStep('role')}
        />
        <StatusBar style="light" />
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
        <StatusBar style="light" />
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
        <StatusBar style="light" />
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
          <StatusBar style="light" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return null;
}
