# VOIX Frontend API Reference

Complete reference for all backend API endpoints available in your frontend.

## 📚 Table of Contents
- [Authentication](#authentication-api)
- [Buzz (Posts)](#buzz-api)
- [Friends](#friend-api)
- [Tips](#tip-api)
- [Karma](#karma-api)
- [Usage Examples](#usage-examples)

---

## 🔐 Authentication API

### `authAPI.signUp()`
Create a new user account.
```typescript
const response = await authAPI.signUp(
  'John Doe',           // name
  'john@example.com',   // email
  'password123',        // password (min 8 chars)
  'https://...'         // imageUrl (optional)
);
// Returns: { success: true, token: "jwt_token" }
```

### `authAPI.signIn()`
Sign in existing user.
```typescript
const response = await authAPI.signIn(
  'john@example.com',   // email
  'password123'         // password
);
// Returns: { success: true, token: "jwt_token" }
```

### `authAPI.getMe()` 🔒
Get current authenticated user's profile.
```typescript
const response = await authAPI.getMe();
// Returns: { success: true, data: UserData }
```

### `authAPI.getUserByEmail()`
Get public user info by email.
```typescript
const response = await authAPI.getUserByEmail('john@example.com');
// Returns: { success: true, data: UserData }
```

### `authAPI.searchUser()`
Search users by name.
```typescript
const response = await authAPI.searchUser('john');
// Returns: { success: true, data: UserData[] }
```

### `authAPI.addLocation()` 🔒
Add user location (first time).
```typescript
const response = await authAPI.addLocation(
  '-122.4194',  // longitude
  '37.7749'     // latitude
);
// Returns: { success: true, id: "location_id" }
```

### `authAPI.updateLocation()` 🔒
Update user location.
```typescript
const response = await authAPI.updateLocation(
  '-122.4194',  // longitude
  '37.7749'     // latitude
);
// Returns: { success: true, id: "location_id" }
```

---

## 📱 Buzz API

### `buzzAPI.createBuzz()` 🔒
Create a new post.
```typescript
const response = await buzzAPI.createBuzz(
  'Hello VOIX!',        // content (optional if image provided)
  'https://...'         // image URL (optional if content provided)
);
// Returns: { success: true, id: "buzz_id" }
```

### `buzzAPI.createComment()` 🔒
Comment on a buzz.
```typescript
const response = await buzzAPI.createComment(
  'Great post!',        // content
  undefined,            // image (optional)
  'buzz_id_123'         // parentBuzzId
);
// Returns: { success: true, id: "comment_id" }
```

### `buzzAPI.createVote()` 🔒
Upvote or downvote a buzz.
```typescript
const response = await buzzAPI.createVote(
  'buzz_id_123',        // postid
  'UpVote'              // type: 'UpVote' | 'DownVote'
);
// Returns: { success: true, id: "vote_id" }
```

### `buzzAPI.deleteVote()` 🔒
Remove your vote from a buzz.
```typescript
const response = await buzzAPI.deleteVote('buzz_id_123');
// Returns: { success: true }
```

### `buzzAPI.getBuzzes()`
Get paginated list of all buzzes.
```typescript
const response = await buzzAPI.getBuzzes(1); // page number
// Returns: { success: true, data: BuzzData[] }
```

### `buzzAPI.getBuzzComments()`
Get all comments for a buzz.
```typescript
const response = await buzzAPI.getBuzzComments('buzz_id_123');
// Returns: { success: true, data: BuzzData[] }
```

### `buzzAPI.searchBuzz()`
Search buzzes by content.
```typescript
const response = await buzzAPI.searchBuzz('react native');
// Returns: { success: true, data: BuzzData[] }
```

### `buzzAPI.getFollowingBuzz()` 🔒
Get buzzes from friends only.
```typescript
const response = await buzzAPI.getFollowingBuzz(1); // page number
// Returns: { success: true, data: BuzzData[] }
```

---

## 👥 Friend API

### `friendAPI.requestFriend()` 🔒
Send a friend request.
```typescript
const response = await friendAPI.requestFriend('user_id_456');
// Returns: { success: true, id: "request_id" }
```

### `friendAPI.approveRequest()` 🔒
Accept a friend request.
```typescript
const response = await friendAPI.approveRequest('sender_id_789');
// Returns: { success: true, id: "friend_id" }
```

### `friendAPI.removeFriend()` 🔒
Remove a friend.
```typescript
const response = await friendAPI.removeFriend('friend_id_456');
// Returns: { success: true }
```

### `friendAPI.getFriends()` 🔒
Get list of your friends.
```typescript
const response = await friendAPI.getFriends();
// Returns: { success: true, data: FriendData[] }
```

### `friendAPI.getPendingRequests()` 🔒
Get friend requests you sent (waiting for approval).
```typescript
const response = await friendAPI.getPendingRequests();
// Returns: { success: true, data: FriendRequestData[] }
```

### `friendAPI.getRequestedFriends()` 🔒
Get friend requests sent to you (waiting for your approval).
```typescript
const response = await friendAPI.getRequestedFriends();
// Returns: { success: true, data: FriendRequestData[] }
```

---

## 💰 Tip API

### `tipAPI.tipBuzz()` 🔒
Tip a buzz with SOL or SPL tokens.
```typescript
const response = await tipAPI.tipBuzz(
  0.1,                          // amount (in tokens)
  'buzz_id_123',                // buzzid
  'SOL',                        // Symbol (or SPL token mint address)
  'HN7cA...xyz'                 // reciverPubkey (Solana public key)
);
// Returns: { success: true, amount: 0.1 }
```

### `tipAPI.tipUser()` 🔒
Tip a user directly.
```typescript
const response = await tipAPI.tipUser(
  0.5,                          // amount
  'SOL',                        // Symbol
  'HN7cA...xyz'                 // reciverPubkey
);
// Returns: { success: true, amount: 0.5 }
```

### `tipAPI.mintMilestoneNFT()` 🔒
Mint a karma milestone NFT.
```typescript
// Automatically checks your karma and mints appropriate NFT:
// - 1000+ points: Bronze Badge
// - 5000+ points: Silver Badge  
// - 10000+ points: Gold Badge
const response = await tipAPI.mintMilestoneNFT();
// Returns: { success: true }
```

---

## ⚡ Karma API

### `karmaAPI.getUserKarma()`
Get karma for any user.
```typescript
const response = await karmaAPI.getUserKarma('user_id_123');
// Returns: { success: true, data: KarmaData }
```

### `karmaAPI.getMyKarma()` 🔒
Get your own karma.
```typescript
const response = await karmaAPI.getMyKarma();
// Returns: { success: true, data: KarmaData }
```

### `karmaAPI.getTopKarmaUsers()`
Get karma leaderboard.
```typescript
const response = await karmaAPI.getTopKarmaUsers(10); // limit (max 100)
// Returns: { success: true, data: KarmaData[] }
```

---

## 📖 Usage Examples

### Complete Sign Up Flow
```typescript
import { authAPI, saveToken } from '@/services/api';
import { router } from 'expo-router';

const handleSignUp = async () => {
  try {
    const response = await authAPI.signUp(
      name,
      email,
      password
    );
    
    if (response.success && response.token) {
      await saveToken(response.token);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', response.error);
    }
  } catch (error) {
    Alert.alert('Error', 'Network request failed');
  }
};
```

### Load Home Feed
```typescript
import { buzzAPI } from '@/services/api';
import { useState, useEffect } from 'react';

const HomeScreen = () => {
  const [buzzes, setBuzzes] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    loadBuzzes();
  }, [page]);
  
  const loadBuzzes = async () => {
    const response = await buzzAPI.getBuzzes(page);
    if (response.success) {
      setBuzzes(response.data);
    }
  };
  
  return (
    <FlatList
      data={buzzes}
      renderItem={({ item }) => <BuzzCard buzz={item} />}
      onEndReached={() => setPage(page + 1)}
    />
  );
};
```

### Create Buzz with Validation
```typescript
import { buzzAPI } from '@/services/api';

const createPost = async (content: string, image?: string) => {
  if (!content && !image) {
    Alert.alert('Error', 'Provide content or image');
    return;
  }
  
  const response = await buzzAPI.createBuzz(content, image);
  
  if (response.success) {
    Alert.alert('Success', 'Buzz created!');
    router.back();
  } else {
    Alert.alert('Error', response.error);
  }
};
```

### Upvote/Downvote Toggle
```typescript
import { buzzAPI } from '@/services/api';

const handleVote = async (buzzId: string, currentVote: string | null) => {
  if (currentVote === 'UpVote') {
    // Remove vote
    await buzzAPI.deleteVote(buzzId);
  } else {
    // Add or change vote
    await buzzAPI.createVote(buzzId, 'UpVote');
  }
  
  // Refresh buzz data
  await loadBuzz();
};
```

### Friend Request System
```typescript
import { friendAPI } from '@/services/api';

// Send friend request
const sendRequest = async (userId: string) => {
  const response = await friendAPI.requestFriend(userId);
  if (response.success) {
    Alert.alert('Success', 'Friend request sent!');
  }
};

// Accept friend request
const acceptRequest = async (senderId: string) => {
  const response = await friendAPI.approveRequest(senderId);
  if (response.success) {
    Alert.alert('Success', 'Friend request accepted!');
    await loadFriends();
  }
};

// Load pending requests
const loadRequests = async () => {
  const response = await friendAPI.getRequestedFriends();
  if (response.success) {
    setRequests(response.data);
  }
};
```

### Tip with Solana
```typescript
import { tipAPI } from '@/services/api';

const tipBuzz = async (
  buzzId: string,
  amount: number,
  receiverPubkey: string
) => {
  const response = await tipAPI.tipBuzz(
    amount,
    buzzId,
    'SOL',              // or SPL token mint address
    receiverPubkey
  );
  
  if (response.success) {
    Alert.alert('Success', `Tipped ${amount} SOL!`);
  } else {
    Alert.alert('Error', 'Tip failed');
  }
};
```

### Display Karma Leaderboard
```typescript
import { karmaAPI } from '@/services/api';

const KarmaLeaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  const loadLeaderboard = async () => {
    const response = await karmaAPI.getTopKarmaUsers(20);
    if (response.success) {
      setTopUsers(response.data);
    }
  };
  
  return (
    <FlatList
      data={topUsers}
      renderItem={({ item, index }) => (
        <View>
          <Text>#{index + 1}</Text>
          <Text>{item.user.Name}</Text>
          <Text>{item.points} points</Text>
          <Text>{item.nfts} NFTs</Text>
        </View>
      )}
    />
  );
};
```

---

## 🔑 Legend

- 🔒 = Requires Authentication (JWT token)
- All endpoints return `{ success: boolean, ... }`
- Token is automatically included when using authenticated endpoints
- Debug logs are printed in console for all API calls

---

## 📝 Notes

1. **Authentication Required**: Endpoints marked with 🔒 require a valid JWT token
2. **Automatic Token Management**: Token is automatically added to requests when needed
3. **Debug Logging**: All API calls are logged in console for debugging
4. **Error Handling**: Always check `response.success` before accessing `response.data`
5. **Pagination**: Buzz endpoints use page numbers starting from 1

---

## 🚀 Quick Start

```typescript
import { authAPI, buzzAPI, friendAPI, tipAPI, karmaAPI } from '@/services/api';

// Sign up
const { success, token } = await authAPI.signUp(name, email, password);

// Get buzzes
const { data: buzzes } = await buzzAPI.getBuzzes(1);

// Create buzz
await buzzAPI.createBuzz('Hello VOIX!');

// Send friend request
await friendAPI.requestFriend(userId);

// Get your karma
const { data: karma } = await karmaAPI.getMyKarma();
```

