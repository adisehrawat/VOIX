import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft, Copy, Send } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SendMoneyModal from '../components/transactions/SendMoneyModal';
import { useWallet } from '../contexts/WalletContext';

export default function Wallet() {
  const [showSendMoney, setShowSendMoney] = useState(false);
  const { walletDetails, recentTransactions, loading, refreshWallet } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWallet();
    setRefreshing(false);
  };

  const copyPublicKey = () => {
    if (walletDetails?.publicKey) {
      Clipboard.setString(walletDetails.publicKey);
      Alert.alert('Copied!', 'Public key copied to clipboard');
    }
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleSendMoney = (recipientId: string, amount: string, symbol: string) => {
    console.log('Sending money:', { recipientId, amount, symbol });
    // Handle send money logic
  };

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading wallet...</Text>
      </SafeAreaView>
    );
  }

  console.log('Wallet Page - walletDetails:', walletDetails);
  console.log('Wallet Page - recentTransactions:', recentTransactions.length);

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
            Wallet
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSendMoney(true)}
          className="w-12 h-12 items-center justify-center rounded-xl bg-white"
          activeOpacity={0.8}
        >
          <Send size={24} color="#000" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ffffff"
          />
        }
      >
        {/* Debug Info */}
        {!walletDetails && (
          <View className="mx-6 mt-6 mb-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
            <Text className="text-white text-lg font-bold mb-2">⚠️ No Wallet Data</Text>
            <Text className="text-gray-400 text-sm">Wallet details not loaded.</Text>
            <Text className="text-gray-400 text-sm mt-2">Pull down to refresh.</Text>
          </View>
        )}

        {/* Public Key Card */}
        {walletDetails && (
          <View className="mx-6 mt-6 mb-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
            <Text className="text-gray-400 text-sm mb-2">Wallet Address</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base font-mono flex-1" numberOfLines={1}>
                {walletDetails.publicKey}
              </Text>
              <TouchableOpacity
                onPress={copyPublicKey}
                className="ml-2 p-2 bg-zinc-800 rounded-lg"
                activeOpacity={0.7}
              >
                <Copy size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-xs mt-2">
              {shortenAddress(walletDetails.publicKey)}
            </Text>
          </View>
        )}

        {/* Token Balances */}
        {walletDetails && (
          <View className="px-6 mb-6">
            <Text className="text-white text-xl font-bold mb-4">Balances</Text>
            
            {/* SOL Balance */}
            <View className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 rounded-2xl mb-3 border border-purple-500/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-300 text-sm">Solana</Text>
                  <Text className="text-white text-3xl font-bold mt-1">
                    {walletDetails.balances.SOL.toFixed(4)}
                  </Text>
                </View>
                <View className="bg-purple-500 w-12 h-12 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-lg">◎</Text>
                </View>
              </View>
              <Text className="text-gray-400 text-xs mt-2">SOL</Text>
            </View>

            {/* USDC Balance */}
            <View className="bg-gradient-to-r from-blue-900 to-green-900 p-4 rounded-2xl border border-blue-500/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-300 text-sm">USD Coin</Text>
                  <Text className="text-white text-3xl font-bold mt-1">
                    ${walletDetails.balances.USDC.toFixed(2)}
                  </Text>
                </View>
                <View className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-lg">$</Text>
                </View>
              </View>
              <Text className="text-gray-400 text-xs mt-2">USDC</Text>
            </View>
          </View>
        )}

        {/* Recent Transaction History */}
        {recentTransactions.length > 0 && (
          <>
            <View className="px-6 mb-4 flex-row items-center justify-between">
              <Text className="text-white text-xl font-bold">
                Recent Transactions
              </Text>
              <TouchableOpacity
                onPress={() => {/* Navigate to full transaction history */}}
                activeOpacity={0.7}
              >
                <Text className="text-blue-500">View All</Text>
              </TouchableOpacity>
            </View>
            <View className="px-6">
              {recentTransactions.map((tx) => (
                <View 
                  key={tx.id}
                  className="bg-zinc-900 p-4 rounded-xl mb-3 border border-zinc-800"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${
                        tx.direction === 'received' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        <Text className="text-lg">
                          {tx.direction === 'received' ? '↓' : '↑'}
                        </Text>
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-white font-semibold">
                          {tx.direction === 'received' ? 'Received' : 'Sent'}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {tx.direction === 'received' 
                            ? `From: ${tx.sender?.Name || 'Unknown'}`
                            : `To: ${tx.receiver?.Name || 'Unknown'}`
                          }
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className={`text-lg font-bold ${
                        tx.direction === 'received' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {tx.direction === 'received' ? '+' : '-'}{tx.amount} {tx.tokenSymbol}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  {tx.type === 'Tip' && (
                    <View className="mt-2 bg-orange-500/10 px-2 py-1 rounded-md self-start">
                      <Text className="text-orange-500 text-xs">💰 Tip</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Empty State */}
        {recentTransactions.length === 0 && (
          <View className="px-6 py-20 items-center">
            <Text className="text-gray-500 text-base">No transactions yet</Text>
            <Text className="text-gray-600 text-sm mt-2">
              Start sending or receiving tokens
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Send Money Modal */}
      <SendMoneyModal
        visible={showSendMoney}
        recipient={null} // Would be selected from friends list
        onClose={() => setShowSendMoney(false)}
        onSend={handleSendMoney}
      />
    </SafeAreaView>
  );
}

