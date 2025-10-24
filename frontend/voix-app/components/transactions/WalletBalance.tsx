import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WalletBalanceProps {
  balance: string;
  symbol: string;
  totalReceived: string;
  totalSent: string;
}

export default function WalletBalance({ balance, symbol, totalReceived, totalSent }: WalletBalanceProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  return (
    <View className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-6 mx-4 mb-6 border border-zinc-700">
      {/* Balance */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-400 text-sm">Total Balance</Text>
          <TouchableOpacity
            onPress={() => setIsBalanceVisible(!isBalanceVisible)}
            activeOpacity={0.7}
          >
            {isBalanceVisible ? (
              <Eye size={20} color="#71717a" strokeWidth={2} />
            ) : (
              <EyeOff size={20} color="#71717a" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row items-end">
          <Text className="text-white text-4xl font-bold">
            {isBalanceVisible ? balance : '••••'}
          </Text>
          <Text className="text-gray-400 text-xl font-semibold ml-2 mb-1">
            {symbol}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row gap-3">
        {/* Received */}
        <View className="flex-1 bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-2">
              <ArrowDownLeft size={16} color="#22c55e" strokeWidth={2.5} />
            </View>
            <Text className="text-gray-400 text-xs">Received</Text>
          </View>
          <Text className="text-green-500 text-xl font-bold">
            {isBalanceVisible ? totalReceived : '••••'}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">{symbol}</Text>
        </View>

        {/* Sent */}
        <View className="flex-1 bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 bg-red-500/20 rounded-full items-center justify-center mr-2">
              <ArrowUpRight size={16} color="#ef4444" strokeWidth={2.5} />
            </View>
            <Text className="text-gray-400 text-xs">Sent</Text>
          </View>
          <Text className="text-red-500 text-xl font-bold">
            {isBalanceVisible ? totalSent : '••••'}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">{symbol}</Text>
        </View>
      </View>
    </View>
  );
}

