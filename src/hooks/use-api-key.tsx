
"use client";

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const JUDGE_API_KEY = 'AIzaSyDnpuqJ3kFFT9y31y7oHd0cbJhf01-GiHg';
const API_KEY_STORAGE_KEY = 'gemini_api_key';

type ApiKeyContextType = {
  apiKey: string; // This will be the key to USE for API calls
  setApiKey: (key: string) => void;
  isKeySet: boolean;
  isOwner: boolean;
  isJudge: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  // The key to be used by the app for API calls
  const [internalApiKey, setInternalApiKey] = useState('');
  // Whether a key (any key) is currently active
  const [isKeySet, setIsKeySet] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isJudge, setIsJudge] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setInternalApiKey(storedKey);
      setIsKeySet(true);
      setIsOwner(false);
      setIsJudge(false);
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    const upperCaseKey = key.toUpperCase();
    if (upperCaseKey === 'JUDGE' || upperCaseKey === 'OWNER') {
      setInternalApiKey(JUDGE_API_KEY);
      setIsKeySet(true);
      setIsOwner(upperCaseKey === 'OWNER');
      setIsJudge(upperCaseKey === 'JUDGE');
      // Crucially, do NOT store the special key in localStorage
      // But we can clear any previous user-set key
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } else if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setInternalApiKey(key);
      setIsKeySet(true);
      setIsOwner(false);
      setIsJudge(false);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
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

    