
"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const JUDGE_API_KEY = 'AIzaSyDnpuqJ3kFFT9y31y7oHd0cbJhf01-GiHg';
const API_KEY_STORAGE_KEY = 'gemini_api_key';

// Simple storage helpers for API key
const saveApiKeySimple = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    return true;
  } catch (error) {
    console.error('Failed to save API key:', error);
    return false;
  }
};

const getApiKeySimple = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to get API key:', error);
    return null;
  }
};

const removeApiKeySimple = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove API key:', error);
  }
};

type ApiKeyContextType = {
  apiKey: string; // This will be the key to USE for API calls
  setApiKey: (key: string) => void;
  isKeySet: boolean;
  isOwner: boolean;
  isJudge: boolean;
  isHydrated: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  // Start with empty state to avoid hydration mismatch
  const [internalApiKey, setInternalApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isJudge, setIsJudge] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load API key from storage after hydration
    const storedKey = getApiKeySimple();
    
    if (storedKey) {
      setInternalApiKey(storedKey);
      setIsKeySet(true);
      setIsOwner(false);
      setIsJudge(false);
    }
    
    setIsHydrated(true);
  }, []);

  const setApiKey = useCallback((key: string) => {
    const upperCaseKey = key.toUpperCase();
    if (upperCaseKey === 'JUDGE' || upperCaseKey === 'OWNER' || upperCaseKey === 'TEST') {
      setInternalApiKey(JUDGE_API_KEY);
      setIsKeySet(true);
      setIsOwner(upperCaseKey === 'OWNER');
      setIsJudge(upperCaseKey === 'JUDGE' || upperCaseKey === 'TEST');
      // Clear any previous user-set key for special keys
      removeApiKeySimple();
    } else if (key) {
      saveApiKeySimple(key);
      
      setInternalApiKey(key);
      setIsKeySet(true);
      setIsOwner(false);
      setIsJudge(false);
    } else {
      removeApiKeySimple();
      setInternalApiKey('');
      setIsKeySet(false);
      setIsOwner(false);
      setIsJudge(false);
    }
  }, []);
  
  // The value exposed to the rest of the app.
  // Note that `apiKey` here is the *actual* key to be used.
  // Other parts of the app don't need to know if it's the special key or not.
  const contextValue = {
    apiKey: internalApiKey,
    setApiKey,
    isKeySet,
    isOwner,
    isJudge,
    isHydrated,
  };

  return (
    <ApiKeyContext.Provider value={contextValue}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}

    