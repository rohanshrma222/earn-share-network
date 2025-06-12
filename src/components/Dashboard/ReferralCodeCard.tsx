
import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ReferralCodeCard = () => {
  const [referralCode, setReferralCode] = useState('REF123ABC');
  const { toast } = useToast();

  const generateNewCode = () => {
    const newCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(newCode);
    toast({
      title: "New referral code generated",
      description: "Your referral code has been updated successfully.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied to clipboard",
      description: "Your referral code has been copied to clipboard.",
    });
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Referral Code</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={generateNewCode}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Generate New
        </Button>
      </div>
      
      <div className="bg-muted p-4 rounded-md mb-4">
        <div className="text-2xl font-mono font-bold text-center tracking-wider">
          {referralCode}
        </div>
      </div>
      
      <Button
        onClick={copyToClipboard}
        className="w-full gap-2"
      >
        <Copy className="h-4 w-4" />
        Copy Code
      </Button>
      
      <p className="text-sm text-muted-foreground mt-3 text-center">
        Share this code with others to start earning referral bonuses
      </p>
    </div>
  );
};
