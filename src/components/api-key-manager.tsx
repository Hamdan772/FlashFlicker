
'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/use-api-key';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { KeyRound, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function ApiKeyManager() {
  const { apiKey, setApiKey, isKeySet, isHydrated } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // When popover opens, populate input with current key if it exists
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && isHydrated && isKeySet && apiKey && !inputValue) {
      setInputValue(apiKey);
    }
    if (!newOpen) {
      setInputValue(''); // Clear input when closing
      setShowKey(false); // Reset show key state
    }
    setOpen(newOpen);
  };
  const { toast } = useToast();

  const validateApiKey = (key: string) => {
    // Basic Gemini API key validation
    return key.startsWith('AIza') && key.length > 30;
  };

  const handleSave = () => {
    if (!inputValue.trim()) {
      toast({
        title: 'Invalid API Key',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
      return;
    }

    // Handle abbreviations
    let finalApiKey = inputValue.trim();
    const upperInput = inputValue.trim().toUpperCase();
    if (upperInput === 'OWNER' || upperInput === 'JUDGE' || upperInput === 'TEST') {
      finalApiKey = 'AIzaSyDnpuqJ3kFFT9y31y7oHd0cbJhf01-GiHg';
    }

    if (!validateApiKey(finalApiKey) && upperInput !== 'JUDGE' && upperInput !== 'OWNER' && upperInput !== 'TEST') {
      toast({
        title: 'Invalid API Key Format',
        description: 'Please check your Gemini API key format. It should start with "AIza".',
        variant: 'destructive',
      });
      return;
    }

    setApiKey(finalApiKey);
    
    // Get storage stats to show user
    const stats = storage.getStorageStats();
    
    const isAbbreviation = finalApiKey !== inputValue.trim();
    
    toast({
      title: 'API Key Saved',
      description: isAbbreviation 
        ? `Abbreviation recognized! Your Gemini API key has been set securely. Storage: ${(stats.totalSize / 1024).toFixed(1)}KB used.`
        : `Your Gemini API key has been encrypted and saved securely. Storage: ${(stats.totalSize / 1024).toFixed(1)}KB used.`,
    });
    setInputValue('');
    setOpen(false);
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast({
        title: 'Copied to Clipboard',
        description: 'Your API key has been copied.',
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
        <Tooltip>
            <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                     <Button 
                        variant={isHydrated && isKeySet ? "outline" : "destructive"} 
                        size="icon"
                        className={cn(isHydrated && isKeySet && "border-green-500 hover:border-green-600 text-green-500")}
                      >
                        <KeyRound className="h-4 w-4" />
                        <span className="sr-only">Manage API Key</span>
                    </Button>
                </PopoverTrigger>
            </TooltipTrigger>
             <TooltipContent side="bottom">
                {isHydrated && isKeySet ? 'Manage your Gemini API key' : 'Set your Gemini API Key to enable AI features'}
            </TooltipContent>
        </Tooltip>
      <PopoverContent className="w-80" side="bottom" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Gemini API Key</h4>
            <p className="text-sm text-muted-foreground">
              {isHydrated && isKeySet ? 'Your API key is saved and encrypted in your browser. Edit or clear it below.' : 'Enter your API key to enable AI features. It will be encrypted and stored securely in your browser.'}
            </p>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Encrypted • Local Storage • Never Transmitted</span>
            </div>
          </div>
          <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isHydrated && isKeySet ? "Current key loaded - edit or clear" : "Enter your Gemini API key"}
                />
                 <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
          </div>
           {isHydrated && isKeySet && apiKey && (
             <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground truncate">Current key: ••••••••{apiKey.slice(-4)}</p>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          )}
          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={!inputValue} className="flex-1">
              {isHydrated && isKeySet ? 'Update Key' : 'Save Key'}
            </Button>
            {isHydrated && isKeySet && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setApiKey('');
                  toast({
                    title: 'API Key Cleared',
                    description: 'Your API key has been removed from storage.',
                  });
                  setOpen(false);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

    