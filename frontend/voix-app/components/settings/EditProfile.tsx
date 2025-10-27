import { Camera, Save } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { User } from '../../types';

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
}

export default function EditProfile({ user, onSave }: EditProfileProps) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    onSave({
      name,
      username,
    });
  };

  return (
    <View className="p-4">
      {/* Profile Picture */}
      <View className="items-center mb-6">
        <View className="relative">
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center border-2 border-black"
            activeOpacity={0.8}
          >
            <Camera size={16} color="#000" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 text-sm mt-3">
          Tap to change profile picture
        </Text>
      </View>

      {/* Name */}
      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#71717a"
          className="bg-zinc-900 text-white px-4 py-3 rounded-xl border border-zinc-800"
        />
      </View>

      {/* Username */}
      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="@username"
          placeholderTextColor="#71717a"
          className="bg-zinc-900 text-white px-4 py-3 rounded-xl border border-zinc-800"
        />
      </View>

      {/* Bio */}
      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2">Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          placeholderTextColor="#71717a"
          multiline
          numberOfLines={4}
          className="bg-zinc-900 text-white px-4 py-3 rounded-xl border border-zinc-800"
          style={{ textAlignVertical: 'top' }}
        />
      </View>

      {/* Email (Read-only) */}
      <View className="mb-6">
        <Text className="text-gray-400 text-sm mb-2">Email</Text>
        <View className="bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-800">
          <Text className="text-gray-500">{user.email}</Text>
        </View>
        <Text className="text-gray-500 text-xs mt-1">
          Email cannot be changed
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-white rounded-full py-4 items-center justify-center flex-row"
        activeOpacity={0.8}
      >
        <Save size={20} color="#000" strokeWidth={2.5} />
        <Text className="text-black font-bold text-lg ml-2">
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

