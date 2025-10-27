import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { MessageCircle } from "lucide-react-native";
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BuzzCard from '../../components/BuzzCard';
import SearchBar from '../../components/pages/explore/SearchBar';
import TrendingSection from '../../components/pages/explore/TrendingSection';
import { dummyBuzzes } from '../../data/dummyBuzzes';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

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

      <FlatList
        ListHeaderComponent={
          <>
            <View className="mt-4">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search buzzes, people, topics..."
              />
            </View>
            <TrendingSection />
            <Text className="text-white text-xl font-bold px-6 mb-4">
              Discover
            </Text>
          </>
        }
        data={dummyBuzzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BuzzCard buzz={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Explore;
