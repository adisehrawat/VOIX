import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authAPI, karmaAPI, friendAPI, UserData, KarmaData } from '../services/api';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  userData: UserData | null;
  karmaData: KarmaData | null;
  friendsCount: number;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [karmaData, setKarmaData] = useState<KarmaData | null>(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadProfileData = useCallback(async () => {
    if (!isAuthenticated) {
      setUserData(null);
      setKarmaData(null);
      setFriendsCount(0);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch user profile
      const userResponse = await authAPI.getMe();
      if (userResponse.success && userResponse.data) {
        setUserData(userResponse.data);
        
        // Fetch karma data and friends count in parallel
        const [karmaResponse, friendsResponse] = await Promise.all([
          karmaAPI.getMyKarma(),
          friendAPI.getFriends()
        ]);
        
        if (karmaResponse.success && karmaResponse.data) {
          setKarmaData(karmaResponse.data);
        }
        
        if (friendsResponse.success && friendsResponse.data) {
          setFriendsCount(friendsResponse.data.length);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshProfile = async () => {
    await loadProfileData();
  };

  // Load profile data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData();
    } else {
      setUserData(null);
      setKarmaData(null);
    }
  }, [isAuthenticated, loadProfileData]);

  return (
    <ProfileContext.Provider
      value={{
        userData,
        karmaData,
        friendsCount,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

