import { Zap } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    stats: {
      posts: number;
      followers: number;
      following: number;
    };
    coins: number;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View className="px-6 pb-6 mt-4">
      {/* Profile Info */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="relative">
            <Image
              source={{ uri: user.avatar }}
              className="w-20 h-20 rounded-full"
            />
            <View className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-black items-center justify-center">
              <Text className="text-white text-xs font-bold">+</Text>
            </View>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold">{user.name}</Text>
            <Text className="text-gray-400 text-sm">{user.username}</Text>
            {/* Karma Badge */}
            <View className="flex-row items-center bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30 mt-1 self-start">
              <Zap size={12} color="#a855f7" strokeWidth={2.5} fill="#a855f7" />
              <Text className="text-purple-500 font-semibold text-xs ml-1">
                1250 Karma
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-orange-500 px-3 py-2 rounded-full flex-row items-center">
          <Text className="text-white text-lg font-bold mr-1">🪙</Text>
          <Text className="text-white text-base font-bold">{user.coins}</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mb-4">
        <View className="items-center">
          <Text className="text-white text-lg font-bold">{user.stats.posts}</Text>
          <Text className="text-gray-400 text-sm">posts</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">{user.stats.followers}</Text>
          <Text className="text-gray-400 text-sm">followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">{user.stats.following}</Text>
          <Text className="text-gray-400 text-sm">following</Text>
        </View>
      </View>

      {/* Bio */}
      {user.bio && (
        <Text className="text-white text-sm mb-4">{user.bio}</Text>
      )}
    </View>
  );
}

