import { Award, TrendingUp, Zap } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface KarmaDisplayProps {
  points: string;
  nfts: number;
  rank?: number;
  trend?: 'up' | 'down' | 'stable';
}

export default function KarmaDisplay({ points, nfts, rank, trend = 'stable' }: KarmaDisplayProps) {
  return (
    <View className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 mx-4 mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-2">
            <Zap size={20} color="#fff" strokeWidth={2.5} fill="#fff" />
          </View>
          <Text className="text-white text-lg font-bold">Karma Points</Text>
        </View>
        {rank && (
          <View className="bg-white/20 px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-semibold">
              Rank #{rank}
            </Text>
          </View>
        )}
      </View>

      {/* Points */}
      <View className="flex-row items-end mb-6">
        <Text className="text-white text-5xl font-bold">{points}</Text>
        {trend === 'up' && (
          <View className="ml-3 mb-2">
            <TrendingUp size={24} color="#22c55e" strokeWidth={2.5} />
          </View>
        )}
      </View>

      {/* Stats */}
      <View className="flex-row gap-3">
        {/* NFTs */}
        <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
          <View className="flex-row items-center mb-2">
            <Award size={16} color="#fff" strokeWidth={2} />
            <Text className="text-white/80 text-xs ml-1">NFTs Owned</Text>
          </View>
          <Text className="text-white text-2xl font-bold">{nfts}</Text>
        </View>

        {/* Level */}
        <View className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/20">
          <View className="flex-row items-center mb-2">
            <Zap size={16} color="#fff" strokeWidth={2} fill="#fff" />
            <Text className="text-white/80 text-xs ml-1">Level</Text>
          </View>
          <Text className="text-white text-2xl font-bold">
            {Math.floor(parseInt(points) / 500) + 1}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mt-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-white/80 text-xs">Next Level</Text>
          <Text className="text-white/80 text-xs">
            {parseInt(points) % 500}/500
          </Text>
        </View>
        <View className="h-2 bg-white/20 rounded-full overflow-hidden">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${((parseInt(points) % 500) / 500) * 100}%` }}
          />
        </View>
      </View>
    </View>
  );
}

