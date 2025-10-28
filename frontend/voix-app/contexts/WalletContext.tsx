import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const loadWalletData = async () => {
    if (!isAuthenticated) {
      console.log('WalletContext: User not authenticated');
      setWalletDetails(null);
      setRecentTransactions([]);
      return;
    }

    try {
      console.log('WalletContext: Starting to load wallet data...');
      setLoading(true);
      
      // Fetch wallet details (public key and balances)
      console.log('WalletContext: Fetching wallet details...');
      const walletResponse = await walletAPI.getWalletDetails();
      console.log('WalletContext: Wallet response:', walletResponse);
      
      if (walletResponse.success && walletResponse.data) {
        setWalletDetails(walletResponse.data);
        console.log('WalletContext: Wallet details set:', walletResponse.data);
      } else {
        console.log('WalletContext: Failed to get wallet details:', walletResponse.error);
      }

      // Fetch recent transactions
      console.log('WalletContext: Fetching recent transactions...');
      const txResponse = await walletAPI.getRecentTransactions();
      console.log('WalletContext: Transaction response:', txResponse);
      
      if (txResponse.success && txResponse.data) {
        setRecentTransactions(txResponse.data);
        console.log('WalletContext: Transactions set, count:', txResponse.data.length);
      } else {
        console.log('WalletContext: Failed to get transactions:', txResponse.error);
      }
    } catch (error) {
      console.error('WalletContext: Error loading wallet data:', error);
    } finally {
      setLoading(false);
      console.log('WalletContext: Loading complete');
    }
  };

  const refreshWallet = async () => {
    await loadWalletData();
  };

  // Load wallet data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWalletData();
    } else {
      setWalletDetails(null);
      setRecentTransactions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

