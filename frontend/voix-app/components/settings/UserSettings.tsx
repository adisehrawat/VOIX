import { Bell, Globe, Lock, Moon, Settings, User as UserIcon } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
      id: 'privacy',
      title: 'Privacy Settings',
      description: 'Control your privacy preferences',
      icon: Lock,
      color: '#a855f7',
      onPress: () => onNavigate('privacy'),
    },
    {
      id: 'location',
      title: 'Location Settings',
      description: 'Manage location preferences',
      icon: Globe,
      color: '#22c55e',
      onPress: () => onNavigate('location'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: Bell,
      color: '#f97316',
      onPress: () => onNavigate('notifications'),
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme and display settings',
      icon: Moon,
      color: '#eab308',
      onPress: () => onNavigate('appearance'),
    },
    {
      id: 'account',
      title: 'Account Management',
      description: 'Security and account settings',
      icon: Settings,
      color: '#ef4444',
      onPress: () => onNavigate('account'),
    },
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
      </View>
    </ScrollView>
  );
}

