import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { buzzAPI, BuzzData } from '../services/api';

interface BuzzContextType {
  buzzCache: Map<number, BuzzData[]>;
  buzzDetailCache: Map<string, BuzzData>;
  loading: boolean;
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

  const getBuzzes = useCallback(async (page: number, forceRefresh: boolean = false): Promise<BuzzData[]> => {
    if (!forceRefresh && buzzCache.has(page)) {
      return buzzCache.get(page)!;
    }

    try {
      setLoading(true);
      
      const response = await buzzAPI.getBuzzes(page);
      
      if (response.success && response.data) {
        const mainBuzzes = response.data.filter((buzz: any) => !buzz.parentBuzzId && !buzz.parentId);
        
        if (mainBuzzes.length !== response.data.length) {
          console.warn(`Filtered out ${response.data.length - mainBuzzes.length} comments from buzz list`);
        }
        
        setBuzzCache(prev => {
          const newCache = new Map(prev);
          newCache.set(page, mainBuzzes);
          return newCache;
        });

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

  const getBuzzById = useCallback(async (buzzId: string, forceRefresh: boolean = false): Promise<BuzzData | null> => {
    if (!forceRefresh && buzzDetailCache.has(buzzId)) {
      return buzzDetailCache.get(buzzId)!;
    }

    try {
      setLoading(true);
      
      const response = await buzzAPI.getBuzzById(buzzId);
      
      if (response.success && response.data) {
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

  const getUserBuzzes = useCallback(async (userId: string, page: number, forceRefresh: boolean = false): Promise<BuzzData[]> => {
    const cacheKey = `${userId}-${page}`;
    
    if (!forceRefresh && userBuzzCache.has(cacheKey)) {
      return userBuzzCache.get(cacheKey)!;
    }

    try {
      setLoading(true);
      
      const response = await buzzAPI.getUserBuzzes(userId, page);
      
      if (response.success && response.data) {
        // Filter out any comments that might have slipped through
        const mainBuzzes = response.data.filter((buzz: any) => !buzz.parentBuzzId && !buzz.parentId);
        
        if (mainBuzzes.length !== response.data.length) {
          console.warn(`Filtered out ${response.data.length - mainBuzzes.length} comments from user buzz list`);
        }
        
        setUserBuzzCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, mainBuzzes);
          return newCache;
        });

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

  const getUserReplies = useCallback(async (userId: string, page: number, forceRefresh: boolean = false): Promise<BuzzData[]> => {
    const cacheKey = `${userId}-replies-${page}`;
    
    if (!forceRefresh && userRepliesCache.has(cacheKey)) {
      return userRepliesCache.get(cacheKey)!;
    }

    try {
      setLoading(true);
      
      const response = await buzzAPI.getUserReplies(userId, page);
      
      if (response.success && response.data) {
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

  const updateBuzzInCache = useCallback((buzzId: string, updatedFields: Partial<BuzzData>) => {
    
    setBuzzDetailCache(prev => {
      const newCache = new Map(prev);
      const existingBuzz = newCache.get(buzzId);
      if (existingBuzz) {
        newCache.set(buzzId, { ...existingBuzz, ...updatedFields });
      }
      return newCache;
    });

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

  const clearCache = useCallback(() => {
    setBuzzCache(new Map());
    setBuzzDetailCache(new Map());
    setUserBuzzCache(new Map());
  }, []);

  const invalidateBuzzCache = useCallback(() => {
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

