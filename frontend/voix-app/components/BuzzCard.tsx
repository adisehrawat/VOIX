import { router } from 'expo-router';
import { ArrowDown, ArrowUp, MessageCircle } from 'lucide-react-native';
import { useState, useEffect, memo, useMemo } from 'react';
import { Alert, Image, Text, TouchableOpacity, View, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buzzAPI, BuzzData } from '../services/api';
import { STORAGE_KEYS } from '../config/constants';
import EnhancedTipModal from './tips/EnhancedTipModal';
import { useBuzz } from '../contexts/BuzzContext';
import { useProfile } from '../contexts/ProfileContext';

interface BuzzCardProps {
  buzz: BuzzData;
  onVoteUpdate?: () => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Helper to decode JWT and get user ID
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log('getCurrentUserId - Token key:', STORAGE_KEYS.TOKEN);
    console.log('getCurrentUserId - Token exists:', !!token);
    
    if (!token) {
      console.log('getCurrentUserId - No token found');
      return null;
    }
    
    const parts = token.split('.');
    console.log('getCurrentUserId - Token parts:', parts.length);
    
    if (parts.length !== 3) {
      console.log('getCurrentUserId - Invalid token format');
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('getCurrentUserId - Decoded payload:', payload);
    console.log('getCurrentUserId - User ID:', payload.id);
    
    return payload.id || null;
  } catch (error) {
    console.error('getCurrentUserId - Error:', error);
    return null;
  }
};

const BuzzCard = ({ buzz, onVoteUpdate }: BuzzCardProps) => {
  const { getBuzzById } = useBuzz();
  const { refreshProfile } = useProfile();
  const [showTipModal, setShowTipModal] = useState(false);
  const [userVote, setUserVote] = useState<'UpVote' | 'DownVote' | null>(null);
  const [voting, setVoting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [localBuzz, setLocalBuzz] = useState(buzz);

  // Get current user ID on mount (only once)
  useEffect(() => {
    const initializeUserId = async () => {
      const userId = await getCurrentUserId();
      console.log('BuzzCard - Setting currentUserId:', userId);
      setCurrentUserId(userId);
    };
    
    initializeUserId();
  }, []); // Run only once on mount

  // Check vote status whenever localBuzz.Vote or currentUserId changes
  useEffect(() => {
    if (currentUserId && localBuzz.Vote) {
      const existingVote = localBuzz.Vote.find(v => v.userid === currentUserId);
      if (existingVote && existingVote.type) {
        console.log('BuzzCard - Found existing vote:', existingVote.type);
        setUserVote(existingVote.type);
      } else {
        console.log('BuzzCard - No existing vote found');
        setUserVote(null);
      }
    }
  }, [currentUserId, localBuzz.Vote]);

  // Update local buzz when prop changes
  useEffect(() => {
    setLocalBuzz(buzz);
  }, [buzz]);

  // Calculate vote counts from local buzz
  const upvotes = useMemo(() => {
    if (!localBuzz.Vote || !Array.isArray(localBuzz.Vote)) return 0;
    return localBuzz.Vote.filter(v => v && v.type === 'UpVote').length;
  }, [localBuzz.Vote]);
  
  const downvotes = useMemo(() => {
    if (!localBuzz.Vote || !Array.isArray(localBuzz.Vote)) return 0;
    return localBuzz.Vote.filter(v => v && v.type === 'DownVote').length;
  }, [localBuzz.Vote]);
  
  const commentCount = localBuzz._count?.replies || 0;

  // Debug logging
  useEffect(() => {
    console.log(`Buzz ${localBuzz.id} stats:`, {
      totalVotes: localBuzz.Vote?.length || 0,
      upvotes,
      downvotes,
      comments: commentCount,
      userVote
    });
  }, [localBuzz.id, localBuzz.Vote, upvotes, downvotes, commentCount, userVote]);

  const handlePress = () => {
    router.push(`/buzz/${buzz.id}`);
  };

  const handleVote = async (type: 'UpVote' | 'DownVote') => {
    console.log('handleVote called:', { type, voting, currentUserId, userVote });
    
    if (voting) {
      console.log('Already voting, skipping...');
      return;
    }
    
    if (!currentUserId) {
      console.log('No user ID, showing alert');
      Alert.alert('Login Required', 'Please login to vote');
      return;
    }

    console.log(`Attempting to ${type} buzz ${buzz.id}`);
    const previousVote = userVote;

    try {
      setVoting(true);

      // Optimistic UI update
      if (userVote === type) {
        console.log(`Removing ${type} from buzz ${buzz.id}`);
        setUserVote(null);
        
        const updatedVotes = localBuzz.Vote.filter(v => v.userid !== currentUserId);
        setLocalBuzz({ ...localBuzz, Vote: updatedVotes });
        
        await buzzAPI.deleteVote(buzz.id);
      } else if (userVote && userVote !== type) {
        console.log(`Switching vote from ${userVote} to ${type} on buzz ${buzz.id}`);
        setUserVote(type);
        
        const updatedVotes = localBuzz.Vote.map(v => 
          v.userid === currentUserId ? { ...v, type } : v
        );
        setLocalBuzz({ ...localBuzz, Vote: updatedVotes });
        
        await buzzAPI.createVote(buzz.id, type);
      } else {
        console.log(`Adding ${type} to buzz ${buzz.id}`);
        setUserVote(type);
        
        const updatedVotes = [...localBuzz.Vote, { userid: currentUserId, type }];
        setLocalBuzz({ ...localBuzz, Vote: updatedVotes });
        
        await buzzAPI.createVote(buzz.id, type);
      }

      console.log('Vote successful!');

      // Refresh karma data if the vote affects karma (upvote)
      if (type === 'UpVote' || (previousVote === 'UpVote' && type === 'DownVote')) {
        refreshProfile();
      }

      // Fetch updated buzz from backend to sync cache
      setTimeout(async () => {
        const updatedBuzz = await getBuzzById(buzz.id, true);
        if (updatedBuzz) {
          setLocalBuzz(updatedBuzz);
        }
      }, 500);

    } catch (error) {
      console.error('Error voting:', error);
      setUserVote(previousVote);
      setLocalBuzz(buzz);
      Alert.alert('Error', 'Failed to vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <>
    <View className="bg-zinc-900 rounded-3xl mx-4 mb-4 p-5 border border-zinc-800">
      {/* Clickable content area */}
      <Pressable onPress={handlePress}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: localBuzz.user.ImageUrl, cache: 'force-cache' }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                {localBuzz.user.Name}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formatTimeAgo(new Date(localBuzz.createdAt))}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={(e) => {
              setShowTipModal(true);
            }}
            className="bg-orange-500 px-4 py-2 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-white font-medium px-2">💰 Tip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {localBuzz.content && (
          <Text className="text-white text-base mb-4 leading-6">
            {localBuzz.content}
          </Text>
        )}

        {/* Image */}
        {localBuzz.image && (
          <View className="mb-4 rounded-2xl overflow-hidden">
            <Image
              source={{ uri: localBuzz.image, cache: 'force-cache' }}
              className="w-full h-80"
              resizeMode="cover"
            />
          </View>
        )}

      </Pressable>

      {/* Actions - NOT clickable to navigate, only for actions */}
      <View className="flex-row items-center justify-between pt-3 border-t border-zinc-800">
        <View className="flex-row items-center gap-1">
          {/* Upvote */}
          <TouchableOpacity 
            onPress={() => {
              console.log('Upvote button pressed');
              handleVote('UpVote');
            }}
            disabled={voting}
            activeOpacity={0.6}
            className="flex-row items-center px-3 py-2 rounded-lg"
            style={{ 
              opacity: voting ? 0.5 : 1,
              backgroundColor: userVote === 'UpVote' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <ArrowUp 
              size={24} 
              color="#fff"
              strokeWidth={userVote === 'UpVote' ? 3 : 2} 
            />
            <Text className={`ml-1 text-sm font-semibold ${userVote === 'UpVote' ? 'text-white' : 'text-gray-400'}`}>
              {upvotes}
            </Text>
          </TouchableOpacity>
          
          {/* Downvote */}
          <TouchableOpacity 
            onPress={() => {
              console.log('Downvote button pressed');
              handleVote('DownVote');
            }}
            disabled={voting}
            activeOpacity={0.6}
            className="flex-row items-center px-3 py-2 rounded-lg"
            style={{ 
              opacity: voting ? 0.5 : 1,
              backgroundColor: userVote === 'DownVote' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <ArrowDown 
              size={24} 
              color="#fff"
              strokeWidth={userVote === 'DownVote' ? 3 : 2} 
            />
            <Text className={`ml-1 text-sm font-semibold ${userVote === 'DownVote' ? 'text-white' : 'text-gray-400'}`}>
              {downvotes}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-4">
          {/* Comments */}
          <TouchableOpacity 
            onPress={handlePress}
            activeOpacity={0.7}
            className="flex-row items-center px-2 py-1"
          >
            <MessageCircle size={22} color="#fff" strokeWidth={2} />
            <Text className="text-gray-400 text-sm ml-1 font-semibold">
              {commentCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Enhanced Tip Modal */}
    <EnhancedTipModal
      visible={showTipModal}
      recipient={{
        id: localBuzz.user.id,
        name: localBuzz.user.Name,
        avatar: localBuzz.user.ImageUrl
      }}
      buzzId={localBuzz.id}
      onClose={() => setShowTipModal(false)}
      onTip={(buzzId, amount, symbol) => {
        console.log('Tipping buzz:', { buzzId, amount, symbol });
        Alert.alert('Coming Soon', 'Tipping functionality will be available soon!');
      }}
    />
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(BuzzCard, (prevProps, nextProps) => {
  return (
    prevProps.buzz.id === nextProps.buzz.id &&
    prevProps.buzz.Vote.length === nextProps.buzz.Vote.length &&
    prevProps.buzz._count?.replies === nextProps.buzz._count?.replies
  );
});
