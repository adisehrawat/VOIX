import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { Coins, Grid3x3, MessageCircle, Settings, SquareStack, Timer, Users, Wallet, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileFeedView from '../../../components/pages/profile/ProfileFeedView';
import ProfileGridView from '../../../components/pages/profile/ProfileGridView';
import ProfileHeader from '../../../components/pages/profile/ProfileHeader';
import { dummyBuzzes } from '../../../data/dummyBuzzes';
import { currentUser, profileImages } from '../../../data/dummyProfile';

type TabType = 'grid' | 'feed' | 'timer' | 'archive';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Create profile posts with images
  const profilePosts = profileImages.map((image, index) => ({
    ...dummyBuzzes[0],
    id: `profile-${index}`,
    image,
    content: index % 2 === 0 ? dummyBuzzes[0].content : null,
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'grid':
        return <ProfileGridView posts={profilePosts} />;
      case 'feed':
        return <ProfileFeedView posts={profilePosts.slice(0, 3)} />;
      case 'timer':
        return (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-base">No timed posts yet</Text>
          </View>
        );
      case 'archive':
        return (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-base">No archived posts</Text>
          </View>
        );
      default:
        return null;
    }
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
          Voix
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity 
            onPress={() => router.push('/settings')}
            className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white"
            activeOpacity={0.7}
          >
            <Settings size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 items-center justify-center rounded-xl border-2 border-white"
            activeOpacity={0.7}
          >
            <MessageCircle size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={currentUser} />

        {/* Quick Actions */}
        <View className="flex-row flex-wrap gap-3 px-6 mb-4">
          <TouchableOpacity
            onPress={() => router.push('/friends')}
            className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
            activeOpacity={0.8}
          >
            <Users size={24} color="#3b82f6" strokeWidth={2} />
            <Text className="text-white font-semibold mt-2">Friends</Text>
            <Text className="text-gray-400 text-xs mt-1">Manage connections</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/wallet')}
            className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
            activeOpacity={0.8}
          >
            <Wallet size={24} color="#22c55e" strokeWidth={2} />
            <Text className="text-white font-semibold mt-2">Wallet</Text>
            <Text className="text-gray-400 text-xs mt-1">View transactions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/karma')}
            className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
            activeOpacity={0.8}
          >
            <Zap size={24} color="#a855f7" strokeWidth={2} />
            <Text className="text-white font-semibold mt-2">Karma</Text>
            <Text className="text-gray-400 text-xs mt-1">Points & leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/tips')}
            className="flex-1 min-w-[45%] bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
            activeOpacity={0.8}
          >
            <Coins size={24} color="#f97316" strokeWidth={2} />
            <Text className="text-white font-semibold mt-2">Tips</Text>
            <Text className="text-gray-400 text-xs mt-1">History & analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row border-t border-zinc-900 mb-2">
          <TouchableOpacity
            onPress={() => setActiveTab('grid')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
              activeTab === 'grid' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Grid3x3
              size={24}
              color={activeTab === 'grid' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('feed')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
              activeTab === 'feed' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
            <SquareStack
              size={24}
              color={activeTab === 'feed' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('timer')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
              activeTab === 'timer' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Timer
              size={24}
              color={activeTab === 'timer' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('archive')}
            className={`flex-1 items-center justify-center py-4 border-b-2 ${
              activeTab === 'archive' ? 'border-white' : 'border-transparent'
            }`}
            activeOpacity={0.7}
          >
            <SquareStack
              size={24}
              color={activeTab === 'archive' ? '#fff' : '#71717a'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
