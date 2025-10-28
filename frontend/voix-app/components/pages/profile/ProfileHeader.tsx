import { Zap } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    stats: {
      posts: number;
      friends: number;
    };
    coins: number;
  };
  karma?: number;
  nfts?: number;
  onFriendsPress?: () => void;
}

export default function ProfileHeader({ user, karma = 0, nfts = 0, onFriendsPress }: ProfileHeaderProps) {
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
            {/* Show NFT badge if user has NFTs, otherwise show + badge */}
            {nfts > 0 ? (
              <View className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-black items-center justify-center">
                <Text className="text-xs">🏆</Text>
              </View>
            ) : (
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-black items-center justify-center">
                <Text className="text-white text-xs font-bold">+</Text>
              </View>
            )}
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold">{user.name}</Text>
            <Text className="text-gray-400 text-sm">{user.username}</Text>
            {/* Karma Badge with NFT count if available */}
            <View className="flex-row items-center flex-wrap gap-2">
              <View className="flex-row items-center bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30 mt-1">
                <Zap size={12} color="#a855f7" strokeWidth={2.5} fill="#a855f7" />
                <Text className="text-purple-500 font-semibold text-xs ml-1">
                  {karma} Karma
                </Text>
              </View>
              {nfts > 0 && (
                <View className="flex-row items-center bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/30 mt-1">
                  <Text className="text-xs mr-1">🏆</Text>
                  <Text className="text-yellow-500 font-semibold text-xs">
                    {nfts} NFT{nfts > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
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
        <TouchableOpacity 
          className="items-center"
          onPress={onFriendsPress}
          activeOpacity={0.7}
        >
          <Text className="text-white text-lg font-bold">{user.stats.friends}</Text>
          <Text className="text-gray-400 text-sm">friends</Text>
        </TouchableOpacity>
      </View>

      {/* Bio */}
      {user.bio && (
        <Text className="text-white text-sm mb-4">{user.bio}</Text>
      )}
    </View>
  );
}

