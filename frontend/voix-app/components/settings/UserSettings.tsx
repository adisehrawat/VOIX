import { LogOut, Settings, User as UserIcon, Wallet, Zap } from 'lucide-react-native';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  onPress: () => void;
}

interface UserSettingsProps {
  onNavigate: (screen: string) => void;
}

export default function UserSettings({ onNavigate }: UserSettingsProps) {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ],
    );
  };

  const settingsOptions: SettingsOption[] = [
    {
      id: 'profile',
      title: 'Edit Profile',
      description: 'Update your profile information',
      icon: UserIcon,
      color: '#3b82f6',
      onPress: () => onNavigate('edit-profile'),
    },
    {
      id: 'wallet',
      title: 'Wallet',
      description: 'View balance and transactions',
      icon: Wallet,
      color: '#10b981',
      onPress: () => router.push('/wallet'),
    },
    {
      id: 'karma',
      title: 'Karma',
      description: 'View karma points and leaderboard',
      icon: Zap,
      color: '#a855f7',
      onPress: () => router.push('/karma'),
    },
    // {
    //   id: 'tips',
    //   title: 'Tips',
    //   description: 'View tip history and analytics',
    //   icon: Coins,
    //   color: '#f97316',
    //   onPress: () => router.push('/tips'),
    // },
  ];

  return (
    <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
          <View className="flex-row items-center">
            <Settings size={24} color="#fff" strokeWidth={2} />
            <Text className="text-white text-lg font-bold ml-2">
              Settings
            </Text>
          </View>
          <Text className="text-gray-400 text-sm mt-2">
            Manage your account and preferences
          </Text>
        </View>

        {/* Settings Options */}
        {settingsOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={option.onPress}
              className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800 flex-row items-center"
              activeOpacity={0.8}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${option.color}20` }}
              >
                <IconComponent size={24} color={option.color} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  {option.title}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-red-800 flex-row items-center"
          activeOpacity={0.8}
        >
          <View className="w-12 h-12 rounded-full items-center justify-center mr-3 bg-red-500/20">
            <LogOut size={24} color="#ef4444" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-red-500 font-semibold text-base">
              Sign Out
            </Text>
            <Text className="text-red-400 text-sm">
              Logout from your account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

