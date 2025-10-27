import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';
import { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  currentUserId: string;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function TransactionCard({ transaction, currentUserId }: TransactionCardProps) {
  const isSent = transaction.senderId === currentUserId;
  const otherUser = isSent ? transaction.receiver : transaction.sender;
  const isPositive = !isSent;

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
            isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          {isPositive ? (
            <ArrowDownLeft size={24} color="#22c55e" strokeWidth={2.5} />
          ) : (
            <ArrowUpRight size={24} color="#ef4444" strokeWidth={2.5} />
          )}
        </View>

        {/* User Info */}
        <View className="flex-1 flex-row items-center">
          <Image
            source={{ uri: otherUser.imageUrl }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {isSent ? 'Sent to' : 'Received from'} {otherUser.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <View
                className={`px-2 py-0.5 rounded-full ${
                  transaction.type === 'Tip' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    transaction.type === 'Tip' ? 'text-orange-500' : 'text-blue-500'
                  }`}
                >
                  {transaction.type}
                </Text>
              </View>
              <Text className="text-gray-500 text-xs ml-2">
                {formatTimeAgo(transaction.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View className="items-end">
          <Text
            className={`font-bold text-lg ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : '-'}{transaction.amount}
          </Text>
          <Text className="text-gray-400 text-sm">{transaction.tokenSymbol}</Text>
        </View>
      </View>
    </View>
  );
}

