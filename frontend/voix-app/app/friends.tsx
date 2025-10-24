import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendRequestModal from '../components/friends/FriendRequestModal';
import FriendsList from '../components/friends/FriendsList';
import { dummyFriendRequests, dummyFriends } from '../data/dummyFriends';

export default function Friends() {
  const [showRequests, setShowRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState(dummyFriendRequests);
  const [friends, setFriends] = useState(dummyFriends);

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

  const handleMessage = (friendId: string) => {
    console.log('Messaging friend:', friendId);
    // Navigate to messages
  };

  const handleMore = (friendId: string) => {
    console.log('More options for friend:', friendId);
    // Show more options
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <Text 
            className="text-white text-3xl"
            style={{ fontFamily: 'StickNoBills_500Medium' }}
          >
            Friends
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowRequests(true)}
          className="relative"
          activeOpacity={0.7}
        >
          <View className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white">
            <UserPlus size={24} color="#fff" strokeWidth={2} />
          </View>
          {friendRequests.length > 0 && (
            <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {friendRequests.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Friends List */}
      <FriendsList
        friends={friends}
        onMessage={handleMessage}
        onMore={handleMore}
      />

      {/* Friend Requests Modal */}
      <FriendRequestModal
        visible={showRequests}
        requests={friendRequests}
        onClose={() => setShowRequests(false)}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </SafeAreaView>
  );
}

