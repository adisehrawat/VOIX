import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfile from '../components/settings/EditProfile';
import UserSettings from '../components/settings/UserSettings';
import { useProfile } from '../contexts/ProfileContext';

type SettingsScreen = 'main' | 'edit-profile' | 'location';

export default function Settings() {
  const [currentScreen, setCurrentScreen] = useState<SettingsScreen>('main');
  const { userData, loading } = useProfile();

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as SettingsScreen);
  };

  const handleBack = () => {
    if (currentScreen === 'main') {
      router.back();
    } else {
      setCurrentScreen('main');
    }
  };

  const handleSaveProfile = () => {
    // Profile already updated via API and context
    setCurrentScreen('main');
  };


  const handleLocationSettingsChange = (settings: any) => {
    console.log('Location settings changed:', settings);
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'edit-profile':
        return 'Edit Profile';
      case 'location':
        return 'Location';
      default:
        return 'Settings';
    }
  };

  if (!fontsLoaded) return null;

  if (loading || !userData) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-zinc-900">
        <TouchableOpacity
          onPress={handleBack}
          className="mr-4"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <Text 
          className="text-white text-3xl"
          style={{ fontFamily: 'StickNoBills_500Medium' }}
        >
          {getScreenTitle()}
        </Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentScreen === 'main' && (
          <UserSettings onNavigate={handleNavigate} />
        )}

        {currentScreen === 'edit-profile' && (
          <EditProfile 
            user={{
              name: userData.Name,
              email: userData.email,
              imageUrl: userData.ImageUrl
            }}
            onSave={handleSaveProfile} 
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

