import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#000000' }
    }}>
      <Stack.Screen
        name='sign-in'
      />
      <Stack.Screen
        name='sign-up'
      />
    </Stack>
  );
}