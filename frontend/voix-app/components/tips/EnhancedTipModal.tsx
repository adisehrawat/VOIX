import { Coins, X, RefreshCw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View, Alert } from 'react-native';
import { tipAPI } from '../../services/api';
import { useProfile } from '../../contexts/ProfileContext';
import { useWallet } from '../../contexts/WalletContext';

interface RecipientUser {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  imageUrl?: string;
  publicKey?: string;
}

interface EnhancedTipModalProps {
  visible: boolean;
  recipient: RecipientUser | null;
  buzzId: string | null;
  onClose: () => void;
  onTip: (buzzId: string, amount: string, symbol: string) => void;
}

export default function EnhancedTipModal({
  visible,
  recipient,
  buzzId,
  onClose,
  onTip,
}: EnhancedTipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [tipping, setTipping] = useState(false);
  const { userData, karmaData } = useProfile();
  const { walletDetails, loading, refreshWallet } = useWallet();

  const balances = walletDetails?.balances || { SOL: 0, USDC: 0 };

  const getQuickAmounts = () => {
    const balance = balances[selectedToken as keyof typeof balances] as number;
    if (balance === 0) return [];
    
    const amounts = [];
    if (balance >= 0.1) amounts.push('0.1');
    if (balance >= 0.5) amounts.push('0.5');
    if (balance >= 1.0) amounts.push('1.0');
    if (balance >= 2.5) amounts.push('2.5');
    if (balance >= 5.0) amounts.push('5.0');
    
    if (balance > 5.0) {
      const half = (balance / 2).toFixed(1);
      if (!amounts.includes(half)) amounts.push(half);
    }
    
    return amounts;
  };
  
  const quickAmounts = getQuickAmounts();
  
  const availableTokens = Object.entries(balances)
    .filter(([token, balance]) => balance > 0)
    .map(([token]) => token);

  useEffect(() => {
    if (walletDetails?.balances) {
      const tokens = Object.entries(walletDetails.balances).filter(([_, balance]) => balance > 0);
      if (tokens.length > 0) {
        setSelectedToken(tokens[0][0]);
      }
    }
  }, [walletDetails?.balances]);


  const handleTip = async () => {
    if (!buzzId || !selectedAmount || !userData || !recipient) {
      return;
    }

    const amount = parseFloat(selectedAmount);
    const balance = balances[selectedToken as keyof typeof balances] as number;
    
    if (amount > balance) {
      return;
    }

    if (amount <= 0) {
      return;
    }

    try {
      setTipping(true);
      
      const response = await tipAPI.tipBuzz(
        amount,
        buzzId,
        selectedToken,
        recipient.publicKey || ''
      );


      if (response.success) {
        Alert.alert(
          'Success', 
          response.message || `Tip of ${selectedAmount} ${selectedToken} sent successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                onTip(buzzId, selectedAmount, selectedToken);
                setSelectedAmount(null);
                onClose();
                refreshWallet();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to send tip. Please try again.');
      }
    } catch (error) {
      console.error('Tip error:', error);
    } finally {
      setTipping(false);
    }
  };

  if (!recipient || !buzzId) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-black rounded-t-3xl border-t border-zinc-800">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
            <View className="flex-row items-center">
              <Coins size={24} color="#f97316" strokeWidth={2} />
              <Text className="text-white text-xl font-bold ml-2">Send Tip</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View className="p-6">
            {/* Recipient */}
            <View className="bg-zinc-900 rounded-2xl p-4 mb-6 border border-zinc-800">
              <Text className="text-gray-400 text-sm mb-3">Tipping</Text>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: recipient.imageUrl || recipient.avatar }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                  <Text className="text-white font-semibold text-base">
                    {recipient.name}
                  </Text>
                  {recipient.username && (
                    <Text className="text-gray-400 text-sm">
                      {recipient.username}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Quick Amount Selection */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-3">Select Amount</Text>
              {quickAmounts.length === 0 ? (
                <View className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <Text className="text-gray-400 text-center">
                    No quick amounts available for {selectedToken}
                  </Text>
                </View>
              ) : (
                <View className="flex-row flex-wrap gap-3">
                  {quickAmounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      onPress={() => setSelectedAmount(amount)}
                      className={`px-6 py-3 rounded-xl border-2 ${
                        selectedAmount === amount
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`font-semibold ${
                          selectedAmount === amount ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Token Selection */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-400 text-sm">Token</Text>
                <TouchableOpacity
                  onPress={refreshWallet}
                  disabled={loading}
                  className="flex-row items-center px-2 py-1"
                  activeOpacity={0.7}
                >
                  <RefreshCw 
                    size={16} 
                    color="#9ca3af" 
                    strokeWidth={2}
                    style={{ transform: [{ rotate: loading ? '180deg' : '0deg' }] }}
                  />
                  <Text className="text-gray-400 text-xs ml-1">Refresh</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <View className="flex-row items-center justify-center py-8">
                  <ActivityIndicator size="small" color="#f97316" />
                  <Text className="text-gray-400 ml-2">Loading balances...</Text>
                </View>
              ) : availableTokens.length === 0 ? (
                <View className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <Text className="text-gray-400 text-center">
                    {!userData?.id ? 'Not authenticated' : 'No tokens available'}
                  </Text>
                  <Text className="text-gray-500 text-sm text-center mt-1">
                    {!userData?.id 
                      ? 'Please log in to send tips'
                      : 'You need some tokens to send tips'
                    }
                  </Text>
                </View>
              ) : (
                <View className="flex-row gap-3">
                  {availableTokens.map((token) => (
                    <TouchableOpacity
                      key={token}
                      onPress={() => setSelectedToken(token)}
                      className={`flex-1 py-3 rounded-xl border-2 items-center ${
                        selectedToken === token
                          ? 'bg-white border-white'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`font-semibold ${
                          selectedToken === token ? 'text-black' : 'text-white'
                        }`}
                      >
                        {token}
                      </Text>
                      <Text
                        className={`text-xs ${
                          selectedToken === token ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {balances[token as keyof typeof balances].toFixed(4)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Tip Button */}
            <TouchableOpacity
              onPress={handleTip}
              className={`rounded-full py-4 items-center justify-center flex-row ${
                selectedAmount && availableTokens.length > 0 && !tipping ? 'bg-orange-500' : 'bg-zinc-800'
              }`}
              activeOpacity={0.8}
              disabled={!selectedAmount || availableTokens.length === 0 || tipping}
            >
              {tipping ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Coins size={20} color="#fff" strokeWidth={2.5} />
              )}
              <Text className="text-white font-bold text-lg ml-2">
                {tipping
                  ? 'Sending tip...'
                  : availableTokens.length === 0
                  ? 'No tokens available'
                  : selectedAmount
                  ? `Tip ${selectedAmount} ${selectedToken}`
                  : 'Select an amount'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

