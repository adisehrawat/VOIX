import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { MessageCircle } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BuzzCard from "../../components/BuzzCard";
import { dummyBuzzes } from "../../data/dummyBuzzes";

export default function Index() {
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

      {/* Feed */}
      <FlatList
        data={dummyBuzzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BuzzCard buzz={item} />}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
