import { TrendingUp } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface Trend {
  id: string;
  tag: string;
  count: number;
}

const dummyTrends: Trend[] = [
  { id: '1', tag: '#CatsOfVoix', count: 12500 },
  { id: '2', tag: '#TechNews', count: 8300 },
  { id: '3', tag: '#CryptoTips', count: 6700 },
  { id: '4', tag: '#DailyVibes', count: 5400 },
  { id: '5', tag: '#ArtShare', count: 4200 },
];

export default function TrendingSection() {
  return (
    <View className="px-6 mb-6">
      <View className="flex-row items-center mb-4">
        <TrendingUp size={20} color="#fff" strokeWidth={2} />
        <Text className="text-white text-xl font-bold ml-2">Trending</Text>
      </View>
      {dummyTrends.map((trend) => (
        <TouchableOpacity
          key={trend.id}
          activeOpacity={0.7}
          className="py-3 border-b border-zinc-900"
        >
          <Text className="text-white font-semibold text-base mb-1">
            {trend.tag}
          </Text>
          <Text className="text-gray-400 text-sm">
            {trend.count.toLocaleString()} buzzes
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

