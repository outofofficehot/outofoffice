// Aztec.js integration hook for Out Of Office
// DEMO MODE: Using mock implementation for UI preview
// TODO: Replace with real Aztec.js integration for production

import { useState, useCallback } from 'react';

interface UseAztecReturn {
  pxe: unknown | null;
  wallet: unknown | null;
  contract: unknown | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: (network?: 'sandbox' | 'alpha') => Promise<void>;
  signalInterest: (myLinkedInId: string, theirLinkedInId: string) => Promise<string>;
  checkMutual: (myLinkedInId: string, theirLinkedInId: string) => Promise<boolean>;
  withdrawSignal: (theirLinkedInId: string) => Promise<boolean>;
  mySignals: Signal[];
  myMatches: Match[];
}

interface Signal {
  toLinkedInHash: string;
  stakeAmount: bigint;
  timestamp: number;
}

interface Match {
  theirLinkedInHash: string;
  matchedAt: number;
}

// Simple hash function for demo
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(16, '0');
}

// Stake amount: $10 in USDC (6 decimals)
const STAKE_AMOUNT = BigInt(10_000_000);

export function useAztec(): UseAztecReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mySignals, setMySignals] = useState<Signal[]>([]);
  const [myMatches, setMyMatches] = useState<Match[]>([]);

  // Connect (demo mode - simulates connection)
  const connect = useCallback(async (_network: 'sandbox' | 'alpha' = 'sandbox') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to connect:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Signal interest (demo mode)
  const signalInterest = useCallback(
    async (myLinkedInId: string, theirLinkedInId: string): Promise<string> => {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const theirHash = simpleHash(theirLinkedInId.toLowerCase());
      const txHash = simpleHash(Date.now().toString());

      // Update local state
      setMySignals(prev => [
        ...prev,
        {
          toLinkedInHash: theirHash,
          stakeAmount: STAKE_AMOUNT,
          timestamp: Date.now(),
        },
      ]);

      return txHash;
    },
    []
  );

  // Check for mutual match (demo mode)
  const checkMutual = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (myLinkedInId: string, theirLinkedInId: string): Promise<boolean> => {
      // myLinkedInId is used in production for private set intersection
      // Simulate check delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo: 30% chance of match for testing
      const isMatch = Math.random() < 0.3;
      
      if (isMatch) {
        const theirHash = simpleHash(theirLinkedInId.toLowerCase());
        setMyMatches(prev => [
          ...prev,
          {
            theirLinkedInHash: theirHash,
            matchedAt: Date.now(),
          },
        ]);
      }

      return isMatch;
    },
    []
  );

  // Withdraw a signal (demo mode)
  const withdrawSignal = useCallback(
    async (theirLinkedInId: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const theirHash = simpleHash(theirLinkedInId.toLowerCase());
      
      setMySignals(prev =>
        prev.filter(s => s.toLinkedInHash !== theirHash)
      );

      return true;
    },
    []
  );

  return {
    pxe: null,
    wallet: null,
    contract: null,
    isConnected,
    isLoading,
    error,
    connect,
    signalInterest,
    checkMutual,
    withdrawSignal,
    mySignals,
    myMatches,
  };
}
