import { MessageCircle, MoreVertical } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Friend } from '../../types';

interface FriendCardProps {
  friend: Friend;
  onMessage: (friendId: string) => void;
  onMore: (friendId: string) => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

export default function FriendCard({ friend, onMessage, onMore }: FriendCardProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => friend.user?.id && router.push(`/user-profile/${friend.user.id}`)}
          activeOpacity={0.8}
          className="flex-row items-center flex-1"
        >
          <Image
            source={{ uri: friend.user.imageUrl }}
            className="w-14 h-14 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {friend.user.name}
            </Text>
            <Text className="text-gray-400 text-sm">
              {friend.user.username}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Friends since {formatTimeAgo(friend.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onMessage(friend.friendId)}
            className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center border border-zinc-700"
            activeOpacity={0.8}
          >
            <MessageCircle size={18} color="#fff" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onMore(friend.friendId)}
            className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center border border-zinc-700"
            activeOpacity={0.8}
          >
            <MoreVertical size={18} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

