import { Image as ImageIcon, Video, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

interface CreateBuzzPageProps {
  onClose: () => void;
  onPost?: (content: string, image: string | null) => void;
  isLoading?: boolean;
}

export default function CreateBuzzPage({ onClose, onPost, isLoading }: CreateBuzzPageProps) {
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  const handlePost = () => {
    if (!content.trim() && !selectedMedia) {
      Alert.alert('Empty Buzz', 'Please add some content or media to your buzz');
      return;
    }

    if (onPost) {
      onPost(content.trim(), selectedMedia);
    }
  };

  const requestMediaPermission = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required to select photos/videos');
        return false;
      }
    }
    return true;
  };

  const handleSelectPhoto = async () => {
    try {
      const hasPermission = await requestMediaPermission('library');
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;
          setSelectedMedia(base64Image);
          setMediaType('image');
        } else if (asset.uri) {
          setSelectedMedia(asset.uri);
          setMediaType('image');
        }
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  const handleSelectVideo = async () => {
    try {
      const hasPermission = await requestMediaPermission('library');
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // For videos, we'll just use the URI for now
        // In production, you'd upload to a storage service like AWS S3, Cloudinary, etc.
        setSelectedMedia(asset.uri);
        setMediaType('video');
        
        Alert.alert(
          'Video Selected',
          'Note: Video upload to storage service not yet implemented. Using local URI for now.'
        );
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      Alert.alert('Error', 'Failed to select video');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestMediaPermission('camera');
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;
          setSelectedMedia(base64Image);
          setMediaType('image');
        } else if (asset.uri) {
          setSelectedMedia(asset.uri);
          setMediaType('image');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Gallery', onPress: handleSelectPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const canPost = (content.trim().length > 0 || selectedMedia) && !isLoading;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
        <TouchableOpacity 
          onPress={onClose} 
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <X size={28} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Create Buzz</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={!canPost}
          className={`px-5 py-2 rounded-full ${canPost ? 'bg-white' : 'bg-zinc-700'}`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text className={`font-semibold ${canPost ? 'text-black' : 'text-zinc-500'}`}>
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Text Input */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor="#71717a"
            multiline
            editable={!isLoading}
            className="text-white text-lg min-h-[150px]"
            style={{ textAlignVertical: 'top' }}
            maxLength={500}
          />

          {/* Character count */}
          <Text className="text-gray-500 text-sm text-right mt-2">
            {content.length}/500
          </Text>

          {/* Media Preview */}
          {selectedMedia && (
            <View className="mt-4 rounded-2xl overflow-hidden relative">
              {mediaType === 'image' ? (
                <Image
                  source={{ uri: selectedMedia }}
                  className="w-full h-80"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-80 bg-zinc-900 items-center justify-center">
                  <Video size={64} color="#fff" strokeWidth={1.5} />
                  <Text className="text-white mt-4">Video Selected</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectedMedia(null);
                  setMediaType(null);
                }}
                disabled={isLoading}
                className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-full items-center justify-center"
                activeOpacity={0.8}
              >
                <X size={18} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Toolbar */}
      <View className="border-t border-zinc-900 px-6 py-4 flex-row items-center">
        <TouchableOpacity
          onPress={showPhotoOptions}
          disabled={isLoading || !!selectedMedia}
          className={`flex-row items-center px-4 py-3 rounded-full mr-3 ${
            selectedMedia ? 'bg-zinc-800' : 'bg-zinc-900'
          }`}
          activeOpacity={0.7}
        >
          <ImageIcon 
            size={20} 
            color={selectedMedia ? '#71717a' : '#fff'} 
            strokeWidth={2} 
          />
          <Text className={`ml-2 font-medium ${selectedMedia ? 'text-zinc-600' : 'text-white'}`}>
            Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSelectVideo}
          disabled={isLoading || !!selectedMedia}
          className={`flex-row items-center px-4 py-3 rounded-full ${
            selectedMedia ? 'bg-zinc-800' : 'bg-zinc-900'
          }`}
          activeOpacity={0.7}
        >
          <Video 
            size={20} 
            color={selectedMedia ? '#71717a' : '#fff'} 
            strokeWidth={2} 
          />
          <Text className={`ml-2 font-medium ${selectedMedia ? 'text-zinc-600' : 'text-white'}`}>
            Video
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
