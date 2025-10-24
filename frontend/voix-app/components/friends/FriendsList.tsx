import { UserPlus } from 'lucide-react-native';
import { FlatList, Text, View } from 'react-native';
import { Friend } from '../../types';
import FriendCard from './FriendCard';

interface FriendsListProps {
  friends: Friend[];
  onMessage: (friendId: string) => void;
  onMore: (friendId: string) => void;
}

export default function FriendsList({ friends, onMessage, onMore }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <UserPlus size={32} color="#71717a" strokeWidth={2} />
        </View>
        <Text className="text-gray-400 text-base">No friends yet</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Start connecting with people!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FriendCard
          friend={item}
          onMessage={onMessage}
          onMore={onMore}
        />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

