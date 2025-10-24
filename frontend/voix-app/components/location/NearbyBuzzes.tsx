import { MapPin } from 'lucide-react-native';
import { FlatList, Text, View } from 'react-native';
import { Buzz } from '../../data/dummyBuzzes';
import BuzzCard from '../BuzzCard';

interface NearbyBuzzesProps {
  buzzes: Buzz[];
  userLocation: {
    latitude: string;
    longitude: string;
  } | null;
}

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NearbyBuzzes({ buzzes, userLocation }: NearbyBuzzesProps) {
  if (!userLocation) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <MapPin size={32} color="#71717a" strokeWidth={2} />
        </View>
        <Text className="text-gray-400 text-base">Location not available</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Enable location to see nearby buzzes
        </Text>
      </View>
    );
  }

  if (buzzes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <MapPin size={32} color="#71717a" strokeWidth={2} />
        </View>
        <Text className="text-gray-400 text-base">No nearby buzzes</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Be the first to buzz in your area!
        </Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
      <View className="flex-row items-center">
        <MapPin size={24} color="#3b82f6" strokeWidth={2} />
        <Text className="text-white text-lg font-bold ml-2">
          Buzzes Near You
        </Text>
      </View>
      <Text className="text-gray-400 text-sm mt-2">
        Showing {buzzes.length} buzz{buzzes.length !== 1 ? 'es' : ''} within 10km
      </Text>
    </View>
  );

  return (
    <FlatList
      data={buzzes}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => <BuzzCard buzz={item} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

