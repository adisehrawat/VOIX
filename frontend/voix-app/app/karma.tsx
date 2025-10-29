import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KarmaDisplay from '../components/karma/KarmaDisplay';
import KarmaLeaderboard from '../components/karma/KarmaLeaderboard';
import NFTDisplay from '../components/karma/NFTDisplay';
import { karmaAPI } from '../services/api';
import { Karma as KarmaType } from '../types';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'overview' | 'leaderboard' | 'nfts';

export default function Karma() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [myKarma, setMyKarma] = useState<KarmaType | null>(null);
  const [leaderboard, setLeaderboard] = useState<KarmaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Load user's karma data
  const loadMyKarma = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await karmaAPI.getMyKarma();
      
      if (response.success) {
        setMyKarma(response.data);
      } else {
        setError(response.error || 'Failed to load karma data');
      }
    } catch (err) {
      console.error('Error loading karma:', err);
      setError('Failed to load karma data');
    } finally {
      setLoading(false);
    }
  };

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const response = await karmaAPI.getTopKarmaUsers(20);
      
      if (response.success) {
        setLeaderboard(response.data);
      } else {
        setError(response.error || 'Failed to load leaderboard');
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Load data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'overview') {
      loadMyKarma();
    } else if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab]);

  // Generate dummy NFTs based on karma points (since NFT API might not be implemented yet)
  const generateNFTs = (karmaPoints: number) => {
    const nfts = [];
    let points = karmaPoints;
    
    // Bronze badge at 500 points
    if (points >= 500) {
      nfts.push({
        id: 'bronze',
        name: 'Bronze Contributor',
        image: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400',
        collection: 'Voix Badges',
        rarity: 'common' as const,
      });
    }
    
    // Silver badge at 1500 points
    if (points >= 1500) {
      nfts.push({
        id: 'silver',
        name: 'Silver Contributor',
        image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400',
        collection: 'Voix Badges',
        rarity: 'rare' as const,
      });
    }
    
    // Gold badge at 3000 points
    if (points >= 3000) {
      nfts.push({
        id: 'gold',
        name: 'Gold Contributor',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        collection: 'Voix Badges',
        rarity: 'epic' as const,
      });
    }
    
    // Diamond badge at 5000 points
    if (points >= 5000) {
      nfts.push({
        id: 'diamond',
        name: 'Diamond Contributor',
        image: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400',
        collection: 'Voix Badges',
        rarity: 'legendary' as const,
      });
    }
    
    return nfts;
  };

  const handleViewNFT = (nftId: string) => {
    console.log('Viewing NFT:', nftId);
    // TODO: Navigate to NFT detail screen
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
            Karma
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-zinc-900 px-4">
        <TouchableOpacity
          onPress={() => setActiveTab('overview')}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === 'overview' ? 'border-purple-500' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'overview' ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('leaderboard')}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === 'leaderboard' ? 'border-purple-500' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'leaderboard' ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            Leaderboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('nfts')}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === 'nfts' ? 'border-purple-500' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'nfts' ? 'text-purple-500' : 'text-gray-400'
            }`}
          >
            NFTs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pt-6">
            {loading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white mt-4">Loading karma data...</Text>
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-red-500 text-lg mb-4">Error</Text>
                <Text className="text-gray-400 text-center px-6">{error}</Text>
                <TouchableOpacity
                  onPress={loadMyKarma}
                  className="bg-purple-600 px-6 py-3 rounded-full mt-4"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : myKarma ? (
              <KarmaDisplay
                points={myKarma.points}
                nfts={myKarma.nfts}
                rank={leaderboard.findIndex(k => k.userid === currentUserId) + 1 || 0}
                trend="up"
              />
            ) : (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-gray-400 text-lg">No karma data found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {activeTab === 'leaderboard' && (
        <>
          {leaderboardLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white mt-4">Loading leaderboard...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-red-500 text-lg mb-4">Error</Text>
              <Text className="text-gray-400 text-center px-6">{error}</Text>
              <TouchableOpacity
                onPress={loadLeaderboard}
                className="bg-purple-600 px-6 py-3 rounded-full mt-4"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <KarmaLeaderboard
              leaderboard={leaderboard}
              currentUserId={currentUserId}
            />
          )}
        </>
      )}

      {activeTab === 'nfts' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {myKarma ? (
            <NFTDisplay 
              nfts={generateNFTs(parseInt(myKarma.points))} 
              onViewNFT={handleViewNFT} 
            />
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-400 text-lg">Loading NFT data...</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}