import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BuzzData } from '../services/api';

interface ReplyCardProps {
  reply: BuzzData;
}

const ReplyCard = memo(({ reply }: ReplyCardProps) => {
  const router = useRouter();

  const handleReplyPress = () => {
    // Navigate to the parent buzz to see the full context
    if (reply.parentBuzzId) {
      router.push(`/buzz/${reply.parentBuzzId}`);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <Pressable
      onPress={handleReplyPress}
      className="bg-zinc-900 rounded-3xl mx-4 mb-4 p-5 border border-zinc-800"
    >
      {/* Parent Buzz Context */}
      {reply.parentBuzz && (
        <View className="bg-zinc-800/50 rounded-2xl p-3 mb-3 border border-zinc-700">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: reply.parentBuzz.user.ImageUrl }}
              className="w-6 h-6 rounded-full"
            />
            <Text className="text-gray-400 text-xs ml-2">
              Replying to @{reply.parentBuzz.user.Name.toLowerCase().replace(/\s+/g, '')}
            </Text>
          </View>
          {reply.parentBuzz.content && (
            <Text className="text-gray-300 text-sm" numberOfLines={2}>
              {reply.parentBuzz.content}
            </Text>
          )}
        </View>
      )}

      {/* Reply Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: reply.user.ImageUrl }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold text-base">
              {reply.user.Name}
            </Text>
            <Text className="text-gray-400 text-sm">
              @{reply.user.Name.toLowerCase().replace(/\s+/g, '')}
            </Text>
          </View>
        </View>
        <Text className="text-gray-500 text-sm">
          {formatTime(reply.createdAt)}
        </Text>
      </View>

      {/* Reply Content */}
      {reply.content && (
        <Text className="text-white text-base mb-3 leading-6">
          {reply.content}
        </Text>
      )}

      {/* Reply Image */}
      {reply.image && (
        <View className="mb-3 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: reply.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Footer */}
      <View className="flex-row items-center pt-3 border-t border-zinc-800">
        <TouchableOpacity
          onPress={handleReplyPress}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color="#9ca3af" strokeWidth={2} />
          <Text className="text-gray-400 text-sm ml-2">
            View conversation
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
});

ReplyCard.displayName = 'ReplyCard';

export default ReplyCard;

