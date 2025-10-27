import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationSettings from '../components/location/LocationSettings';
import AccountManagement from '../components/settings/AccountManagement';
import EditProfile from '../components/settings/EditProfile';
import PrivacySettings from '../components/settings/PrivacySettings';
import UserSettings from '../components/settings/UserSettings';
import { User } from '../types';

type SettingsScreen = 'main' | 'edit-profile' | 'privacy' | 'location' | 'account';

export default function Settings() {
  const [currentScreen, setCurrentScreen] = useState<SettingsScreen>('main');

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Dummy current user
  const currentUser: User = {
    id: '1',
    name: 'Tom Jabes',
    username: '@tomjabes',
    email: 'tom@example.com',
    imageUrl: 'https://i.pravatar.cc/150?img=33',
    publicKey: '0x987654321',
    walletId: 'wallet_tom_123456789',
    authType: 'Password',
    createdAt: new Date(),
  };

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

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    console.log('Saving profile:', updatedUser);
    setCurrentScreen('main');
  };

  const handlePrivacySettingsChange = (settings: any) => {
    console.log('Privacy settings changed:', settings);
  };

  const handleLocationSettingsChange = (settings: any) => {
    console.log('Location settings changed:', settings);
  };

  const handleChangePassword = () => {
    console.log('Change password');
  };

  const handleManageWallet = () => {
    console.log('Manage wallet');
    router.push('/wallet');
  };

  const handleLogout = () => {
    console.log('Logout');
    // Handle logout logic
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
    // Handle delete account logic
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'edit-profile':
        return 'Edit Profile';
      case 'privacy':
        return 'Privacy';
      case 'location':
        return 'Location';
      case 'account':
        return 'Account';
      default:
        return 'Settings';
    }
  };

  if (!fontsLoaded) return null;

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
          <EditProfile user={currentUser} onSave={handleSaveProfile} />
        )}

        {currentScreen === 'privacy' && (
          <PrivacySettings onSettingsChange={handlePrivacySettingsChange} />
        )}

        {currentScreen === 'location' && (
          <LocationSettings onSettingsChange={handleLocationSettingsChange} />
        )}

        {currentScreen === 'account' && (
          <AccountManagement
            user={currentUser}
            onChangePassword={handleChangePassword}
            onManageWallet={handleManageWallet}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

