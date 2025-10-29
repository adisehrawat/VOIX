import { Send, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { User } from '../../types';

interface SendMoneyModalProps {
  visible: boolean;
  recipient: User | null;
  onClose: () => void;
  onSend: (recipientId: string, amount: string, symbol: string) => void;
}

export default function SendMoneyModal({ visible, recipient, onClose, onSend }: SendMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('SOL');

  const tokens = ['SOL', 'USDC', 'BONK'];

  const handleSend = () => {
    if (recipient && amount && parseFloat(amount) > 0) {
      onSend(recipient.id, amount, selectedToken);
      setAmount('');
      onClose();
    }
  };

  if (!recipient) return null;

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
            <Text className="text-white text-xl font-bold">Send Money</Text>
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
              <Text className="text-gray-400 text-sm mb-3">Sending to</Text>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: recipient.imageUrl }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                  <Text className="text-white font-semibold text-base">
                    {recipient.name}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {recipient.username}
                  </Text>
                </View>
              </View>
            </View>

            {/* Amount Input */}
            <View className="mb-6">
              <Text className="text-gray-400 text-sm mb-3">Amount</Text>
              <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#71717a"
                  keyboardType="decimal-pad"
                  className="text-white text-3xl font-bold"
                />
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

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSend}
              className="bg-white rounded-full py-4 items-center justify-center flex-row"
              activeOpacity={0.8}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Send size={20} color="#000" strokeWidth={2.5} />
              <Text className="text-black font-bold text-lg ml-2">
                Send {amount || '0'} {selectedToken}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

