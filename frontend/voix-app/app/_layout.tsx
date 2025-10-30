import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import WelcomeScreen from "../components/WelcomeScreen";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ProfileProvider } from "../contexts/ProfileContext";
import { WalletProvider } from "../contexts/WalletContext";
import { BuzzProvider } from "../contexts/BuzzContext";

import "../global.css";




function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' }
      }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name='(auth)' />
        </Stack.Protected>

        <Stack.Protected guard={!!isAuthenticated}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='create-buzz' />
        </Stack.Protected>
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <WalletProvider>
          <BuzzProvider>
            <RootLayoutNav />
          </BuzzProvider>
        </WalletProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
