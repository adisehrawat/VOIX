import { router, useLocalSearchParams } from 'expo-router';
import { ArrowDown, ArrowLeft, ArrowUp, MessageCircle, Send, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnhancedTipModal from '../../components/tips/EnhancedTipModal';
import { dummyBuzzes } from '../../data/dummyBuzzes';
import { Comment, dummyComments } from '../../data/dummyComments';

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};


interface RecipientUser {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
    imageUrl?: string;
  }
  
const CommentItem = ({ comment }: { comment: Comment }) => (
  <View className="px-6 py-4 border-b border-zinc-900">
    <View className="flex-row">
      <Image
        source={{ uri: comment.user.avatar }}
        className="w-10 h-10 rounded-full mr-3"
      />
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-white font-semibold mr-2">{comment.user.name}</Text>
          <Text className="text-gray-400 text-sm">{formatTimeAgo(comment.createdAt)}</Text>
        </View>
        <Text className="text-white text-base mb-2">{comment.content}</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="flex-row items-center mr-4" activeOpacity={0.7}>
            <ArrowUp size={16} color="#71717a" strokeWidth={2} />
            <Text className="text-gray-400 text-sm ml-1">{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-gray-400 text-sm">Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

export default function BuzzDetail() {
  const { id } = useLocalSearchParams();
  const [commentText, setCommentText] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  
  const buzz = dummyBuzzes.find(b => b.id === id) || dummyBuzzes[0];
  const comments = dummyComments.filter(c => c.buzzId === buzz.id);
  const totalTips = buzz.tips * 0.5; // Example: 5 tips * 0.5 SOL = 2.5 SOL

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log('Sending comment:', commentText);
      setCommentText('');
    }
  };

  const handleTip = (buzzId: string, amount: string, symbol: string) => {
    console.log('Tipping buzz:', { buzzId, amount, symbol });
    // TODO: Integrate with backend API
  };

  const renderHeader = () => (
    <>
      {/* Buzz Content */}
      <View className="px-6 py-4">
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: buzz.user.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">{buzz.user.name}</Text>
            <Text className="text-gray-400 text-sm">{formatTimeAgo(buzz.createdAt)}</Text>
          </View>
        </View>

        {buzz.content && (
          <Text className="text-white text-lg mb-4 leading-7">{buzz.content}</Text>
        )}

        {buzz.image && (
          <View className="mb-4 rounded-2xl overflow-hidden">
            <Image
              source={{ uri: buzz.image }}
              className="w-full h-80"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Stats */}
        <View className="flex-row items-center py-3 border-y border-zinc-900 mb-3">
          <Text className="text-gray-400 text-sm mr-4">
            {buzz.votes.upvotes - buzz.votes.downvotes} votes
          </Text>
          <Text className="text-gray-400 text-sm mr-4">
            {comments.length} comments
          </Text>
          <Text className="text-orange-500 text-sm font-semibold">
            🪙 {totalTips} SOL collected
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row items-center justify-between pb-4 border-b border-zinc-900">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity activeOpacity={0.7}>
              <ArrowUp size={28} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <ArrowDown size={28} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-4">
            <TouchableOpacity activeOpacity={0.7}>
              <MessageCircle size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Share2 size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTipModal(true)}
              className="bg-orange-500 px-4 py-2 rounded-full"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">💰 Tip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Enhanced Tip Modal */}
      <EnhancedTipModal
        visible={showTipModal}
        recipient={buzz.user as RecipientUser}
        buzzId={buzz.id}
        onClose={() => setShowTipModal(false)}
        onTip={handleTip}
      />

      {/* Comments Header */}
      <View className="px-6 py-3 bg-zinc-900/50">
        <Text className="text-white font-semibold text-lg">
          Comments ({comments.length})
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-zinc-900">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="mr-4">
          <ArrowLeft size={24} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Buzz</Text>
      </View>

      {/* Content */}
      <FlatList
        ListHeaderComponent={renderHeader}
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Comment Input */}
      <View className="border-t border-zinc-900 px-6 py-3 flex-row items-center bg-black">
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          placeholderTextColor="#71717a"
          className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-full mr-3"
        />
        <TouchableOpacity
          onPress={handleSendComment}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
          activeOpacity={0.8}
        >
          <Send size={18} color="#000" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

