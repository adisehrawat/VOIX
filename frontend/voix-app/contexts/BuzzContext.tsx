import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { buzzAPI, BuzzData } from '../services/api';

interface BuzzContextType {
  // Cache of all buzzes by page
  buzzCache: Map<number, BuzzData[]>;
  // Cache of individual buzz details
  buzzDetailCache: Map<string, BuzzData>;
  // Loading states
  loading: boolean;
  // Functions
  getBuzzes: (page: number, forceRefresh?: boolean) => Promise<BuzzData[]>;
  getBuzzById: (buzzId: string, forceRefresh?: boolean) => Promise<BuzzData | null>;
  getUserBuzzes: (userId: string, page: number, forceRefresh?: boolean) => Promise<BuzzData[]>;
  getUserReplies: (userId: string, page: number, forceRefresh?: boolean) => Promise<BuzzData[]>;
  updateBuzzInCache: (buzzId: string, updatedBuzz: Partial<BuzzData>) => void;
  clearCache: () => void;
  invalidateBuzzCache: () => void;
}

const BuzzContext = createContext<BuzzContextType | undefined>(undefined);

export const BuzzProvider = ({ children }: { children: ReactNode }) => {
  const [buzzCache, setBuzzCache] = useState<Map<number, BuzzData[]>>(new Map());
  const [buzzDetailCache, setBuzzDetailCache] = useState<Map<string, BuzzData>>(new Map());
  const [userBuzzCache, setUserBuzzCache] = useState<Map<string, BuzzData[]>>(new Map());
  const [userRepliesCache, setUserRepliesCache] = useState<Map<string, BuzzData[]>>(new Map());
  const [loading, setLoading] = useState(false);

  // Get buzzes with caching
  const getBuzzes = useCallback(async (page: number, forceRefresh: boolean = false): Promise<BuzzData[]> => {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && buzzCache.has(page)) {
      console.log(`Returning cached buzzes for page ${page}`);
      return buzzCache.get(page)!;
    }

    try {
      setLoading(true);
      console.log(`Fetching buzzes for page ${page} from API`);
      
      const response = await buzzAPI.getBuzzes(page);
      
      if (response.success && response.data) {
        // Filter out any comments that might have slipped through
        // Comments have parentBuzzId set, main buzzes don't
        const mainBuzzes = response.data.filter((buzz: any) => !buzz.parentBuzzId && !buzz.parentId);
        
        if (mainBuzzes.length !== response.data.length) {
          console.warn(`Filtered out ${response.data.length - mainBuzzes.length} comments from buzz list`);
        }
        
        // Update cache
        setBuzzCache(prev => {
          const newCache = new Map(prev);
          newCache.set(page, mainBuzzes);
          return newCache;
        });

        // Also cache individual buzz details
        mainBuzzes.forEach((buzz: BuzzData) => {
          setBuzzDetailCache(prev => {
            const newCache = new Map(prev);
            newCache.set(buzz.id, buzz);
            return newCache;
          });
        });

        return mainBuzzes;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching buzzes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [buzzCache]);

  // Get single buzz by ID with caching
  const getBuzzById = useCallback(async (buzzId: string, forceRefresh: boolean = false): Promise<BuzzData | null> => {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && buzzDetailCache.has(buzzId)) {
      console.log(`Returning cached buzz detail for ${buzzId}`);
      return buzzDetailCache.get(buzzId)!;
    }

    try {
      setLoading(true);
      console.log(`Fetching buzz ${buzzId} from API`);
      
      const response = await buzzAPI.getBuzzById(buzzId);
      
      if (response.success && response.data) {
        // Update cache
        setBuzzDetailCache(prev => {
          const newCache = new Map(prev);
          newCache.set(buzzId, response.data);
          return newCache;
        });

        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching buzz:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [buzzDetailCache]);

  // Get user buzzes with caching
  const getUserBuzzes = useCallback(async (userId: string, page: number, forceRefresh: boolean = false): Promise<BuzzData[]> => {
    const cacheKey = `${userId}-${page}`;
    
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && userBuzzCache.has(cacheKey)) {
      console.log(`Returning cached user buzzes for ${userId}, page ${page}`);
      return userBuzzCache.get(cacheKey)!;
    }

    try {
      setLoading(true);
      console.log(`Fetching user buzzes for ${userId}, page ${page} from API`);
      
      const response = await buzzAPI.getUserBuzzes(userId, page);
      
      if (response.success && response.data) {
        // Filter out any comments that might have slipped through
        const mainBuzzes = response.data.filter((buzz: any) => !buzz.parentBuzzId && !buzz.parentId);
        
        if (mainBuzzes.length !== response.data.length) {
          console.warn(`Filtered out ${response.data.length - mainBuzzes.length} comments from user buzz list`);
        }
        
        // Update cache
        setUserBuzzCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, mainBuzzes);
          return newCache;
        });

        // Also cache individual buzz details
        mainBuzzes.forEach((buzz: BuzzData) => {
          setBuzzDetailCache(prev => {
            const newCache = new Map(prev);
            newCache.set(buzz.id, buzz);
            return newCache;
          });
        });

        return mainBuzzes;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user buzzes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userBuzzCache]);

  // Get user's replies with caching
  const getUserReplies = useCallback(async (userId: string, page: number, forceRefresh: boolean = false): Promise<BuzzData[]> => {
    const cacheKey = `${userId}-replies-${page}`;
    
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && userRepliesCache.has(cacheKey)) {
      console.log(`Returning cached user replies for ${userId}, page ${page}`);
      return userRepliesCache.get(cacheKey)!;
    }

    try {
      setLoading(true);
      console.log(`Fetching user replies for ${userId}, page ${page} from API`);
      
      const response = await buzzAPI.getUserReplies(userId, page);
      
      if (response.success && response.data) {
        // Update cache
        setUserRepliesCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, response.data);
          return newCache;
        });

        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user replies:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userRepliesCache]);

  // Update a specific buzz in cache (for optimistic updates)
  const updateBuzzInCache = useCallback((buzzId: string, updatedFields: Partial<BuzzData>) => {
    console.log(`Updating buzz ${buzzId} in cache`);
    
    // Update buzz detail cache
    setBuzzDetailCache(prev => {
      const newCache = new Map(prev);
      const existingBuzz = newCache.get(buzzId);
      if (existingBuzz) {
        newCache.set(buzzId, { ...existingBuzz, ...updatedFields });
      }
      return newCache;
    });

    // Update buzz list cache
    setBuzzCache(prev => {
      const newCache = new Map(prev);
      prev.forEach((buzzes, page) => {
        const updatedBuzzes = buzzes.map(buzz => 
          buzz.id === buzzId ? { ...buzz, ...updatedFields } : buzz
        );
        newCache.set(page, updatedBuzzes);
      });
      return newCache;
    });

    // Update user buzz cache
    setUserBuzzCache(prev => {
      const newCache = new Map(prev);
      prev.forEach((buzzes, key) => {
        const updatedBuzzes = buzzes.map(buzz => 
          buzz.id === buzzId ? { ...buzz, ...updatedFields } : buzz
        );
        newCache.set(key, updatedBuzzes);
      });
      return newCache;
    });
  }, []);

  // Clear all caches
  const clearCache = useCallback(() => {
    console.log('Clearing all buzz caches');
    setBuzzCache(new Map());
    setBuzzDetailCache(new Map());
    setUserBuzzCache(new Map());
  }, []);

  // Invalidate buzz cache (force refresh on next fetch)
  const invalidateBuzzCache = useCallback(() => {
    console.log('Invalidating buzz cache');
    setBuzzCache(new Map());
  }, []);

  const value: BuzzContextType = {
    buzzCache,
    buzzDetailCache,
    loading,
    getBuzzes,
    getBuzzById,
    getUserBuzzes,
    getUserReplies,
    updateBuzzInCache,
    clearCache,
    invalidateBuzzCache,
  };

  return <BuzzContext.Provider value={value}>{children}</BuzzContext.Provider>;
};

export const useBuzz = () => {
  const context = useContext(BuzzContext);
  if (context === undefined) {
    throw new Error('useBuzz must be used within a BuzzProvider');
  }
  return context;
};

