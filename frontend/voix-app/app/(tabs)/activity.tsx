import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { MessageCircle, UserPlus } from "lucide-react-native";
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendRequestCard from '../../components/friends/FriendRequestCard';
import { useProfile } from '../../contexts/ProfileContext';
import { buzzAPI, friendRequestAPI } from '../../services/api';

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

type LikeActivity = {
  id: string;
  liker: { id: string; Name: string; ImageUrl: string; email?: string };
  buzz: { id: string; content?: string; user: { id: string; Name: string; ImageUrl: string } };
  createdAt: string | Date;
  type: 'like';
};

const ActivityItem = ({ item }: { item: LikeActivity }) => {
  const getActivityText = () => {
    switch (item.type) {
      case 'like':
        return (
          <Text className="text-white text-base flex-1">
            <Text className="font-bold">{item.liker.Name}</Text>
            {' liked your post'}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-row items-center px-6 py-3 border-b border-zinc-900">
      <Image
        source={{ uri: item.liker.ImageUrl }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        {getActivityText()}
        <Text className="text-gray-400 text-sm mt-1">
          {formatTimeAgo(typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const Activity = () => {
  const { userData } = useProfile();
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [likes, setLikes] = useState<LikeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    await friendRequestAPI.acceptRequest(senderId);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRejectRequest = async (requestId: string, senderId: string) => {
    await friendRequestAPI.rejectRequest(senderId);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const loadData = useCallback(async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const [receivedRes, likesRes] = await Promise.all([
        friendRequestAPI.getSentRequests(), // received requests
        buzzAPI.getLikesActivity(1)
      ]);
      setFriendRequests(Array.isArray(receivedRes?.data) ? receivedRes.data : []);
      setLikes(Array.isArray(likesRes?.data) ? likesRes.data : []);
    } catch {
      setFriendRequests([]);
      setLikes([]);
    } finally {
      setLoading(false);
    }
  }, [userData?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
              request={{
                id: request.id,
                senderId: request.senderid,
                sender: {
                  id: request.sender?.id,
                  name: request.sender?.Name,
                  username: request.sender?.email,
                  email: request.sender?.email,
                  imageUrl: request.sender?.ImageUrl,
                  publicKey: '' as any,
                  walletId: '' as any,
                  authType: 'Password' as any,
                  createdAt: new Date(),
                } as any,
                receiverId: request.reciverid,
                receiver: {} as any,
                status: 'Requested',
                createdAt: new Date(request.createdAt),
                updatedAt: new Date(request.updatedAt),
              }}
              onAccept={() => handleAcceptRequest(request.id, request.senderid)}
              onReject={() => handleRejectRequest(request.id, request.senderid)}
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
      
      {loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
      <FlatList
        data={likes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <ActivityItem item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />)}
    </SafeAreaView>
  );
};

export default Activity;