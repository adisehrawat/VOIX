import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { Search, User } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { searchAPI, friendRequestAPI, BuzzData } from '../../services/api';
import { useProfile } from '../../contexts/ProfileContext';
import BuzzCard from '../../components/BuzzCard';

interface SearchUser {
  id: string;
  Name: string;
  ImageUrl: string;
  email: string;
  public_key: string;
  createdAt: string;
}

interface SearchResults {
  users: SearchUser[];
  buzzes: BuzzData[];
  totalUsers: number;
  totalBuzzes: number;
  page: number;
  limit: number;
}

type SearchType = 'all' | 'users' | 'buzzes';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [friendshipStatuses, setFriendshipStatuses] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { userData, refreshProfile } = useProfile();
  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  const loadFriendshipStatuses = useCallback(async (users: SearchUser[]) => {
    if (!userData?.id) return;

    try {
      const statusPromises = users.map(async (user) => {
        if (user.id === userData.id) return { userId: user.id, status: 'self' };
        
        try {
          const response = await friendRequestAPI.getFriendshipStatus(user.id);
          return { 
            userId: user.id, 
            status: response.success ? response.data.status : 'none' 
          };
        } catch (error) {
          console.error('Error loading friendship status for user:', user.id, error);
          return { userId: user.id, status: 'none' };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = statuses.reduce((acc, { userId, status }) => {
        acc[userId] = status;
        return acc;
      }, {} as Record<string, string>);

      setFriendshipStatuses(prev => ({ ...prev, ...statusMap }));
    } catch (error) {
      console.error('Error loading friendship statuses:', error);
    }
  }, [userData?.id]);

  const search = useCallback(async (searchQuery: string, type: SearchType, pageNum: number = 1, isRefresh: boolean = false) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      const response = await searchAPI.search(searchQuery, type, pageNum, 10);
      
      if (response.success && response.data) {
        if (isRefresh || pageNum === 1) {
          setResults(response.data);
          // Load friendship statuses for users
          if (response.data.users && response.data.users.length > 0) {
            loadFriendshipStatuses(response.data.users);
          }
        } else {
          setResults(prev => ({
            ...response.data,
            users: [...(prev?.users || []), ...response.data.users],
            buzzes: [...(prev?.buzzes || []), ...response.data.buzzes]
          }));
          // Load friendship statuses for new users
          if (response.data.users && response.data.users.length > 0) {
            loadFriendshipStatuses(response.data.users);
          }
        }
        setHasMore(
          (type === 'all' || type === 'users' ? response.data.users.length === 10 : true) &&
          (type === 'all' || type === 'buzzes' ? response.data.buzzes.length === 10 : true)
        );
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [loadFriendshipStatuses]);

  useEffect(() => {
    if (query.trim()) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
      setResults(null);
    }

    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        search(query, searchType, 1, true);
        setPage(1);
        setIsTyping(false);
      }
    }, 2000); // Wait 2 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query, searchType, search]);

  const handleLoadMore = () => {
    if (!loading && hasMore && query.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      search(query, searchType, nextPage, false);
    }
  };

  const handleUserPress = (user: SearchUser) => {
    router.push(`/user-profile/${user.id}`);
  };

  const handleFriendAction = async (user: SearchUser) => {
    if (!userData?.id || actionLoading === user.id) return;

    try {
      setActionLoading(user.id);

      const status = friendshipStatuses[user.id] || 'none';

      switch (status) {
        case 'none':
          await friendRequestAPI.sendRequest(user.id);
          setFriendshipStatuses(prev => ({ ...prev, [user.id]: 'request_sent' }));
          break;
        
        case 'request_received':
          await friendRequestAPI.acceptRequest(user.id);
          setFriendshipStatuses(prev => ({ ...prev, [user.id]: 'friends' }));
          refreshProfile(); // Refresh friend count
          break;
        
        case 'friends':
          await friendRequestAPI.removeFriend(user.id);
          setFriendshipStatuses(prev => ({ ...prev, [user.id]: 'none' }));
          refreshProfile(); // Refresh friend count
          break;
        
        case 'request_sent':
          // Already sent request, do nothing
          break;
        
        case 'self':
          // Can't friend yourself
          break;
      }
    } catch (error) {
      console.error('Friend action error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const renderUserItem = ({ item }: { item: SearchUser }) => (
    <UserSearchCard 
      user={item} 
      onPress={() => handleUserPress(item)}
      onFriendAction={() => handleFriendAction(item)}
      friendshipStatus={friendshipStatuses[item.id] || 'none'}
      actionLoading={actionLoading === item.id}
    />
  );

  const renderBuzzItem = ({ item }: { item: BuzzData }) => (
    <BuzzCard buzz={item} />
  );

  const renderEmptyState = () => {
    // Show loading only when actually searching (not when typing)
    if (loading && !isTyping) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Searching...</Text>
        </View>
      );
    }

    // Show typing indicator only when typing and not loading
    if (isTyping && !loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#71717a" /> 
        </View>
      );
    }

    if (!query.trim()) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Search size={64} color="#71717a" />
          <Text className="text-gray-500 text-lg mt-4">Search for users or buzzes</Text>
          <Text className="text-gray-600 text-sm mt-2">Type a name or buzz content to get started</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-500 text-lg">No results found</Text>
        <Text className="text-gray-600 text-sm mt-2">Try a different search term</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
        <Text 
          className="text-white text-5xl"
          style={{ fontFamily: 'StickNoBills_500Medium' }}
        >
          Explore
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 py-3">
          <Search size={20} color="#71717a" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search users or buzzes..."
            placeholderTextColor="#71717a"
            className="flex-1 text-white text-base ml-3"
            autoFocus
          />
          {isTyping && !loading && (
            <View className="ml-2">
              <ActivityIndicator size="small" color="#71717a" />
            </View>
          )}
        </View>
      </View>

      {/* Search Type Tabs */}
      <View className="flex-row border-b border-zinc-900">
        <TouchableOpacity
          onPress={() => setSearchType('all')}
          className={`flex-1 items-center justify-center py-4 border-b-2 ${
            searchType === 'all' ? 'border-white' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-semibold ${searchType === 'all' ? 'text-white' : 'text-zinc-600'}`}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setSearchType('users')}
          className={`flex-1 items-center justify-center py-4 border-b-2 ${
            searchType === 'users' ? 'border-white' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-semibold ${searchType === 'users' ? 'text-white' : 'text-zinc-600'}`}>
            Users
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setSearchType('buzzes')}
          className={`flex-1 items-center justify-center py-4 border-b-2 ${
            searchType === 'buzzes' ? 'border-white' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-semibold ${searchType === 'buzzes' ? 'text-white' : 'text-zinc-600'}`}>
            Buzzes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={
          searchType === 'users' ? (results?.users || []) :
          searchType === 'buzzes' ? (results?.buzzes || []) :
          [...(results?.users || []), ...(results?.buzzes || [])]
        }
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => {
          if ('Name' in item) {
            return renderUserItem({ item: item as SearchUser });
          } else {
            return renderBuzzItem({ item: item as BuzzData });
          }
        }}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

// User Search Card Component
interface UserSearchCardProps {
  user: SearchUser;
  onPress: () => void;
  onFriendAction: () => void;
  friendshipStatus: string;
  actionLoading: boolean;
}

function UserSearchCard({ user, onPress, onFriendAction, friendshipStatus, actionLoading }: UserSearchCardProps) {
  const getActionButton = () => {
    if (friendshipStatus === 'self') return null;

    const buttonConfig = {
      'none': { text: 'Add Friend', color: 'bg-blue-500' },
      'request_sent': { text: 'Request Sent', color: 'bg-gray-500' },
      'request_received': { text: 'Accept', color: 'bg-green-500' },
      'friends': { text: 'Remove', color: 'bg-red-500' }
    };

    const config = buttonConfig[friendshipStatus as keyof typeof buttonConfig] || buttonConfig['none'];

    return (
      <TouchableOpacity
        onPress={onFriendAction}
        disabled={actionLoading || friendshipStatus === 'request_sent'}
        className={`px-4 py-2 rounded-lg ${config.color} ${
          actionLoading || friendshipStatus === 'request_sent' ? 'opacity-50' : ''
        }`}
        activeOpacity={0.7}
      >
        {actionLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text className="text-white text-sm font-semibold">{config.text}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-row items-center px-6 py-4 border-b border-zinc-800">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center flex-1"
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: user.ImageUrl }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">{user.Name}</Text>
          <Text className="text-gray-400 text-sm">{user.email}</Text>
        </View>
        <User size={20} color="#71717a" />
      </TouchableOpacity>
      
      {getActionButton()}
    </View>
  );
}

export default Explore;
