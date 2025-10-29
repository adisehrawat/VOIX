// User Types
export interface User {
  id: string;
  name?: string;
  Name?: string;
  username?: string;
  email: string;
  imageUrl?: string;
  ImageUrl?: string;
  publicKey: string;
  walletId: string;
  authType: 'Google' | 'Password';
  createdAt: Date;
}

// Friend Types
export interface FriendRequest {
  id: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  status: 'Requested' | 'Approved';
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  programId: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  amount: string;
  type: 'Tip' | 'Normal';
  tokenSymbol: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tip Types
export interface Tip {
  id: string;
  amount: string;
  senderId: string;
  sender: User;
  buzzId: string;
  symbol: string;
  created: Date;
  updatedAt: Date;
}

// Karma Types
export interface Karma {
  userid: string;
  points: string;
  nfts: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

// Location Types
export interface Location {
  userId: string;
  user: User;
  latitude: string;
  longitude: string;
}

// Vote Types
export interface Vote {
  id: string;
  userId: string;
  postId: string;
  type: 'UpVote' | 'DownVote';
  createdAt: Date;
  updatedAt: Date;
}

