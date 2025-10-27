import { Receipt } from 'lucide-react-native';
import { FlatList, Text, View } from 'react-native';
import { Transaction } from '../../types';
import TransactionCard from './TransactionCard';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentUserId: string;
}

export default function TransactionHistory({ transactions, currentUserId }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <Receipt size={32} color="#71717a" strokeWidth={2} />
        </View>
        <Text className="text-gray-400 text-base">No transactions yet</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Your transaction history will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionCard transaction={item} currentUserId={currentUserId} />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

