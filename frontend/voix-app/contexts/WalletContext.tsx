import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { walletAPI, WalletDetails, TransactionData } from '../services/api';
import { useAuth } from './AuthContext';

interface WalletContextType {
  walletDetails: WalletDetails | null;
  recentTransactions: TransactionData[];
  loading: boolean;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadWalletData = useCallback(async () => {
    if (!isAuthenticated) {
      setWalletDetails(null);
      setRecentTransactions([]);
      return;
    }

    try {
      setLoading(true);
      
      const walletResponse = await walletAPI.getWalletDetails();
      
      if (walletResponse.success && walletResponse.data) {
        setWalletDetails(walletResponse.data);
      }

      const txResponse = await walletAPI.getRecentTransactions();
      
      if (txResponse.success && txResponse.data) {
        setRecentTransactions(txResponse.data);
      }
    } catch (error) {
      console.error('WalletContext: Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshWallet = useCallback(async () => {
    await loadWalletData();
  }, [loadWalletData]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWalletData();
    } else {
      setWalletDetails(null);
      setRecentTransactions([]);
    }
  }, [isAuthenticated]);

  return (
    <WalletContext.Provider
      value={{
        walletDetails,
        recentTransactions,
        loading,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

