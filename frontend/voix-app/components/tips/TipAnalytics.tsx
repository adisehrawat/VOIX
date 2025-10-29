import { ArrowDownLeft, ArrowUpRight, Coins, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface TipAnalyticsProps {
  totalTipsReceived: string;
  totalTipsSent: string;
  totalTipsCount: number;
  topTipper?: {
    name: string;
    amount: string;
  };
  symbol: string;
}

export default function TipAnalytics({
  totalTipsReceived,
  totalTipsSent,
  totalTipsCount,
  topTipper,
  symbol,
}: TipAnalyticsProps) {
  return (
    <View className="p-4">
      {/* Summary Card */}
      <View className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 mb-4">
        <View className="flex-row items-center mb-2">
          <Coins size={24} color="#fff" strokeWidth={2} />
          <Text className="text-white text-lg font-bold ml-2">Tip Summary</Text>
        </View>
        <Text className="text-white/80 text-sm mb-4">
          Your tipping activity overview
        </Text>
        <View className="flex-row items-end">
          <Text className="text-white text-4xl font-bold">
            {totalTipsCount}
          </Text>
          <Text className="text-white/80 text-lg ml-2 mb-1">
            Total Tips
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-3 mb-4">
        {/* Received */}
        <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mb-3">
            <ArrowDownLeft size={20} color="#22c55e" strokeWidth={2.5} />
          </View>
          <Text className="text-gray-400 text-xs mb-1">Received</Text>
          <Text className="text-white text-2xl font-bold">
            {totalTipsReceived}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">{symbol}</Text>
        </View>

        {/* Sent */}
        <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mb-3">
            <ArrowUpRight size={20} color="#ef4444" strokeWidth={2.5} />
          </View>
          <Text className="text-gray-400 text-xs mb-1">Sent</Text>
          <Text className="text-white text-2xl font-bold">
            {totalTipsSent}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">{symbol}</Text>
        </View>
      </View>

      {/* Top Tipper */}
      {topTipper && (
        <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center mr-2">
              <TrendingUp size={20} color="#f97316" strokeWidth={2.5} />
            </View>
            <Text className="text-white font-semibold text-base">
              Top Supporter
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">{topTipper.name}</Text>
            <Text className="text-orange-500 font-bold text-lg">
              {topTipper.amount} {symbol}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

