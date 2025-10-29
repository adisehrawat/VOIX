import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft, UserPlus } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendRequestModal from '../components/friends/FriendRequestModal';
import FriendsList from '../components/friends/FriendsList';
import { friendAPI, friendRequestAPI } from '../services/api';

export default function Friends() {
  const [showRequests, setShowRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    await friendRequestAPI.acceptRequest(senderId);
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    await loadData();
  };

  const handleRejectRequest = async (requestId: string, senderId: string) => {
    await friendRequestAPI.rejectRequest(senderId);
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleMessage = (friendId: string) => {
    console.log('Messaging friend:', friendId);
    // Navigate to messages
  };

  const handleMore = (friendId: string) => {
    console.log('More options for friend:', friendId);
    // Show more options
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, receivedRes] = await Promise.all([
        friendAPI.getFriends(),
        friendRequestAPI.getSentRequests(),
      ]);
      console.log('Friends API response:', friendsRes);
      console.log('First friend data:', friendsRes?.data?.[0]);
      setFriends(Array.isArray(friendsRes?.data) ? friendsRes.data : []);
      setFriendRequests(Array.isArray(receivedRes?.data) ? receivedRes.data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      {loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FriendsList
          friends={friends.map((f: any) => ({
            id: f.id,
            userId: f.userid,
            friendId: f.friendId,
            user: {
              id: f.user?.id,
              name: f.user?.Name,
              username: f.user?.email,
              email: f.user?.email,
              imageUrl: f.user?.ImageUrl,
              publicKey: '',
              walletId: '',
              authType: 'Password',
              createdAt: new Date(),
            },
            createdAt: new Date(f.createdAt),
            updatedAt: new Date(f.updatedAt),
          }))}
          onMessage={handleMessage}
          onMore={handleMore}
        />
      )}

      {/* Friend Requests Modal */}
      <FriendRequestModal
        visible={showRequests}
        requests={friendRequests.map((r: any) => ({
          id: r.id,
          senderId: r.senderid,
          sender: {
            id: r.sender?.id,
            name: r.sender?.Name,
            username: r.sender?.email,
            email: r.sender?.email,
            imageUrl: r.sender?.ImageUrl,
            publicKey: '',
            walletId: '',
            authType: 'Password',
            createdAt: new Date(),
          },
          receiverId: r.reciverid,
          receiver: {} as any,
          status: 'Requested',
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        }))}
        onClose={() => setShowRequests(false)}
        onAccept={(id: string) => {
          const req = friendRequests.find((fr: any) => fr.id === id);
          if (req) handleAcceptRequest(id, req.senderid);
        }}
        onReject={(id: string) => {
          const req = friendRequests.find((fr: any) => fr.id === id);
          if (req) handleRejectRequest(id, req.senderid);
        }}
      />
    </SafeAreaView>
  );
}

