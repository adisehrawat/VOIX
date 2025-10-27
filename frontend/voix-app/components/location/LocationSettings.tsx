import { Globe, Lock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

interface LocationSettingsProps {
  onSettingsChange: (settings: {
    shareLocation: boolean;
    showNearbyBuzzes: boolean;
    locationPrivacy: 'public' | 'friends' | 'private';
  }) => void;
}

export default function LocationSettings({ onSettingsChange }: LocationSettingsProps) {
  const [shareLocation, setShareLocation] = useState(true);
  const [showNearbyBuzzes, setShowNearbyBuzzes] = useState(true);
  const [locationPrivacy, setLocationPrivacy] = useState<'public' | 'friends' | 'private'>('friends');

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      shareLocation,
      showNearbyBuzzes,
      locationPrivacy,
      [key]: value,
    };

    if (key === 'shareLocation') setShareLocation(value);
    if (key === 'showNearbyBuzzes') setShowNearbyBuzzes(value);
    if (key === 'locationPrivacy') setLocationPrivacy(value);

    onSettingsChange(newSettings);
  };

  return (
    <View className="p-4">
      {/* Header */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
        <View className="flex-row items-center">
          <MapPin size={24} color="#3b82f6" strokeWidth={2} />
          <Text className="text-white text-lg font-bold ml-2">
            Location Settings
          </Text>
        </View>
        <Text className="text-gray-400 text-sm mt-2">
          Manage your location preferences
        </Text>
      </View>

      {/* Share Location */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-3">
              <Globe size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Share Location
              </Text>
              <Text className="text-gray-400 text-sm">
                Allow others to see your location
              </Text>
            </View>
          </View>
          <Switch
            value={shareLocation}
            onValueChange={(value) => handleSettingChange('shareLocation', value)}
            trackColor={{ false: '#3f3f46', true: '#3b82f6' }}
            thumbColor={shareLocation ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>

      {/* Show Nearby Buzzes */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-3">
              <MapPin size={20} color="#22c55e" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Nearby Buzzes
              </Text>
              <Text className="text-gray-400 text-sm">
                Show buzzes from your area
              </Text>
            </View>
          </View>
          <Switch
            value={showNearbyBuzzes}
            onValueChange={(value) => handleSettingChange('showNearbyBuzzes', value)}
            trackColor={{ false: '#3f3f46', true: '#22c55e' }}
            thumbColor={showNearbyBuzzes ? '#fff' : '#a1a1aa'}
          />
        </View>
      </View>

      {/* Location Privacy */}
      <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mr-3">
            <Lock size={20} color="#a855f7" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              Location Privacy
            </Text>
            <Text className="text-gray-400 text-sm">
              Who can see your location
            </Text>
          </View>
        </View>

        <View className="space-y-2">
          {['public', 'friends', 'private'].map((privacy) => (
            <View
              key={privacy}
              className={`p-3 rounded-xl border-2 ${
                locationPrivacy === privacy
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-zinc-800 bg-zinc-800'
              }`}
            >
              <Text
                className={`font-semibold ${
                  locationPrivacy === privacy ? 'text-purple-500' : 'text-white'
                }`}
              >
                {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {privacy === 'public' && 'Everyone can see your location'}
                {privacy === 'friends' && 'Only friends can see your location'}
                {privacy === 'private' && 'No one can see your location'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

