import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { ArrowLeftRight, Grid3x3, MessageCircle, Settings, UserPlus } from 'lucide-react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileHeader from '../../../components/pages/profile/ProfileHeader';
import BuzzCard from '../../../components/BuzzCard';
import ReplyCard from '../../../components/ReplyCard';
import TransactionCard from '../../../components/transactions/TransactionCard';
import { useProfile } from '../../../contexts/ProfileContext';
import { useBuzz } from '../../../contexts/BuzzContext';
import { BuzzData, walletAPI } from '../../../services/api';

type TabType = 'buzzes' | 'replies' | 'transactions';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('buzzes');
  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });
  const { userData, karmaData, friendsCount, refreshProfile } = useProfile();
  const { getUserBuzzes, getUserReplies } = useBuzz();
  const [refreshing, setRefreshing] = useState(false);
  
  // Buzzes state
  const [buzzes, setBuzzes] = useState<BuzzData[]>([]);
  const [buzzesLoading, setBuzzesLoading] = useState(false);
  const [buzzPage, setBuzzPage] = useState(1);
  const [buzzHasMore, setBuzzHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const isFirstFocus = useRef(true);

  // Replies state
  const [replies, setReplies] = useState<BuzzData[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyPage, setReplyPage] = useState(1);
  const [replyHasMore, setReplyHasMore] = useState(true);
  const [replyInitialLoad, setReplyInitialLoad] = useState(true);

  // Transactions state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionHasMore, setTransactionHasMore] = useState(true);
  const [transactionInitialLoad, setTransactionInitialLoad] = useState(true);


  // Initial load is now handled in the tab switching useEffect


  // Load data when tab changes
  useEffect(() => {
    if (!userData?.id) return;
    
    if (activeTab === 'buzzes' && initialLoad) {
      loadUserBuzzes(1, true);
    } else if (activeTab === 'replies' && replyInitialLoad) {
      loadUserReplies(1, true);
    } else if (activeTab === 'transactions' && transactionInitialLoad) {
      loadTransactions(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userData?.id]);

  // Refresh when screen comes into focus (e.g., after creating a buzz)
  useFocusEffect(
    useCallback(() => {
      // Skip the first focus (initial mount)
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      
      // Only refresh if not the initial load and user data is available
      if (!initialLoad && userData?.id) {
        console.log('Profile focused - refreshing current tab and karma');
        // Refresh karma data
        refreshProfile();
        
        if (activeTab === 'buzzes') {
          loadUserBuzzes(1, true);
        } else if (activeTab === 'replies') {
          loadUserReplies(1, true);
        } else if (activeTab === 'transactions') {
          loadTransactions(1, true);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLoad, userData?.id, activeTab])
  );

  const loadUserBuzzes = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    if (buzzesLoading || (!buzzHasMore && !isRefresh) || !userData?.id) return;

    try {
      setBuzzesLoading(true);
      console.log(`Loading user buzzes - page: ${pageNum}`);

      const newBuzzes = await getUserBuzzes(userData.id, pageNum, isRefresh);
      console.log(`Loaded ${newBuzzes.length} user buzzes`);

      if (isRefresh) {
        setBuzzes(newBuzzes);
        setBuzzPage(1);
        setBuzzHasMore(newBuzzes.length === 10);
      } else {
        setBuzzes(prev => [...prev, ...newBuzzes]);
        setBuzzHasMore(newBuzzes.length === 10);
      }
    } catch (error) {
      console.error('Error loading user buzzes:', error);
    } finally {
      setBuzzesLoading(false);
      setInitialLoad(false);
    }
  }, [buzzesLoading, buzzHasMore, userData?.id, getUserBuzzes]);

  const loadUserReplies = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    if (repliesLoading || (!replyHasMore && !isRefresh) || !userData?.id) return;

    try {
      setRepliesLoading(true);
      console.log(`Loading user replies - page: ${pageNum}`);

      const newReplies = await getUserReplies(userData.id, pageNum, isRefresh);
      console.log(`Loaded ${newReplies.length} user replies`);

      if (isRefresh) {
        setReplies(newReplies);
        setReplyPage(1);
        setReplyHasMore(newReplies.length === 10);
      } else {
        setReplies(prev => [...prev, ...newReplies]);
        setReplyHasMore(newReplies.length === 10);
      }
    } catch (error) {
      console.error('Error loading user replies:', error);
    } finally {
      setRepliesLoading(false);
      setReplyInitialLoad(false);
    }
  }, [repliesLoading, replyHasMore, userData?.id, getUserReplies]);

  const loadTransactions = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    if (transactionsLoading || (!transactionHasMore && !isRefresh)) return;

    try {
      setTransactionsLoading(true);
      console.log(`Loading transactions - page: ${pageNum}`);

      const response = await walletAPI.getTransactions(pageNum);
      console.log('Transactions API response:', response);

      if (response.success && response.data) {
        const newTransactions = response.data.transactions || [];
        console.log(`Loaded ${newTransactions.length} transactions`);

        if (isRefresh) {
          setTransactions(newTransactions);
          setTransactionPage(1);
          setTransactionHasMore(newTransactions.length === 10);
        } else {
          setTransactions(prev => [...prev, ...newTransactions]);
          setTransactionHasMore(newTransactions.length === 10);
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setTransactionsLoading(false);
      setTransactionInitialLoad(false);
    }
  }, [transactionsLoading, transactionHasMore]);

  const handleRefresh = async () => {
    setRefreshing(true);
    
    if (activeTab === 'buzzes') {
      setBuzzHasMore(true);
      await Promise.all([
        refreshProfile(),
        loadUserBuzzes(1, true)
      ]);
    } else if (activeTab === 'replies') {
      setReplyHasMore(true);
      await Promise.all([
        refreshProfile(),
        loadUserReplies(1, true)
      ]);
    } else if (activeTab === 'transactions') {
      setTransactionHasMore(true);
      await Promise.all([
        refreshProfile(),
        loadTransactions(1, true)
      ]);
    }
    
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (activeTab === 'buzzes' && !buzzesLoading && buzzHasMore) {
      const nextPage = buzzPage + 1;
      setBuzzPage(nextPage);
      loadUserBuzzes(nextPage, false);
    } else if (activeTab === 'replies' && !repliesLoading && replyHasMore) {
      const nextPage = replyPage + 1;
      setReplyPage(nextPage);
      loadUserReplies(nextPage, false);
    } else if (activeTab === 'transactions' && !transactionsLoading && transactionHasMore) {
      const nextPage = transactionPage + 1;
      setTransactionPage(nextPage);
      loadTransactions(nextPage, false);
    }
  };

  const handleFriendsPress = useCallback(() => {
    router.push('/friends');
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    
    // Load data for the selected tab if not already loaded
    if (!userData?.id) return;
    
    if (tab === 'buzzes' && buzzes.length === 0 && !buzzesLoading) {
      loadUserBuzzes(1, true);
    } else if (tab === 'replies' && replies.length === 0 && !repliesLoading) {
      loadUserReplies(1, true);
    } else if (tab === 'transactions' && transactions.length === 0 && !transactionsLoading) {
      loadTransactions(1, true);
    }
  }, [userData?.id, buzzes.length, replies.length, transactions.length, buzzesLoading, repliesLoading, transactionsLoading, loadUserBuzzes, loadUserReplies, loadTransactions]);

  const renderHeader = useCallback(() => (
      <>
        <ProfileHeader 
          user={{
            id: userData!.id,
            name: userData!.Name,
            username: `@${userData!.Name.toLowerCase().replace(/\s+/g, '')}`,
            avatar: userData!.ImageUrl,
            bio: '', // No bio in backend schema yet
            stats: {
              posts: buzzes.length, // Show actual buzz count
              friends: friendsCount, // Show actual friends count
            },
            coins: 0, // Can add wallet balance later
          }}
          karma={karmaData ? parseInt(karmaData.points) : 0}
          nfts={karmaData?.nfts || 0}
          onFriendsPress={handleFriendsPress}
        />

      {/* Tab Navigation */}
        <View className="flex-row border-t border-zinc-900 mb-2">
          <TouchableOpacity
          onPress={() => handleTabChange('buzzes')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
            activeTab === 'buzzes' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
          <View className="items-center">
            <Grid3x3
              size={24}
              color={activeTab === 'buzzes' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
            <Text className={`text-xs mt-1 ${activeTab === 'buzzes' ? 'text-white' : 'text-zinc-600'}`}>
              Buzzes
            </Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => handleTabChange('replies')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
            activeTab === 'replies' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
          <View className="items-center">
            <MessageCircle
              size={24}
              color={activeTab === 'replies' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
            <Text className={`text-xs mt-1 ${activeTab === 'replies' ? 'text-white' : 'text-zinc-600'}`}>
              Replies
            </Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => handleTabChange('transactions')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
            activeTab === 'transactions' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
          <View className="items-center">
            <ArrowLeftRight
              size={24}
              color={activeTab === 'transactions' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
            <Text className={`text-xs mt-1 ${activeTab === 'transactions' ? 'text-white' : 'text-zinc-600'}`}>
              Transactions
            </Text>
          </View>
          </TouchableOpacity>
      </View>
    </>
  ), [userData, karmaData, friendsCount, buzzes.length, activeTab, handleFriendsPress, handleTabChange]);

  const renderBuzzItem = useCallback(({ item }: { item: BuzzData }) => (
    <BuzzCard buzz={item} onVoteUpdate={() => loadUserBuzzes(1, true)} />
  ), [loadUserBuzzes]);

  const renderReplyItem = useCallback(({ item }: { item: BuzzData }) => (
    <ReplyCard reply={item} />
  ), []);

  const renderTransactionItem = useCallback(({ item }: { item: any }) => (
    <TransactionCard transaction={item} currentUserId={userData?.id || ''} />
  ), [userData?.id]);

  const renderFooter = () => {
    // Only show footer loading when loading more data (pagination), not initial load
    const isPaginationLoading = 
      (activeTab === 'buzzes' && buzzesLoading && buzzes.length > 0) ||
      (activeTab === 'replies' && repliesLoading && replies.length > 0) ||
      (activeTab === 'transactions' && transactionsLoading && transactions.length > 0);
    
    if (!isPaginationLoading) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  };

  const renderEmptyState = () => {
    // Check if we're loading data for the first time
    const isInitialLoading = 
      (activeTab === 'buzzes' && buzzesLoading && buzzes.length === 0) ||
      (activeTab === 'replies' && repliesLoading && replies.length === 0) ||
      (activeTab === 'transactions' && transactionsLoading && transactions.length === 0);

    // Show loading indicator when loading for the first time
    if (isInitialLoading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">
            {activeTab === 'buzzes' ? 'Loading buzzes...' : 
             activeTab === 'replies' ? 'Loading replies...' : 
             'Loading transactions...'}
          </Text>
        </View>
      );
    }

    // Show empty state when no data and not loading
    if (activeTab === 'buzzes') {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-base">No buzzes yet</Text>
          <Text className="text-gray-600 text-sm mt-2">Start creating to see them here!</Text>
        </View>
      );
    } else if (activeTab === 'replies') {
        return (
          <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-base">No replies yet</Text>
          <Text className="text-gray-600 text-sm mt-2">Your comments will appear here</Text>
          </View>
        );
    } else {
        return (
          <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-base">No transactions yet</Text>
          <Text className="text-gray-600 text-sm mt-2">Your transaction history will appear here</Text>
          </View>
        );
    }
  };

  if (!fontsLoaded) return null;

  // Only show global loading when userData is not available (initial load)
  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

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
        <View className="flex-row gap-2">
          <TouchableOpacity 
            onPress={() => router.push('/friend-requests')}
            className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white"
            activeOpacity={0.7}
          >
            <UserPlus size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/settings')}
            className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white"
            activeOpacity={0.7}
          >
            <Settings size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={activeTab === 'buzzes' ? buzzes : activeTab === 'replies' ? replies : transactions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={activeTab === 'buzzes' ? renderBuzzItem : activeTab === 'replies' ? renderReplyItem : renderTransactionItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
