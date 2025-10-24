import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import WelcomeScreen from "../components/WelcomeScreen";

import "../global.css";


export default function RootLayout() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const checkWelcomeStatus = async () => {
    setTimeout(() => {
        setShowWelcome(false);
    }, 2500);
  };

  const handleWelcomeComplete = () => {
    setIsSignedIn(true);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <View className="flex-1 bg-black">
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' }
      }}>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name='(auth)' />
        </Stack.Protected>

        <Stack.Protected guard={!!isSignedIn}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='create-buzz' />
        </Stack.Protected>
      </Stack>
    </View>
  );
}
