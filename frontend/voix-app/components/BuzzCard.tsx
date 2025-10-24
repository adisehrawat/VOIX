import { router } from 'expo-router';
import { ArrowDown, ArrowUp, MessageCircle, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Buzz } from '../data/dummyBuzzes';
import EnhancedTipModal from './tips/EnhancedTipModal';

interface BuzzCardProps {
  buzz: Buzz;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function BuzzCard({ buzz }: BuzzCardProps) {
  const [showTipModal, setShowTipModal] = useState(false);

  const handlePress = () => {
    router.push(`/buzz/${buzz.id}`);
  };

  const handleTip = (buzzId: string, amount: string, symbol: string) => {
    console.log('Tipping buzz:', { buzzId, amount, symbol });
    // TODO: Integrate with backend API
  };

  return (
    <>
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handlePress}
      className="bg-zinc-900 rounded-3xl mx-4 mb-4 p-5 border border-zinc-800"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: buzz.user.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {buzz.user.name}
            </Text>
            <Text className="text-gray-400 text-sm">
              {formatTimeAgo(buzz.createdAt)}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            setShowTipModal(true);
          }}
          className="bg-orange-500 px-4 py-2 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-white font-medium px-2">💰 Tip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {buzz.content && (
        <Text className="text-white text-base mb-4 leading-6">
          {buzz.content}
        </Text>
      )}

      {/* Image/Video */}
      {buzz.image && (
        <View className="mb-4 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: buzz.image }}
            className="w-full h-80"
            resizeMode="cover"
          />
          {buzz.video && (
            <View className="absolute inset-0 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-white/30 items-center justify-center">
                <View 
                  className="w-0 h-0 ml-1"
                  style={{
                    borderLeftWidth: 20,
                    borderTopWidth: 12,
                    borderBottomWidth: 12,
                    borderLeftColor: '#fff',
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                  }}
                />
              </View>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between pt-3 border-t border-zinc-800">
        <View className="flex-row items-center gap-4">
          {/* Upvote */}
          <TouchableOpacity activeOpacity={0.7}>
            <ArrowUp size={28} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          
          {/* Downvote */}
          <TouchableOpacity activeOpacity={0.7}>
            <ArrowDown size={28} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-4">
          {/* Comments */}
          <TouchableOpacity 
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            <MessageCircle size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          
          {/* Share */}
          <TouchableOpacity 
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            <Share2 size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>

    {/* Enhanced Tip Modal */}
    <EnhancedTipModal
      visible={showTipModal}
      recipient={buzz.user}
      buzzId={buzz.id}
      onClose={() => setShowTipModal(false)}
      onTip={handleTip}
    />
    </>
  );
}

