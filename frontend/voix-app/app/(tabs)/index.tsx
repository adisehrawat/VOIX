import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { useFocusEffect } from "@react-navigation/native";
import { MessageCircle } from "lucide-react-native";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BuzzCard from "../../components/BuzzCard";
import { BuzzData } from "../../services/api";
import { useBuzz } from "../../contexts/BuzzContext";

// Memoized BuzzCard for better performance
const MemoizedBuzzCard = memo(BuzzCard);

export default function Index() {
  const { getBuzzes, invalidateBuzzCache } = useBuzz();
  const [buzzes, setBuzzes] = useState<BuzzData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const isFirstFocus = useRef(true);

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  useEffect(() => {
    loadBuzzes(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't auto-refresh on focus - let user use pull-to-refresh manually
  // This prevents unnecessary refreshes when navigating back from buzz detail
  useFocusEffect(
    useCallback(() => {
      // Skip the first focus (initial mount)
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      
      // Don't auto-refresh - user can pull-to-refresh if they want
      // This keeps the scroll position and data stable when returning from buzz detail
      console.log('Screen focused - keeping existing data');
    }, [])
  );

  const loadBuzzes = async (pageNum: number, isRefresh: boolean = false) => {
    // Prevent multiple simultaneous loads
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      // Only show loading indicator for pagination, not initial load
      if (!isRefresh || buzzes.length > 0) {
        setLoading(true);
      }
      
      console.log(`Loading buzzes - page: ${pageNum}`);

      // Use context to get buzzes (with caching)
      const newBuzzes = await getBuzzes(pageNum, isRefresh);
      
      if (newBuzzes && newBuzzes.length > 0) {
        console.log(`Loaded ${newBuzzes.length} buzzes from context`);

        if (isRefresh) {
          setBuzzes(newBuzzes);
          setPage(1);
          setHasMore(newBuzzes.length === 10);
        } else {
          setBuzzes(prev => [...prev, ...newBuzzes]);
          setHasMore(newBuzzes.length === 10);
        }
      } else {
        if (isRefresh) {
          setBuzzes([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading buzzes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoad(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    // Invalidate cache to force fresh data
    invalidateBuzzCache();
    loadBuzzes(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidateBuzzCache]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadBuzzes(nextPage, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, page]);

  const renderFooter = useCallback(() => {
    // Only show footer loader when loading more pages (not initial load)
    if (!loading || initialLoad) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  }, [loading, initialLoad]);

  const renderEmpty = useCallback(() => {
    // Show loader only during initial load
    if (initialLoad && loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading buzzes...</Text>
        </View>
      );
    }

    // Show empty state only when not loading and no buzzes
    if (!loading && buzzes.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-lg">No buzzes yet</Text>
          <Text className="text-gray-600 text-sm mt-2">Be the first to create one!</Text>
        </View>
      );
    }

    return null;
  }, [initialLoad, loading, buzzes.length]);

  const renderItem = useCallback(({ item }: { item: BuzzData }) => (
    <MemoizedBuzzCard buzz={item} onVoteUpdate={handleRefresh} />
  ), [handleRefresh]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 400, // Approximate height of a buzz card
    offset: 400 * index,
    index,
  }), []);

  if (!fontsLoaded) return null;

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
          className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white"
          activeOpacity={0.7}
        >
          <MessageCircle size={24} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={buzzes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={10}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
          />
        }
      />
    </SafeAreaView>
  );
}
