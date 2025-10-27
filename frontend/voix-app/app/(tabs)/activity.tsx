import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { MessageCircle, UserPlus } from "lucide-react-native";
import { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendRequestCard from '../../components/friends/FriendRequestCard';
import { Activity as ActivityType, dummyActivities } from '../../data/dummyActivity';
import { dummyFriendRequests } from '../../data/dummyFriends';

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const ActivityItem = ({ item }: { item: ActivityType }) => {
  const getActivityText = () => {
    switch (item.type) {
      case 'tip':
        return (
          <Text className="text-white text-base flex-1">
            <Text className="font-bold">{item.user.name}</Text>
            {' tipped '}
            <Text className="font-bold">{item.targetUser?.name}</Text>
            {' '}
            <Text className="font-bold">{item.amount} {item.post?.preview}</Text>
            {' for your recent post.'}
          </Text>
        );
      case 'like':
        return (
          <Text className="text-white text-base flex-1">
            <Text className="font-bold">{item.user.name}</Text>
            {' liked '}
            <Text className="font-bold">{item.targetUser?.name}&apos;s</Text>
            {' post.'}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-row items-center px-6 py-3 border-b border-zinc-900">
      <Image
        source={{ uri: item.user.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        {getActivityText()}
        <Text className="text-gray-400 text-sm mt-1">
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const Activity = () => {
  const [friendRequests, setFriendRequests] = useState(dummyFriendRequests);
  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepting request:', requestId);
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  if (!fontsLoaded) return null;

  const renderHeader = () => (
    <>
      {friendRequests.length > 0 && (
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center mb-3">
            <UserPlus size={20} color="#3b82f6" strokeWidth={2} />
            <Text className="text-white text-lg font-bold ml-2">
              Friend Requests ({friendRequests.length})
            </Text>
          </View>
          {friendRequests.map(request => (
            <FriendRequestCard
              key={request.id}
              request={request}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          ))}
          <View className="border-t border-zinc-900 mt-4 mb-2" />
        </View>
      )}
      <View className="px-6 py-3">
        <Text className="text-white text-lg font-bold">Recent Activity</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
        <Text 
          className="text-white text-5xl"
          style={{ fontFamily: 'StickNoBills_500Medium' }}
        >
          Voix
        </Text>
        <TouchableOpacity 
          className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white relative"
          activeOpacity={0.7}
        >
          <MessageCircle size={24} color="#fff" strokeWidth={2} />
          {friendRequests.length > 0 && (
            <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {friendRequests.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={dummyActivities}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <ActivityItem item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Activity;