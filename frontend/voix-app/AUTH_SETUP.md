# Authentication Setup Guide

This guide explains how the authentication system works and how to set it up for development and testing.

## Overview

The app now has a fully integrated authentication system that:
- Connects to your backend API for sign-up and sign-in
- Stores JWT tokens securely in AsyncStorage
- Checks authentication state on app launch
- Provides sign-out functionality
- Protects routes based on authentication status

## Files Modified/Created

### New Files:
1. **`services/api.ts`** - API service layer with all backend endpoints
2. **`config/constants.ts`** - Configuration constants including API URL

### Modified Files:
1. **`app/(auth)/sign-in.tsx`** - Integrated with backend sign-in API
2. **`app/(auth)/sign-up.tsx`** - Integrated with backend sign-up API
3. **`app/_layout.tsx`** - Added authentication check on app launch
4. **`app/(tabs)/profile/profile.tsx`** - Added sign-out button

## Setup Instructions

### 1. Start Your Backend Server

Make sure your backend is running:

```bash
cd Backend
npm run dev
# or
pnpm dev
```

Your backend should be running on `http://localhost:3000` (or the port specified in your `.env` file)

### 2. Configure Backend URL

Update the API URL in `config/constants.ts` based on your setup:

**For iOS Simulator:**
```typescript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

**For Android Emulator:**
```typescript
export const API_BASE_URL = 'http://10.0.2.2:3000/api/v1';
```

**For Physical Device:**
```typescript
export const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api/v1';
// Example: 'http://192.168.1.100:3000/api/v1'
```

To find your local IP:
- **Mac/Linux:** Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows:** Run `ipconfig` and look for IPv4 Address

### 3. Install Dependencies (if not already done)

```bash
npm install
# or
npm install @react-native-async-storage/async-storage
```

### 4. Run the App

```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

## How to Test

### Sign Up Flow:
1. Launch the app
2. After the welcome screen, you'll see the sign-in page
3. Tap "Sign up" at the bottom
4. Fill in:
   - Name (minimum 3 characters)
   - Email
   - Password (minimum 8 characters)
5. Tap "Sign Up"
6. If successful, you'll be automatically logged in and redirected to the home feed

### Sign In Flow:
1. If you already have an account, enter your email and password
2. Tap "Sign In"
3. You'll be redirected to the home feed

### Sign Out Flow:
1. Navigate to the Profile tab (rightmost tab)
2. Scroll down to the quick actions
3. Tap "Sign Out" (red button)
4. Confirm the sign-out dialog
5. You'll be redirected back to the sign-in page

### Persistent Login:
1. Sign in to the app
2. Close the app completely
3. Reopen the app
4. After the welcome screen, you should be automatically logged in (no need to sign in again)

## API Endpoints Available

The `services/api.ts` file provides the following API modules:

### Auth API (`authAPI`)
- `signUp(name, email, password)` - Create new account
- `signIn(email, password)` - Login
- `getMe()` - Get current user info (requires auth)
- `getUserByEmail(email)` - Get user by email
- `searchUser(name)` - Search users by name
- `addLocation(longitude, latitude)` - Add user location
- `updateLocation(longitude, latitude)` - Update user location

### Buzz API (`buzzAPI`)
- `createBuzz(content, image)` - Create new post
- `createComment(content, image, parentBuzzId)` - Comment on post
- `createVote(postid, type)` - Upvote/downvote
- `deleteVote(postid)` - Remove vote
- `getBuzzes(pagenumber)` - Get all buzzes
- `getBuzzComments(buzzid)` - Get comments
- `searchBuzz(query)` - Search buzzes
- `getFollowingBuzz(pagenumber)` - Get friend buzzes

### Friend API (`friendAPI`)
- `requestFriend(reciverid)` - Send friend request
- `approveRequest(senderid)` - Accept friend request
- `removeFriend(friendid)` - Remove friend
- `getFriends()` - Get friends list
- `getPendingRequests()` - Get pending requests
- `getRequestedFriends()` - Get received requests

### Tip API (`tipAPI`)
- `tipBuzz(amount, buzzid, Symbol, reciverPubkey)` - Tip a buzz
- `tipUser(amount, Symbol, reciverPubkey)` - Tip a user
- `mintMilestoneNFT()` - Mint karma milestone NFT

### Karma API (`karmaAPI`)
- `getUserKarma(userid)` - Get user's karma
- `getMyKarma()` - Get own karma
- `getTopKarmaUsers(limit)` - Get leaderboard

## Token Management

JWT tokens are automatically managed:
- **Saved** after successful sign-up/sign-in
- **Included** in all authenticated API requests (via Authorization header)
- **Checked** on app launch to restore session
- **Removed** on sign-out

The token is stored securely using React Native AsyncStorage.

## Troubleshooting

### "Network request failed" error:
- Make sure your backend server is running
- Check that the API_BASE_URL in `config/constants.ts` is correct
- If using a physical device, ensure both device and computer are on the same network
- Try disabling any firewall that might block local connections

### "Wrong credentials" error:
- Verify the user exists in the database
- Check that password matches what was used during sign-up
- Backend uses plain password comparison (make sure this matches your setup)

### App stuck on loading screen:
- Check React Native logs for errors
- Verify AsyncStorage is working properly
- Try clearing app data and restarting

### Sign out not working:
- Check console logs for errors
- Verify token is being removed from AsyncStorage
- Try force closing the app after sign out

## Next Steps

Now that authentication is integrated, you can:
1. Start integrating other features (buzz creation, friend system, etc.)
2. Add user profile fetching on app launch
3. Implement proper error handling for network failures
4. Add loading states for better UX
5. Implement token refresh mechanism

## Security Notes

⚠️ **Important for Production:**
- Use HTTPS for production API
- Implement token refresh mechanism
- Add proper password hashing on backend (currently using plain text comparison)
- Add rate limiting on authentication endpoints
- Consider using React Native Keychain for more secure token storage
- Implement proper error messages (avoid leaking information)

