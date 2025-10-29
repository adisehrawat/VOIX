import Logo from '@/components/ui/Logo';
import { StickNoBills_500Medium, useFonts } from "@expo-google-fonts/stick-no-bills";
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
    const [fontsLoaded] = useFonts({
        StickNoBills_500Medium,
    });

    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { width } = useWindowDimensions();
    const { signIn } = useAuth();

    const handleSignUp = async () => {
        if (!name || !mail || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (name.length < 3) {
            Alert.alert('Error', 'Name must be at least 3 characters');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.signUp(name, mail, password);

            if (response.success && response.token) {
                await signIn(response.token);
                router.replace('/(tabs)');
            } else {
                const errorMessage = typeof response?.error === 'string'
                  ? response.error
                  : (response?.error?.message ?? JSON.stringify(response?.error ?? {}));
                Alert.alert('Error', errorMessage || 'Failed to create account');
            }
        } catch (error) {
            console.error('Sign up error:', error);
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
            <Text className="text-gray-300 mb-2 text-lg font-medium">Name</Text>
                <TextInput
                    className="w-full bg-[#1a1a1a] text-gray-100 rounded-2xl px-5 py-4 mb-6 border border-transparent focus:border-[#3B82F6] focus:bg-[#222222]"
                    placeholder="John Doe"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                />
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
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text className="text-black text-lg font-semibold">Sign Up</Text>
                    )}
                </TouchableOpacity>
                <View className='flex-row gap-3 items-center justify-center mt-4'>
                    <Text className='text-gray-300'>Already have an account?</Text>
                    <Link href='/sign-in'>
                        <Text className='text-white font-bold'>Sign In</Text>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignUp