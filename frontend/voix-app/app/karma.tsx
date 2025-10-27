import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KarmaDisplay from '../components/karma/KarmaDisplay';
import KarmaLeaderboard from '../components/karma/KarmaLeaderboard';
import NFTDisplay from '../components/karma/NFTDisplay';
import { dummyKarma, dummyLeaderboard } from '../data/dummyKarma';

type TabType = 'overview' | 'leaderboard' | 'nfts';

export default function Karma() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const currentUserId = '1'; // This would come from auth context

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Dummy NFTs
  const dummyNFTs = [
    {
      id: '1',
      name: 'Karma Champion',
      image: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400',
      collection: 'Voix Badges',
      rarity: 'legendary' as const,
    },
    {
      id: '2',
      name: 'Top Contributor',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400',
      collection: 'Voix Badges',
      rarity: 'epic' as const,
    },
    {
      id: '3',
      name: 'Early Adopter',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      collection: 'Voix Badges',
      rarity: 'rare' as const,
    },
  ];

  const handleViewNFT = (nftId: string) => {
    console.log('Viewing NFT:', nftId);
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
            <KarmaDisplay
              points={dummyKarma.points}
              nfts={dummyKarma.nfts}
              rank={4}
              trend="up"
            />
          </View>
        </ScrollView>
      )}

      {activeTab === 'leaderboard' && (
        <KarmaLeaderboard
          leaderboard={dummyLeaderboard}
          currentUserId={currentUserId}
        />
      )}

      {activeTab === 'nfts' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <NFTDisplay nfts={dummyNFTs} onViewNFT={handleViewNFT} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

