import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, UserPlus, Check, X, UserMinus, Zap } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchAPI, friendRequestAPI, BuzzData } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext'; // Not needed, using ProfileContext
import { useProfile } from '../../contexts/ProfileContext';
import BuzzCard from '../../components/BuzzCard';

interface UserProfile {
  id: string;
  Name: string;
  ImageUrl: string;
  email: string;
  public_key: string;
  createdAt: string;
  karma: {
    nfts: number;
    points: string;
  }[];
  Friends: { id: string }[]; // Define proper friend interface if needed
  buzz: { id: string }[]; // Define proper buzz interface if needed
}

type FriendshipStatus = 'none' | 'friends' | 'request_sent' | 'request_received';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { userData } = useProfile();
  const { refreshProfile } = useProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [buzzes, setBuzzes] = useState<BuzzData[]>([]);
  const [loading, setLoading] = useState(true);
  const [buzzesLoading, setBuzzesLoading] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('none');
  const [actionLoading, setActionLoading] = useState(false);

  const loadUserProfile = useCallback(async () => {
    if (!id || typeof id !== 'string') return;

    try {
      console.log('Loading user profile:', id);
      setLoading(true);
      const response = await searchAPI.getUserProfile(id);
      console.log('User profile response:', response);
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        Alert.alert('Error', 'User not found');
        router.back();
      }
    } catch (error) {
      console.error('Load user profile error:', error);
      Alert.alert('Error', 'Failed to load user profile');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadFriendshipStatus = useCallback(async () => {
    if (!id || typeof id !== 'string' || !userData?.id) return;

    try {
      const response = await friendRequestAPI.getFriendshipStatus(id);
      if (response.success && response.data) {
        setFriendshipStatus(response.data.status);
      }
    } catch (error) {
      console.error('Load friendship status error:', error);
    }
  }, [id, userData?.id]);

  const loadUserBuzzes = useCallback(async () => {
    if (!id || typeof id !== 'string') return;

    try {
      setBuzzesLoading(true);
      // For now, we'll use the existing getUserBuzzes from BuzzContext
      // In a real implementation, you might want a separate API for other users' buzzes
      const response = await searchAPI.search(id, 'buzzes', 1, 20);
      if (response.success && response.data) {
        setBuzzes(response.data.buzzes);
      }
    } catch (error) {
      console.error('Load user buzzes error:', error);
    } finally {
      setBuzzesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUserProfile();
    loadFriendshipStatus();
    loadUserBuzzes();
  }, [loadUserProfile, loadFriendshipStatus, loadUserBuzzes]);

  const handleFriendAction = async () => {
    if (!profile || !userData?.id || actionLoading) return;

    try {
      setActionLoading(true);

      switch (friendshipStatus) {
        case 'none':
          await friendRequestAPI.sendRequest(profile.id);
          setFriendshipStatus('request_sent');
          Alert.alert('Success', 'Friend request sent!');
          break;
        
        case 'request_received':
          await friendRequestAPI.acceptRequest(profile.id);
          setFriendshipStatus('friends');
          refreshProfile(); // Refresh current user's friend count
          Alert.alert('Success', 'Friend request accepted!');
          break;
        
        case 'friends':
          Alert.alert(
            'Remove Friend',
            `Are you sure you want to remove ${profile.Name} from your friends?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                  await friendRequestAPI.removeFriend(profile.id);
                  setFriendshipStatus('none');
                  refreshProfile(); // Refresh current user's friend count
                  Alert.alert('Success', 'Friend removed');
                }
              }
            ]
          );
          break;
        
        case 'request_sent':
          Alert.alert('Info', 'Friend request already sent');
          break;
      }
    } catch (error) {
      console.error('Friend action error:', error);
      Alert.alert('Error', 'Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const getActionButton = () => {
    if (!profile || !userData?.id) return null;

    const isOwnProfile = profile.id === userData.id;
    if (isOwnProfile) return null;

    const buttonConfig = {
      'none': { text: 'Add Friend', icon: UserPlus, color: 'bg-blue-500' },
      'request_sent': { text: 'Request Sent', icon: Check, color: 'bg-gray-500' },
      'request_received': { text: 'Accept Request', icon: Check, color: 'bg-green-500' },
      'friends': { text: 'Remove Friend', icon: UserMinus, color: 'bg-red-500' }
    };

    const config = buttonConfig[friendshipStatus];
    const Icon = config.icon;

    return (
      <TouchableOpacity
        onPress={handleFriendAction}
        disabled={actionLoading || friendshipStatus === 'request_sent'}
        className={`flex-row items-center px-6 py-3 rounded-xl ${config.color} ${
          actionLoading || friendshipStatus === 'request_sent' ? 'opacity-50' : ''
        }`}
        activeOpacity={0.7}
      >
        {actionLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Icon size={20} color="#ffffff" />
        )}
        <Text className="text-white font-semibold ml-2">{config.text}</Text>
      </TouchableOpacity>
    );
  };

  const renderBuzzItem = ({ item }: { item: BuzzData }) => (
    <BuzzCard buzz={item} />
  );

  const renderEmptyState = () => {
    if (buzzesLoading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading buzzes...</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-500 text-lg">No buzzes yet</Text>
        <Text className="text-gray-600 text-sm mt-2">This user hasn&apos;t posted anything</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">User not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 bg-blue-500 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
        <Text className="text-white text-lg font-semibold">Profile</Text>
      </View>

      {/* Profile Info */}
      <View className="px-6 pb-6 mt-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <View className="relative">
              <Image
                source={{ uri: profile.ImageUrl }}
                className="w-20 h-20 rounded-full"
              />
              {profile.karma[0].nfts > 0 && (
                <View className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-black items-center justify-center">
                  <Text className="text-xs">🏆</Text>
                </View>
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-bold">{profile.Name}</Text>
              <Text className="text-gray-400 text-sm">{profile.email}</Text>
              {/* Karma Badge */}
              <View className="flex-row items-center bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30 mt-1 self-start">
                <Zap size={12} color="#a855f7" strokeWidth={2.5} fill="#a855f7" />
                <Text className="text-purple-500 font-semibold text-xs ml-1">
                  {profile.karma[0].points} Karma
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mb-4">
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{profile.buzz.length}</Text>
            <Text className="text-gray-400 text-sm">posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{profile.Friends.length}</Text>
            <Text className="text-gray-400 text-sm">friends</Text>
          </View>
        </View>

        {/* Action Button */}
        {getActionButton()}
      </View>

      {/* Buzzes */}
      <View className="flex-1">
        <View className="px-6 py-3 bg-zinc-900/50">
          <Text className="text-white font-semibold text-lg">Posts</Text>
        </View>
        
        <FlatList
          data={buzzes}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderBuzzItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
