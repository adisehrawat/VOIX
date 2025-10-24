import { Eye, Lock, Shield, UserCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

interface PrivacySettingsProps {
  onSettingsChange: (settings: {
    privateAccount: boolean;
    showActivity: boolean;
    allowTips: boolean;
    showKarma: boolean;
  }) => void;
}

export default function PrivacySettings({ onSettingsChange }: PrivacySettingsProps) {
  const [privateAccount, setPrivateAccount] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [allowTips, setAllowTips] = useState(true);
  const [showKarma, setShowKarma] = useState(true);

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = {
      privateAccount,
      showActivity,
      allowTips,
      showKarma,
      [key]: value,
    };

    if (key === 'privateAccount') setPrivateAccount(value);
    if (key === 'showActivity') setShowActivity(value);
    if (key === 'allowTips') setAllowTips(value);
    if (key === 'showKarma') setShowKarma(value);

    onSettingsChange(newSettings);
  };

  return (
    <View className="p-4">
      {/* Header */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
        <View className="flex-row items-center">
          <Shield size={24} color="#a855f7" strokeWidth={2} />
          <Text className="text-white text-lg font-bold ml-2">
            Privacy Settings
          </Text>
        </View>
        <Text className="text-gray-400 text-sm mt-2">
          Control who can see your content and activity
        </Text>
      </View>

      {/* Private Account */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mr-3">
              <Lock size={20} color="#a855f7" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Private Account
              </Text>
              <Text className="text-gray-400 text-sm">
                Only approved followers can see your buzzes
              </Text>
            </View>
          </View>
          <Switch
            value={privateAccount}
            onValueChange={(value) => handleSettingChange('privateAccount', value)}
            trackColor={{ false: '#3f3f46', true: '#a855f7' }}
            thumbColor={privateAccount ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>

      {/* Show Activity */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-3">
              <Eye size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Show Activity Status
              </Text>
              <Text className="text-gray-400 text-sm">
                Let others see when you're active
              </Text>
            </View>
          </View>
          <Switch
            value={showActivity}
            onValueChange={(value) => handleSettingChange('showActivity', value)}
            trackColor={{ false: '#3f3f46', true: '#3b82f6' }}
            thumbColor={showActivity ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>

      {/* Allow Tips */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center mr-3">
              <UserCheck size={20} color="#f97316" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Allow Tips
              </Text>
              <Text className="text-gray-400 text-sm">
                Let others tip your buzzes
              </Text>
            </View>
          </View>
          <Switch
            value={allowTips}
            onValueChange={(value) => handleSettingChange('allowTips', value)}
            trackColor={{ false: '#3f3f46', true: '#f97316' }}
            thumbColor={allowTips ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>

      {/* Show Karma */}
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-3">
              <Shield size={20} color="#22c55e" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Show Karma Points
              </Text>
              <Text className="text-gray-400 text-sm">
                Display your karma on your profile
              </Text>
            </View>
          </View>
          <Switch
            value={showKarma}
            onValueChange={(value) => handleSettingChange('showKarma', value)}
            trackColor={{ false: '#3f3f46', true: '#22c55e' }}
            thumbColor={showKarma ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>
    </View>
  );
}

