import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionHistory from '../components/transactions/TransactionHistory';
import WalletBalance from '../components/transactions/WalletBalance';
import SendMoneyModal from '../components/transactions/SendMoneyModal';
import { dummyTransactions } from '../data/dummyTransactions';

export default function Wallet() {
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [transactions] = useState(dummyTransactions);
  const currentUserId = '1'; // This would come from auth context

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Calculate totals
  const totalReceived = transactions
    .filter(t => t.receiverId === currentUserId)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    .toFixed(2);

  const totalSent = transactions
    .filter(t => t.senderId === currentUserId)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    .toFixed(2);

  const balance = (parseFloat(totalReceived) - parseFloat(totalSent)).toFixed(2);

  const handleSendMoney = (recipientId: string, amount: string, symbol: string) => {
    console.log('Sending money:', { recipientId, amount, symbol });
    // Handle send money logic
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Balance */}
        <View className="pt-6">
          <WalletBalance
            balance={balance}
            symbol="SOL"
            totalReceived={totalReceived}
            totalSent={totalSent}
          />
        </View>

        {/* Transaction History */}
        <View className="px-4 mb-4">
          <Text className="text-white text-xl font-bold mb-4">
            Transaction History
          </Text>
        </View>
        <TransactionHistory
          transactions={transactions}
          currentUserId={currentUserId}
        />
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

