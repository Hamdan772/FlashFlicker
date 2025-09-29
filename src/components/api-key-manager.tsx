
'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/use-api-key';
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
  const { apiKey, setApiKey, isKeySet } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setApiKey(inputValue);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been securely saved in your browser.',
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
    <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
            <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                     <Button 
                        variant={isKeySet ? "outline" : "destructive"} 
                        size="icon"
                        className={cn(isKeySet && "border-green-500 hover:border-green-600 text-green-500")}
                      >
                        <KeyRound className="h-4 w-4" />
                        <span className="sr-only">Manage API Key</span>
                    </Button>
                </PopoverTrigger>
            </TooltipTrigger>
             <TooltipContent side="bottom">
                {isKeySet ? 'Manage your Gemini API key' : 'Set your Gemini API Key to enable AI features'}
            </TooltipContent>
        </Tooltip>
      <PopoverContent className="w-80" side="bottom" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Gemini API Key</h4>
            <p className="text-sm text-muted-foreground">
              Enter your API key to enable AI features. Your key is stored only in your browser.
            </p>
          </div>
          <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your Gemini API key"
                />
                 <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
          </div>
           {isKeySet && apiKey && (
             <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground truncate">Current key: ••••••••{apiKey.slice(-4)}</p>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          )}
          <Button onClick={handleSave} disabled={!inputValue}>
            {isKeySet ? 'Update Key' : 'Save Key'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

    