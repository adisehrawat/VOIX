import { router } from 'expo-router';
import { Image as ImageIcon, Video, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateBuzz() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePost = () => {
    // TODO: Implement post creation logic
    console.log('Creating buzz:', { content, selectedImage });
    router.back();
  };

  const handleSelectImage = () => {
    // TODO: Implement image picker
    setSelectedImage('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600');
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <X size={28} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Create Buzz</Text>
        <TouchableOpacity
          onPress={handlePost}
          className="bg-white px-5 py-2 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-black font-semibold">Post</Text>
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
            className="text-white text-lg min-h-[150px]"
            style={{ textAlignVertical: 'top' }}
          />

          {/* Image Preview */}
          {selectedImage && (
            <View className="mt-4 rounded-2xl overflow-hidden relative">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-80"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
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
          onPress={handleSelectImage}
          className="flex-row items-center bg-zinc-900 px-4 py-3 rounded-full mr-3"
          activeOpacity={0.7}
        >
          <ImageIcon size={20} color="#fff" strokeWidth={2} />
          <Text className="text-white ml-2 font-medium">Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-zinc-900 px-4 py-3 rounded-full"
          activeOpacity={0.7}
        >
          <Video size={20} color="#fff" strokeWidth={2} />
          <Text className="text-white ml-2 font-medium">Video</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

