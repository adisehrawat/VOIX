import { router } from 'expo-router';
import { ArrowLeft, Check, X } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { friendRequestAPI } from '../services/api';
import { useProfile } from '../contexts/ProfileContext';

interface FriendRequest {
  id: string;
  senderid: string;
  reciverid: string;
  status: string;
  sender?: {
    id: string;
    Name: string;
    ImageUrl: string;
    email: string;
  };
  reciver?: {
    id: string;
    Name: string;
    ImageUrl: string;
    email: string;
  };
}

type TabType = 'received' | 'sent';

export default function FriendRequestsScreen() {
  const { userData } = useProfile();
  const { refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!userData?.id) return;

    try {
      setLoading(true);
      console.log('Loading friend requests for user:', userData.id);
      
      const [receivedResponse, sentResponse] = await Promise.all([
        friendRequestAPI.getPendingRequests(),
        friendRequestAPI.getSentRequests()
      ]);

      console.log('Received response:', receivedResponse);
      console.log('Sent response:', sentResponse);

      if (receivedResponse.success && receivedResponse.data) {
        console.log('Setting received requests:', receivedResponse.data);
        setReceivedRequests(Array.isArray(receivedResponse.data) ? receivedResponse.data : []);
      } else {
        console.log('No received requests or error:', receivedResponse.error);
        setReceivedRequests([]);
      }

      if (sentResponse.success && sentResponse.data) {
        console.log('Setting sent requests:', sentResponse.data);
        setSentRequests(Array.isArray(sentResponse.data) ? sentResponse.data : []);
      } else {
        console.log('No sent requests or error:', sentResponse.error);
        setSentRequests([]);
      }
    } catch (error) {
      console.error('Load requests error:', error);
      Alert.alert('Error', 'Failed to load friend requests');
      setReceivedRequests([]);
      setSentRequests([]);
    } finally {
      setLoading(false);
    }
  }, [userData?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  }, [loadRequests]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    try {
      setActionLoading(requestId);
      const response = await friendRequestAPI.acceptRequest(senderId);
      
      if (response.success) {
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
        refreshProfile(); // Refresh friend count
        Alert.alert('Success', 'Friend request accepted!');
      } else {
        Alert.alert('Error', 'Failed to accept friend request');
      }
    } catch (error) {
      console.error('Accept request error:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string, senderId: string) => {
    try {
      setActionLoading(requestId);
      const response = await friendRequestAPI.rejectRequest(senderId);
      
      if (response.success) {
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
        Alert.alert('Success', 'Friend request rejected');
      } else {
        Alert.alert('Error', 'Failed to reject friend request');
      }
    } catch (error) {
      console.error('Reject request error:', error);
      Alert.alert('Error', 'Failed to reject friend request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRequest = async (requestId: string, receiverId: string) => {
    try {
      setActionLoading(requestId);
      const response = await friendRequestAPI.rejectRequest(receiverId);
      
      if (response.success) {
        setSentRequests(prev => prev.filter(req => req.id !== requestId));
        Alert.alert('Success', 'Friend request cancelled');
      } else {
        Alert.alert('Error', 'Failed to cancel friend request');
      }
    } catch (error) {
      console.error('Cancel request error:', error);
      Alert.alert('Error', 'Failed to cancel friend request');
    } finally {
      setActionLoading(null);
    }
  };

  const renderRequestItem = ({ item }: { item: FriendRequest }) => {
    const isReceived = activeTab === 'received';
    const user = isReceived ? item.sender : item.reciver;
    
    if (!user) {
      console.log('No user data for request:', item);
      return (
        <View className="flex-row items-center px-6 py-4 border-b border-zinc-800">
          <View className="w-12 h-12 rounded-full bg-gray-600 mr-4" />
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">Unknown User</Text>
            <Text className="text-gray-400 text-sm">Loading user data...</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-row items-center px-6 py-4 border-b border-zinc-800">
        <Image
          source={{ uri: user.ImageUrl }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">{user.Name}</Text>
          <Text className="text-gray-400 text-sm">{user.email}</Text>
        </View>
        
        {isReceived ? (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleAcceptRequest(item.id, item.senderid)}
              disabled={actionLoading === item.id}
              className="w-10 h-10 items-center justify-center rounded-full bg-green-500"
              activeOpacity={0.7}
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Check size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleRejectRequest(item.id, item.senderid)}
              disabled={actionLoading === item.id}
              className="w-10 h-10 items-center justify-center rounded-full bg-red-500"
              activeOpacity={0.7}
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <X size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => handleCancelRequest(item.id, item.reciverid)}
            disabled={actionLoading === item.id}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-500"
            activeOpacity={0.7}
          >
            {actionLoading === item.id ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <X size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading requests...</Text>
        </View>
      );
    }

    const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;
    
    if (currentRequests.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-lg">
            {activeTab === 'received' ? 'No pending requests' : 'No sent requests'}
          </Text>
          <Text className="text-gray-600 text-sm mt-2">
            {activeTab === 'received' 
              ? 'You have no pending friend requests' 
              : 'You haven\'t sent any friend requests'
            }
          </Text>
        </View>
      );
    }

    return null;
  };

  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-zinc-900">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Friend Requests</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-zinc-900">
        <TouchableOpacity
          onPress={() => setActiveTab('received')}
          className={`flex-1 items-center justify-center py-4 border-b-2 ${
            activeTab === 'received' ? 'border-white' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-semibold ${activeTab === 'received' ? 'text-white' : 'text-zinc-600'}`}>
            Received ({receivedRequests.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('sent')}
          className={`flex-1 items-center justify-center py-4 border-b-2 ${
            activeTab === 'sent' ? 'border-white' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-semibold ${activeTab === 'sent' ? 'text-white' : 'text-zinc-600'}`}>
            Sent ({sentRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <FlatList
        data={currentRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
