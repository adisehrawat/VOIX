import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import CreateBuzzPage from '../components/pages/create-buzz/CreateBuzzPage';
import { buzzAPI } from '../services/api';

export default function CreateBuzzModal() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (isLoading) {
      Alert.alert('Please wait', 'Your buzz is being posted...');
      return;
    }
    router.back();
  };

  const handlePost = async (content: string, image: string | null) => {
    try {
      setIsLoading(true);
      console.log('Creating buzz with:', { 
        contentLength: content.length,
        hasImage: !!image,
        imageType: image ? (image.startsWith('data:') ? 'base64' : 'uri') : null
      });

      // Call the API to create the buzz
      const response = await buzzAPI.createBuzz(
        content || undefined, 
        image || undefined
      );

      console.log('Create buzz response:', response);

      if (response.success) {
        // Navigate back to home tab to see the new buzz
        router.back();
        
        // Show success message after navigation
        setTimeout(() => {
          Alert.alert('Success! 🎉', 'Your buzz has been posted');
        }, 300);
      } else {
        throw new Error(response.error || 'Failed to create buzz');
      }
    } catch (error) {
      console.error('Error creating buzz:', error);
      Alert.alert(
        'Error',
        'Failed to post your buzz. Please try again.',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateBuzzPage 
      onClose={handleClose} 
      onPost={handlePost}
      isLoading={isLoading}
    />
  );
}
