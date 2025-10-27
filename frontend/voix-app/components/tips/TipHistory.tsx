import { Coins } from 'lucide-react-native';
import { FlatList, Image, Text, View } from 'react-native';
import { Transaction } from '../../types';

interface TipHistoryProps {
  tips: Transaction[];
  currentUserId: string;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const TipCard = ({ tip, currentUserId }: { tip: Transaction; currentUserId: string }) => {
  const isSent = tip.senderId === currentUserId;
  const otherUser = isSent ? tip.receiver : tip.sender;

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-orange-500/20 rounded-full items-center justify-center mr-3">
          <Coins size={24} color="#f97316" strokeWidth={2} />
        </View>

        <View className="flex-1 flex-row items-center">
          <Image
            source={{ uri: otherUser.imageUrl }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {isSent ? 'Tipped' : 'Received tip from'} {otherUser.name}
            </Text>
            <Text className="text-gray-500 text-sm">
              {formatTimeAgo(tip.createdAt)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-orange-500 font-bold text-lg">
            {isSent ? '-' : '+'}{tip.amount}
          </Text>
          <Text className="text-gray-400 text-sm">{tip.tokenSymbol}</Text>
        </View>
      </View>
    </View>
  );
};

export default function TipHistory({ tips, currentUserId }: TipHistoryProps) {
  if (tips.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <Coins size={32} color="#71717a" strokeWidth={2} />
        </View>
        <Text className="text-gray-400 text-base">No tips yet</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Start tipping great content!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TipCard tip={item} currentUserId={currentUserId} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

