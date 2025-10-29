import { router, useLocalSearchParams } from 'expo-router';
import { ArrowDown, ArrowLeft, ArrowUp, Send } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../config/constants';
import EnhancedTipModal from '../../components/tips/EnhancedTipModal';
import { buzzAPI, BuzzData, BuzzData2 } from '../../services/api';
import { useBuzz } from '../../contexts/BuzzContext';
import { useProfile } from '../../contexts/ProfileContext';

const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Helper to decode JWT and get user ID
const getCurrentUserId = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        console.log('getCurrentUserId (detail) - Token key:', STORAGE_KEYS.TOKEN);
        console.log('getCurrentUserId (detail) - Token exists:', !!token);

        if (!token) {
            console.log('getCurrentUserId (detail) - No token found');
            return null;
        }

        const parts = token.split('.');
        console.log('getCurrentUserId (detail) - Token parts:', parts.length);

        if (parts.length !== 3) {
            console.log('getCurrentUserId (detail) - Invalid token format');
            return null;
        }

        const payload = JSON.parse(atob(parts[1]));
        console.log('getCurrentUserId (detail) - Decoded payload:', payload);
        console.log('getCurrentUserId (detail) - User ID:', payload.id);

        return payload.id || null;
    } catch (error) {
        console.error('getCurrentUserId (detail) - Error:', error);
        return null;
    }
};

interface CommentData {
    id: string;
    content?: string;
    image?: string;
    userid: string;
    user: {
        id: string;
        Name: string;
        ImageUrl: string;
        email: string;
    };
    Vote: { userid: string; type?: 'UpVote' | 'DownVote' }[];
    createdAt: string;
    updatedAt: string;
}

const CommentItem = ({ comment }: { comment: CommentData }) => {
    const upvotes = comment.Vote?.filter(v => v.type === 'UpVote').length || 0;
    const downvotes = comment.Vote?.filter(v => v.type === 'DownVote').length || 0;

    return (
        <View className="px-6 py-4 border-b border-zinc-900">
            <View className="flex-row">
                <Image
                    source={{ uri: comment.user.ImageUrl }}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-white font-semibold mr-2">{comment.user.Name}</Text>
                        <Text className="text-gray-400 text-sm">
                            {formatTimeAgo(new Date(comment.createdAt))}
                        </Text>
                    </View>
                    {comment.content && (
                        <Text className="text-white text-base mb-2">{comment.content}</Text>
                    )}
                    {comment.image && (
                        <Image
                            source={{ uri: comment.image }}
                            className="w-full h-40 rounded-xl mt-2 mb-2"
                            resizeMode="cover"
                        />
                    )}
                    <View className="flex-row items-center">
                        <TouchableOpacity className="flex-row items-center mr-4" activeOpacity={0.7}>
                            <ArrowUp size={16} color="#fff" strokeWidth={2} />
                            <Text className="text-gray-400 text-sm ml-1">{upvotes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center mr-4" activeOpacity={0.7}>
                            <ArrowDown size={16} color="#fff" strokeWidth={2} />
                            <Text className="text-gray-400 text-sm ml-1">{downvotes}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default function BuzzDetail() {
    const { id } = useLocalSearchParams();
    const { getBuzzById } = useBuzz();
    const { refreshProfile } = useProfile();
    const [commentText, setCommentText] = useState('');
    const [showTipModal, setShowTipModal] = useState(false);
    const [buzz, setBuzz] = useState<BuzzData2 | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [userVote, setUserVote] = useState<'UpVote' | 'DownVote' | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Get current user ID on mount
    useEffect(() => {
        const initializeUser = async () => {
            const userId = await getCurrentUserId();
            console.log('BuzzDetail - Setting currentUserId:', userId);
            setCurrentUserId(userId);
        };
        initializeUser();
    }, []);

    // Check user's vote status when buzz loads
    useEffect(() => {
        if (currentUserId && buzz?.Vote) {
            const existingVote = buzz.Vote.find(v => v.userid === currentUserId);
            if (existingVote && existingVote.type) {
                setUserVote(existingVote.type);
            } else {
                setUserVote(null);
            }
        }
    }, [buzz, currentUserId]);

    const loadBuzzDetails = useCallback(async () => {
        try {
            // Don't set loading for subsequent calls (after initial load)
            if (!buzz) {
                setLoading(true);
            }


            // Use context to get buzz (with caching)
            const buzzData = await getBuzzById(id as string, !buzz); // Force refresh only on first load

            if (buzzData) {
                setBuzz(buzzData);
            } else {
                router.back();
            }
        } catch (error) {
            console.error('Error loading buzz:', error);
            router.back();
        } finally {
            if (!buzz) {
                setLoading(false);
            }
        }
    }, [id, buzz, getBuzzById]);

    const loadComments = useCallback(async () => {
        try {
            const response = await buzzAPI.getBuzzComments(id as string);

            if (response.success && response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }, [id]);

    useEffect(() => {
        loadBuzzDetails();
        loadComments();
    }, [loadBuzzDetails, loadComments]);

    const handleVote = async (type: 'UpVote' | 'DownVote') => {
        console.log('handleVote called (detail page):', { type, currentUserId, userVote });

        if (!buzz) {
            console.log('No buzz data');
            return;
        }

        if (!currentUserId) {
            return;
        }

        const previousVote = userVote;

        try {
            // Optimistic update - update UI immediately
            if (userVote === type) {
                // Removing vote
                setUserVote(null);
            } else {
                // Adding or switching vote
                setUserVote(type);
            }

            // Make API call
            if (previousVote === type) {
                await buzzAPI.deleteVote(buzz.id);
            } else if (previousVote && previousVote !== type) {
                await buzzAPI.createVote(buzz.id, type);
            } else {
                await buzzAPI.createVote(buzz.id, type);
            }

            // Refresh karma data if the vote affects karma (upvote)
            if (type === 'UpVote' || (previousVote === 'UpVote' && type === 'DownVote')) {
                refreshProfile();
            }

            // Reload buzz to get accurate vote counts and update cache
            await loadBuzzDetails();
        } catch (error) {
            console.error('Error voting:', error);
            // Revert optimistic update on error
            setUserVote(previousVote);
        }
    };

    const handleSendComment = async () => {
        if (!commentText.trim() || !buzz) return;

        try {
            setPosting(true);

            const response = await buzzAPI.createComment(
                commentText.trim(),
                undefined,
                buzz.id
            );

            if (response.success) {
                setCommentText('');
                await loadComments();
            } else {
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setPosting(false);
        }
    };

    const handleTip = (buzzId: string, amount: string, symbol: string) => {
        console.log('Tipping buzz:', { buzzId, amount, symbol });
        // TODO: Integrate with backend tip API
        Alert.alert('Coming Soon', 'Tipping functionality will be available soon!');
    };

    if (loading && !buzz) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                {/* Header */}
                <View className="flex-row items-center px-6 py-4 border-b border-zinc-900">
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="mr-4">
                        <ArrowLeft size={24} color="#fff" strokeWidth={2} />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Buzz</Text>
                </View>

                {/* Loading content */}
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="text-white mt-4">Loading buzz...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!buzz) {
        return null; // Should not happen but safety check
    }

    const upvotes = buzz.Vote?.filter(v => v.type === 'UpVote').length || 0;
    const downvotes = buzz.Vote?.filter(v => v.type === 'DownVote').length || 0;
    const totalTips = buzz.Tip?.length || 0;

    const renderHeader = () => (
        <>
            {/* Buzz Content */}
            <View className="px-6 py-4">
                <View className="flex-row items-center mb-4">
                    <Image
                        source={{ uri: buzz.user.ImageUrl }}
                        className="w-12 h-12 rounded-full mr-3"
                    />
                    <View className="flex-1">
                        <Text className="text-white font-semibold text-base">{buzz.user.Name}</Text>
                        <Text className="text-gray-400 text-sm">
                            {formatTimeAgo(new Date(buzz.createdAt))}
                        </Text>
                    </View>
                </View>

                {buzz.content && (
                    <Text className="text-white text-lg mb-4 leading-7">{buzz.content}</Text>
                )}

                {buzz.image && (
                    <View className="mb-4 rounded-2xl overflow-hidden">
                        <Image
                            source={{ uri: buzz.image }}
                            className="w-full h-80"
                            resizeMode="cover"
                        />
                    </View>
                )}

                {/* Stats */}
                <View className="flex-row items-center py-3 border-y border-zinc-900 mb-3">
                    <Text className="text-gray-400 text-sm mr-4">
                        {upvotes} upvotes · {downvotes} downvotes
                    </Text>
                    <Text className="text-gray-400 text-sm mr-4">
                        · {comments.length} comments
                    </Text>
                    {totalTips > 0 && (
                        <Text className="text-orange-500 text-sm font-semibold">
                            · 🪙 {totalTips} tips
                        </Text>
                    )}
                </View>

                {/* Actions */}
                <View className="flex-row items-center justify-between pb-4 border-b border-zinc-900">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Upvote button pressed (detail page)');
                                handleVote('UpVote');
                            }}
                            activeOpacity={0.6}
                            className="flex-row items-center px-3 py-2 rounded-lg"
                            style={{
                                backgroundColor: userVote === 'UpVote' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                            }}
                        >
                            <ArrowUp
                                size={26}
                                color="#fff"
                                strokeWidth={userVote === 'UpVote' ? 3 : 2}
                            />
                            <Text className={`ml-1 text-sm font-semibold ${userVote === 'UpVote' ? 'text-white' : 'text-gray-400'}`}>
                                {upvotes}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                console.log('Downvote button pressed (detail page)');
                                handleVote('DownVote');
                            }}
                            activeOpacity={0.6}
                            className="flex-row items-center px-3 py-2 rounded-lg"
                            style={{
                                backgroundColor: userVote === 'DownVote' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                            }}
                        >
                            <ArrowDown
                                size={26}
                                color="#fff"
                                strokeWidth={userVote === 'DownVote' ? 3 : 2}
                            />
                            <Text className={`ml-1 text-sm font-semibold ${userVote === 'DownVote' ? 'text-white' : 'text-gray-400'}`}>
                                {downvotes}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity
                            onPress={() => setShowTipModal(true)}
                            className="bg-orange-500 px-4 py-2 rounded-full"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold">💰 Tip</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Enhanced Tip Modal */}
            <EnhancedTipModal
                visible={showTipModal}
                recipient={{
                    id: buzz.user.id,
                    name: buzz.user.Name,
                    avatar: buzz.user.ImageUrl
                }}
                buzzId={buzz.id}
                onClose={() => setShowTipModal(false)}
                onTip={handleTip}
            />

            {/* Comments Header */}
            <View className="px-6 py-3 bg-zinc-900/50">
                <Text className="text-white font-semibold text-lg">
                    Comments ({comments.length})
                </Text>
            </View>
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-zinc-900">
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="mr-4">
                    <ArrowLeft size={24} color="#fff" strokeWidth={2} />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Buzz</Text>
            </View>

            {/* Content */}
            <FlatList
                ListHeaderComponent={renderHeader}
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CommentItem comment={item} />}
                ListEmptyComponent={
                    <View className="px-6 py-10 items-center">
                        <Text className="text-gray-500 text-base">No comments yet</Text>
                        <Text className="text-gray-600 text-sm mt-1">Be the first to comment!</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Comment Input */}
            <View className="border-t border-zinc-900 px-6 py-3 flex-row items-center bg-black">
                <TextInput
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="Add a comment..."
                    placeholderTextColor="#71717a"
                    editable={!posting}
                    className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-full mr-3"
                />
                <TouchableOpacity
                    onPress={handleSendComment}
                    disabled={!commentText.trim() || posting}
                    className={`w-10 h-10 rounded-full items-center justify-center ${commentText.trim() && !posting ? 'bg-white' : 'bg-zinc-700'
                        }`}
                    activeOpacity={0.8}
                >
                    {posting ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Send size={18} color={commentText.trim() ? '#000' : '#71717a'} strokeWidth={2.5} />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
