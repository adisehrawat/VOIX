import { Check, X } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FriendRequest } from '../../types';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
      <View className="flex-row items-center">
        <Image
          source={{ uri: request.sender.imageUrl }}
          className="w-14 h-14 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            {request.sender.name}
          </Text>
          <Text className="text-gray-400 text-sm">
            {request.sender.username}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            {formatTimeAgo(request.createdAt)}
          </Text>
        </View>
      </View>

      <View className="flex-row mt-4 gap-3">
        <TouchableOpacity
          onPress={() => onAccept(request.id)}
          className="flex-1 bg-white rounded-full py-3 items-center justify-center flex-row"
          activeOpacity={0.8}
        >
          <Check size={18} color="#000" strokeWidth={2.5} />
          <Text className="text-black font-semibold ml-2">Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onReject(request.id)}
          className="flex-1 bg-zinc-800 rounded-full py-3 items-center justify-center flex-row border border-zinc-700"
          activeOpacity={0.8}
        >
          <X size={18} color="#fff" strokeWidth={2.5} />
          <Text className="text-white font-semibold ml-2">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

