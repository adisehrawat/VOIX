import { UserPlus } from 'lucide-react-native';
import { Text, TouchableOpacity } from 'react-native';

interface AddFriendButtonProps {
  onPress: () => void;
  isRequested?: boolean;
  isFriend?: boolean;
}

export default function AddFriendButton({ onPress, isRequested, isFriend }: AddFriendButtonProps) {
  if (isFriend) {
    return (
      <TouchableOpacity
        className="bg-zinc-800 px-5 py-2.5 rounded-full border border-zinc-700 flex-row items-center"
        activeOpacity={0.8}
        disabled
      >
        <Text className="text-gray-400 font-semibold">Friends</Text>
      </TouchableOpacity>
    );
  }

  if (isRequested) {
    return (
      <TouchableOpacity
        className="bg-zinc-800 px-5 py-2.5 rounded-full border border-zinc-700 flex-row items-center"
        activeOpacity={0.8}
        disabled
      >
        <Text className="text-gray-400 font-semibold">Requested</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white px-5 py-2.5 rounded-full flex-row items-center"
      activeOpacity={0.8}
    >
      <UserPlus size={16} color="#000" strokeWidth={2.5} />
      <Text className="text-black font-semibold ml-2">Add Friend</Text>
    </TouchableOpacity>
  );
}

