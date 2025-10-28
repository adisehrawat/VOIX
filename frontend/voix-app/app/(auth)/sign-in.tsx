import Logo from '@/components/ui/Logo';
import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
    const [fontsLoaded] = useFonts({
        StickNoBills_500Medium,
    });

    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { width } = useWindowDimensions();
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        if (!mail || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.signIn(mail, password);
            
            if (response.success && response.token) {
                await signIn(response.token);
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', response.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView className='flex-1 items-center justify-start bg-black'>
            <View className='mb-8 items-center w-full relative'>
                <Image
                    source={require('@/assets/images/globe.png')}
                    style={{ width: width, height: width * 0.75 }}
                    resizeMode="cover"
                />
                <View
                    className='absolute items-center'
                    style={{
                        bottom: 40,
                        left: 0,
                        right: 0,
                    }}
                >
                    <Logo />
                </View>
            </View>
            <View className="justify-start items-center bg-black w-full mb-6">
                <Text
                    className="text-white leading-none"
                    style={{
                        fontFamily: 'StickNoBills_500Medium',
                        fontSize: 72,
                    }}
                >
                    VOIX
                </Text>
            </View>
            <View className="w-full bg-black px-6 pb-8">
                <Text className="text-gray-300 mb-2 text-lg font-medium">Email</Text>
                <TextInput
                    className="w-full bg-[#1a1a1a] text-gray-100 rounded-2xl px-5 py-4 mb-6 border border-transparent focus:border-[#3B82F6] focus:bg-[#222222]"
                    placeholder="example@gmail.com"
                    placeholderTextColor="#9ca3af"
                    value={mail}
                    onChangeText={setMail}
                />

                <Text className="text-gray-300 mb-2 text-lg font-medium">Password</Text>
                <TextInput
                    className="w-full bg-[#1a1a1a] text-gray-100 rounded-2xl px-5 py-4 mb-8 border border-transparent focus:border-[#3B82F6] focus:bg-[#222222]"
                    placeholder="********"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-full bg-white py-4 rounded-3xl items-center"
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text className="text-black text-lg font-semibold">Sign In</Text>
                    )}
                </TouchableOpacity>
                <View className='flex-row gap-3 items-center justify-center mt-4'>
                    <Text className='text-gray-300'>Dont have an account?</Text>
                    <Link href='/sign-up'>
                        <Text className='text-white font-bold'>Sign up</Text>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignIn