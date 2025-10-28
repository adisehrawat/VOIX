import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';

// ==================== TOKEN MANAGEMENT ====================

export const TOKEN_KEY = STORAGE_KEYS.TOKEN;

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// ==================== API HELPER ====================

const apiCall = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  requiresAuth: boolean = false
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Debug logging
  console.log('🚀 API Call:', method, url);
  if (body) console.log('📦 Request Body:', JSON.stringify(body, null, 2));

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    console.log('📡 Response Status:', response.status);
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
    }
    
    const data = await response.json();
    console.log('✅ Response Data:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Network Error:', error);
    console.error('URL was:', url);
    throw error;
  }
};

// ==================== AUTH API ====================

export const authAPI = {
  /**
   * Sign up a new user with email and password
   * POST /api/v1/auth/signup
   */
  signUp: async (name: string, email: string, password: string, imageUrl?: string) => {
    return apiCall('/auth/signup', 'POST', {
      name,
      email,
      password,
      imageUrl,
      authtype: 'Password',
    });
  },

  /**
   * Sign in with email and password
   * POST /api/v1/auth/signin
   */
  signIn: async (email: string, password: string) => {
    return apiCall('/auth/signin', 'POST', {
      email,
      password,
    });
  },

  /**
   * Get current authenticated user's profile
   * GET /api/v1/auth/me
   * Requires: Authentication
   */
  getMe: async () => {
    return apiCall('/auth/me', 'GET', undefined, true);
  },

  /**
   * Get user by email (public info only)
   * POST /api/v1/auth/user
   */
  getUserByEmail: async (email: string) => {
    return apiCall('/auth/user', 'POST', { email });
  },

  /**
   * Search users by name
   * GET /api/v1/auth/searchuser/:name
   */
  searchUser: async (name: string) => {
    return apiCall(`/auth/searchuser/${name}`, 'GET');
  },

  /**
   * Add user location (first time)
   * POST /api/v1/auth/add-location
   * Requires: Authentication
   */
  addLocation: async (longitude: string, latitude: string) => {
    return apiCall('/auth/add-location', 'POST', { longitude, latitude }, true);
  },

  /**
   * Update user location
   * POST /api/v1/auth/update-location
   * Requires: Authentication
   */
  updateLocation: async (longitude: string, latitude: string) => {
    return apiCall('/auth/update-location', 'POST', { longitude, latitude }, true);
  },

  /**
   * Update user profile (name and/or imageUrl)
   * PUT /api/v1/auth/update-profile
   * Requires: Authentication
   * @param data - Object containing name and/or imageUrl
   */
  updateProfile: async (data: { name?: string; imageUrl?: string }) => {
    return apiCall('/auth/update-profile', 'PUT', data, true);
  },
};

// ==================== BUZZ API ====================

export const buzzAPI = {
  /**
   * Create a new buzz (post)
   * POST /api/v1/buzz/create
   * Requires: Authentication
   */
  createBuzz: async (content?: string, image?: string) => {
    return apiCall('/buzz/create', 'POST', { content, image }, true);
  },

  /**
   * Create a comment on a buzz
   * POST /api/v1/buzz/comment/create
   * Requires: Authentication
   */
  createComment: async (content?: string, image?: string, parentBuzzId?: string) => {
    return apiCall('/buzz/comment/create', 'POST', { content, image, parentBuzzId }, true);
  },

  /**
   * Vote on a buzz (upvote or downvote)
   * POST /api/v1/buzz/vote/create
   * Requires: Authentication
   */
  createVote: async (postid: string, type: 'UpVote' | 'DownVote') => {
    return apiCall('/buzz/vote/create', 'POST', { postid, type }, true);
  },

  /**
   * Delete a vote
   * POST /api/v1/buzz/vote/delete
   * Requires: Authentication
   */
  deleteVote: async (postid: string) => {
    return apiCall('/buzz/vote/delete', 'POST', { postid }, true);
  },

  /**
   * Get paginated list of all buzzes
   * GET /api/v1/buzz/buzz/:pagenumber
   */
  getBuzzes: async (pagenumber: number = 1) => {
    return apiCall(`/buzz/buzz/${pagenumber}`, 'GET');
  },

  /**
   * Get comments for a specific buzz
   * GET /api/v1/buzz/buzzcomment/:buzzid
   */
  getBuzzComments: async (buzzid: string) => {
    return apiCall(`/buzz/buzzcomment/${buzzid}`, 'GET');
  },

  /**
   * Search buzzes by query
   * GET /api/v1/buzz/Searchbuzz/:query
   */
  searchBuzz: async (query: string) => {
    return apiCall(`/buzz/Searchbuzz/${query}`, 'GET');
  },

  /**
   * Get buzzes from friends (following feed)
   * GET /api/v1/buzz/followingbuzz/:pagenumber
   * Requires: Authentication
   */
  getFollowingBuzz: async (pagenumber: number = 1) => {
    return apiCall(`/buzz/followingbuzz/${pagenumber}`, 'GET', undefined, true);
  },

  /**
   * Get buzzes for a specific user
   * GET /api/v1/buzz/user/:userid/:pagenumber
   */
  getUserBuzzes: async (userid: string, pagenumber: number = 1) => {
    return apiCall(`/buzz/user/${userid}/${pagenumber}`, 'GET');
  },

  /**
   * Get single buzz by ID
   * GET /api/v1/buzz/single/:buzzid
   */
  getBuzzById: async (buzzid: string) => {
    return apiCall(`/buzz/single/${buzzid}`, 'GET');
  },

  /**
   * Get user's replies/comments
   * GET /api/v1/buzz/user/replies/:userid/:pagenumber
   */
  getUserReplies: async (userid: string, pagenumber: number = 1) => {
    return apiCall(`/buzz/user/replies/${userid}/${pagenumber}`, 'GET');
  },
};

// ==================== FRIEND API ====================

export const friendAPI = {
  /**
   * Send a friend request
   * POST /api/v1/friends/request-friend
   * Requires: Authentication
   */
  requestFriend: async (reciverid: string) => {
    return apiCall('/friends/request-friend', 'POST', { reciverid }, true);
  },

  /**
   * Approve a friend request
   * POST /api/v1/friends/approve-request
   * Requires: Authentication
   */
  approveRequest: async (senderid: string) => {
    return apiCall('/friends/approve-request', 'POST', { senderid }, true);
  },

  /**
   * Remove a friend
   * POST /api/v1/friends/remove-friend
   * Requires: Authentication
   */
  removeFriend: async (friendid: string) => {
    return apiCall('/friends/remove-friend', 'POST', { friendid }, true);
  },

  /**
   * Get list of friends
   * GET /api/v1/friends/get
   * Requires: Authentication
   */
  getFriends: async () => {
    return apiCall('/friends/get', 'GET', undefined, true);
  },

  /**
   * Get pending friend requests (sent by you, waiting for approval)
   * GET /api/v1/friends/pending
   * Requires: Authentication
   */
  getPendingRequests: async () => {
    return apiCall('/friends/pending', 'GET', undefined, true);
  },

  /**
   * Get received friend requests (sent to you, waiting for your approval)
   * GET /api/v1/friends/requested
   * Requires: Authentication
   */
  getRequestedFriends: async () => {
    return apiCall('/friends/requested', 'GET', undefined, true);
  },
};

// ==================== TIP API ====================

export const tipAPI = {
  /**
   * Tip a buzz with SOL or SPL tokens
   * POST /api/v1/tip/tip-buzz
   * Requires: Authentication
   */
  tipBuzz: async (
    amount: number,
    buzzid: string,
    Symbol: string,
    reciverPubkey: string
  ) => {
    return apiCall(
      '/tip/tip-buzz',
      'POST',
      { amount, buzzid, Symbol, reciverPubkey },
      true
    );
  },

  /**
   * Tip a user directly with SOL or SPL tokens
   * POST /api/v1/tip/tip-user
   * Requires: Authentication
   */
  tipUser: async (amount: number, Symbol: string, reciverPubkey: string) => {
    return apiCall('/tip/tip-user', 'POST', { amount, Symbol, reciverPubkey }, true);
  },

  /**
   * Mint a milestone NFT based on karma points
   * POST /api/v1/tip/mint-milestone-nft
   * Requires: Authentication
   * Milestones: 1000 points (Bronze), 5000 points (Silver), 10000 points (Gold)
   */
  mintMilestoneNFT: async () => {
    return apiCall('/tip/mint-milestone-nft', 'POST', {}, true);
  },
};

// ==================== KARMA API ====================

export const karmaAPI = {
  /**
   * Get karma for a specific user
   * GET /api/v1/karma/user/:userid
   */
  getUserKarma: async (userid: string) => {
    return apiCall(`/karma/user/${userid}`, 'GET');
  },

  /**
   * Get current authenticated user's karma
   * GET /api/v1/karma/me
   * Requires: Authentication
   */
  getMyKarma: async () => {
    return apiCall('/karma/me', 'GET', undefined, true);
  },

  /**
   * Get top karma users (leaderboard)
   * GET /api/v1/karma/top?limit=10
   * @param limit - Number of top users to return (max 100, default 10)
   */
  getTopKarmaUsers: async (limit: number = 10) => {
    return apiCall(`/karma/top?limit=${limit}`, 'GET');
  },
};

/**
 * Wallet API endpoints
 * Base path: /api/v1/wallet
 */
export const walletAPI = {
  /**
   * Get wallet details (public key, balances)
   * GET /api/v1/wallet/details
   * Requires: Authentication
   */
  getWalletDetails: async () => {
    return apiCall('/wallet/details', 'GET', undefined, true);
  },

  /**
   * Get transaction history with pagination
   * GET /api/v1/wallet/transactions?page=1
   * Requires: Authentication
   */
  getTransactions: async (page: number = 1) => {
    return apiCall(`/wallet/transactions?page=${page}`, 'GET', undefined, true);
  },

  /**
   * Get recent transactions (last 5)
   * GET /api/v1/wallet/transactions/recent
   * Requires: Authentication
   */
  getRecentTransactions: async () => {
    return apiCall('/wallet/transactions/recent', 'GET', undefined, true);
  },
};

// ==================== TYPE DEFINITIONS ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | any;
  token?: string;
  id?: string;
  amount?: number;
}

export interface BuzzData {
  id: string;
  content?: string;
  image?: string;
  userid: string;
  parentBuzzId?: string | null; // If set, this is a comment
  parentBuzz?: { // The parent buzz (if this is a comment)
    id: string;
    content?: string;
    user: {
      Name: string;
      ImageUrl: string;
    };
  };
  user: {
    id: string;
    Name: string;
    ImageUrl: string;
    email: string;
    public_key?: string;
  };
  Vote: { userid: string; type?: 'UpVote' | 'DownVote' }[];
  tips: {
    id: string;
    amount: string;
    symbol: string;
    sender: {
      Name: string;
      ImageUrl: string;
    };
  }[];
  _count?: {
    replies: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  Name: string;
  ImageUrl: string;
  email: string;
  public_key: string;
  wallet_id: string;
  Auth_type: 'Google' | 'Password';
  location?: {
    Latitude: string;
    Longitude: string;
  };
  karma?: {
    points: string;
    nfts: number;
  };
  createdAt: string;
  updateAt: string;
}

export interface FriendData {
  id: string;
  userid: string;
  friendId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestData {
  id: string;
  senderid: string;
  sender?: UserData;
  reciverid: string;
  reciver?: UserData;
  status: 'Requested' | 'Approved';
  createdAt: string;
  updatedAt: string;
}

export interface KarmaData {
  userid: string;
  points: string;
  nfts: number;
  user: {
    id: string;
    Name: string;
    ImageUrl: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WalletDetails {
  publicKey: string;
  walletId: string;
  balances: {
    SOL: number;
    USDC: number;
  };
}

export interface TransactionData {
  id: string;
  programid: string;
  senderId: string;
  reciverid: string;
  amount: string;
  tokenSymbol: string;
  type: 'Tip' | 'Normal';
  createdAt: string;
  updatedAt: string;
  direction: 'sent' | 'received';
  sender?: {
    id: string;
    Name: string;
    ImageUrl: string;
    public_key: string;
  };
  receiver?: {
    id: string;
    Name: string;
    ImageUrl: string;
    public_key: string;
  };
}

export interface TransactionHistoryResponse {
  transactions: TransactionData[];
  totals: {
    sent: string;
    received: string;
  };
  hasMore: boolean;
}

// Search API
export const searchAPI = {
  search: async (query: string, type: 'all' | 'users' | 'buzzes' = 'all', page: number = 1, limit: number = 10) => {
    return apiCall(`/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`, 'GET');
  },
  
  getUserProfile: async (identifier: string) => {
    return apiCall(`/search/user/${encodeURIComponent(identifier)}`, 'GET');
  }
};

// Friend Request API
export const friendRequestAPI = {
  sendRequest: async (receiverId: string) => {
    return apiCall('/friends/request-friend', 'POST', { reciverid: receiverId }, true);
  },
  
  acceptRequest: async (senderId: string) => {
    return apiCall('/friends/approve-request', 'POST', { senderid: senderId }, true);
  },
  
  rejectRequest: async (senderId: string) => {
    return apiCall('/friends/reject-request', 'POST', { senderid: senderId }, true);
  },
  
  removeFriend: async (friendId: string) => {
    return apiCall('/friends/remove-friend', 'POST', { friendid: friendId }, true);
  },
  
  getFriendshipStatus: async (userId: string) => {
    return apiCall(`/friends/status/${userId}`, 'GET', undefined, true);
  },
  
  getPendingRequests: async () => {
    return apiCall('/friends/pending', 'GET', undefined, true);
  },
  
  getSentRequests: async () => {
    return apiCall('/friends/requested', 'GET', undefined, true);
  }
};
