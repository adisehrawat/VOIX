import { Camera, Save } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { authAPI } from '../../services/api';
import { useProfile } from '../../contexts/ProfileContext';

interface EditProfileProps {
  user: {
    name: string;
    email: string;
    imageUrl: string;
  };
  onSave: () => void;
}

export default function EditProfile({ user, onSave }: EditProfileProps) {
  const [name, setName] = useState(user.name);
  const [imageUrl, setImageUrl] = useState(user.imageUrl);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { refreshProfile } = useProfile();

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        return;
      }

      setImageLoading(true);

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduce quality to keep base64 size reasonable
      });

      if (!result.canceled && result.assets[0]) {
        // Convert image to base64
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImageUrl(base64data);
          console.log('Image converted to base64, length:', base64data.length);
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Build update data with only changed fields
      const updateData: { name?: string; imageUrl?: string } = {};
      
      if (name !== user.name && name.trim().length > 0) {
        updateData.name = name.trim();
      }
      
      if (imageUrl !== user.imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      // Check if anything changed
      if (Object.keys(updateData).length === 0) {
        return;
      }

      // Call API
      const response = await authAPI.updateProfile(updateData);

      if (response.success) {
        
        // Refresh profile data in context
        await refreshProfile();
        
        // Go back
        onSave();
      } else {
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = name !== user.name || imageUrl !== user.imageUrl;

  return (
    <View className="p-4">
      {/* Profile Picture */}
      <View className="items-center mb-6">
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-24 h-24 rounded-full"
          />
          {imageLoading && (
            <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          )}
          <TouchableOpacity
            onPress={pickImage}
            disabled={imageLoading}
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
          editable={!loading}
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
        disabled={loading || !hasChanges}
        className={`rounded-full py-4 items-center justify-center flex-row ${
          hasChanges && !loading ? 'bg-white' : 'bg-zinc-700'
        }`}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Save size={20} color="#000" strokeWidth={2.5} />
            <Text className="text-black font-bold text-lg ml-2">
              {hasChanges ? 'Save Changes' : 'No Changes'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Info Text */}
      <Text className="text-gray-500 text-xs text-center mt-4">
        {hasChanges 
          ? 'You have unsaved changes' 
          : 'Make changes to enable save button'
        }
      </Text>
    </View>
  );
}
