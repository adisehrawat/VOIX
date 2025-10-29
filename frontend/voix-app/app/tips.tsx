import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TipAnalytics from '../components/tips/TipAnalytics';
import TipHistory from '../components/tips/TipHistory';
import { useWallet } from '../contexts/WalletContext';
import { useProfile } from '../contexts/ProfileContext';

type TabType = 'history' | 'analytics';

export default function Tips() {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const { recentTransactions } = useWallet();
  const { userData } = useProfile();
  const currentUserId = userData?.id || '';

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Filter only tip transactions from real data and convert to Transaction format
  const tipTransactions = recentTransactions
    .filter(t => t.type === 'Tip')
    .map(t => ({
      id: t.id,
      programId: t.programid,
      senderId: t.senderId,
      sender: { 
        id: t.senderId, 
        name: 'Unknown', 
        imageUrl: '', 
        email: '', 
        publicKey: '', 
        walletId: '', 
        authType: 'Password' as const,
        createdAt: new Date()
      },
      receiverId: t.reciverid,
      receiver: { 
        id: t.reciverid, 
        name: 'Unknown', 
        imageUrl: '', 
        email: '', 
        publicKey: '', 
        walletId: '', 
        authType: 'Password' as const,
        createdAt: new Date()
      },
      amount: t.amount,
      type: t.type,
      tokenSymbol: t.tokenSymbol,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    }));

  // Calculate analytics
  const totalTipsReceived = tipTransactions
    .filter(t => t.receiverId === currentUserId)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    .toFixed(2);

  const totalTipsSent = tipTransactions
    .filter(t => t.senderId === currentUserId)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    .toFixed(2);

  // Find top tipper from real data
  const topTipper = tipTransactions
    .filter(t => t.receiverId === currentUserId)
    .reduce((max, t) => {
      const amount = parseFloat(t.amount);
      return amount > parseFloat(max.amount) ? { name: t.sender.name, amount: t.amount } : max;
    }, { name: 'No tips yet', amount: '0' });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-zinc-900">
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
          Tips
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-zinc-900 px-4">
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === 'history' ? 'border-orange-500' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'history' ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('analytics')}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === 'analytics' ? 'border-orange-500' : 'border-transparent'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold ${
              activeTab === 'analytics' ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'history' ? (
        <TipHistory tips={tipTransactions} currentUserId={currentUserId} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TipAnalytics
            totalTipsReceived={totalTipsReceived}
            totalTipsSent={totalTipsSent}
            totalTipsCount={tipTransactions.length}
            topTipper={topTipper}
            symbol="SOL"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

