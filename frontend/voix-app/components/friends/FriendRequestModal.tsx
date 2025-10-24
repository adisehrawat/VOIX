import { X } from 'lucide-react-native';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { FriendRequest } from '../../types';
import FriendRequestCard from './FriendRequestCard';

interface FriendRequestModalProps {
  visible: boolean;
  requests: FriendRequest[];
  onClose: () => void;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export default function FriendRequestModal({
  visible,
  requests,
  onClose,
  onAccept,
  onReject,
}: FriendRequestModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80">
        <View className="flex-1 bg-black mt-20 rounded-t-3xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
            <Text className="text-white text-xl font-bold">
              Friend Requests ({requests.length})
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Requests List */}
          {requests.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400 text-base">No pending requests</Text>
            </View>
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FriendRequestCard
                  request={item}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              )}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

