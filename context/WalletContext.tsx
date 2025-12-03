import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WalletUser {
  connected: boolean;
  address: string;
  name: string;
  avatar: string;
}

interface WalletContextType {
  wallet: WalletUser | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletUser | null>(null);

  const connect = () => {
    // Simulate connection
    setTimeout(() => {
        setWallet({
          connected: true,
          address: "0x71C95911E9a5D330f4D621842EC243EE13439A23",
          name: "Dr. Aris Kothari",
          avatar: "https://i.pravatar.cc/150?u=3"
        });
    }, 300);
  };

  const disconnect = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};