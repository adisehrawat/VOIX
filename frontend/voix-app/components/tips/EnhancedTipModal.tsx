import { Coins, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

interface RecipientUser {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  imageUrl?: string;
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

  const quickAmounts = ['0.1', '0.5', '1.0', '2.5', '5.0'];
  const tokens = ['SOL', 'USDC', 'BONK'];

  const handleTip = () => {
    if (buzzId && selectedAmount) {
      onTip(buzzId, selectedAmount, selectedToken);
      setSelectedAmount(null);
      onClose();
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
            </View>

            {/* Token Selection */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-3">Token</Text>
              <View className="flex-row gap-3">
                {tokens.map((token) => (
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
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tip Button */}
            <TouchableOpacity
              onPress={handleTip}
              className={`rounded-full py-4 items-center justify-center flex-row ${
                selectedAmount ? 'bg-orange-500' : 'bg-zinc-800'
              }`}
              activeOpacity={0.8}
              disabled={!selectedAmount}
            >
              <Coins size={20} color="#fff" strokeWidth={2.5} />
              <Text className="text-white font-bold text-lg ml-2">
                {selectedAmount
                  ? `Tip ${selectedAmount} ${selectedToken}`
                  : 'Select an amount'}
              </Text>
            </TouchableOpacity>

            <Text className="text-gray-500 text-xs text-center mt-4">
              Tips help creators earn from their content
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

