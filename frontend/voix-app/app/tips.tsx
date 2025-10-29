import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TipAnalytics from '../components/tips/TipAnalytics';
import TipHistory from '../components/tips/TipHistory';
import { useProfile } from '../contexts/ProfileContext';
import { walletAPI } from '../services/api';
import { Transaction } from '../types';

type TabType = 'history' | 'analytics';

export default function Tips() {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [tipTransactions, setTipTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useProfile();
  const currentUserId = userData?.id || '';

  const [fontsLoaded] = useFonts({
    StickNoBills_500Medium,
  });

  // Load tip transactions from wallet API
  const loadTipTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletAPI.getTransactions();
      
      if (response.success) {
        // Filter only tip transactions and convert to Transaction format
        const tipTransactions = response.data.transactions
          .filter((t: any) => t.type === 'Tip')
          .map((t: any) => ({
            id: t.id,
            programId: t.programid,
            senderId: t.senderId,
            sender: t.sender,
            receiverId: t.reciverid,
            receiver: t.receiver,
            amount: t.amount,
            type: t.type,
            tokenSymbol: t.tokenSymbol,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt)
          }));
        setTipTransactions(tipTransactions);
      } else {
        setError(response.error || 'Failed to load tip history');
      }
    } catch (err) {
      console.error('Error loading tip transactions:', err);
      setError('Failed to load tip transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTipTransactions();
  }, []);

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
      return amount > parseFloat(max.amount) ? { name: t.sender.name || 'Unknown', amount: t.amount } : max;
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
      {loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading tip data...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-red-500 text-lg mb-4">Error</Text>
          <Text className="text-gray-400 text-center px-6">{error}</Text>
          <TouchableOpacity
            onPress={loadTipTransactions}
            className="bg-orange-600 px-6 py-3 rounded-full mt-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : activeTab === 'history' ? (
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

