
import React from 'react';
import { Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useReferralCode } from '@/hooks/useReferralCode';

export const ReferralCodeCard = () => {
  const { referralCode } = useReferralCode();
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied to clipboard",
      description: "Your referral code has been copied to clipboard.",
    });
  };

  const shareReferralLink = () => {
    const referralUrl = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    toast({
      title: "Referral link copied",
      description: "Share this link with friends to earn referral bonuses.",
    });
  };

  if (!referralCode) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mx-auto mb-2"></div>
            <div className="h-8 bg-muted rounded w-32 mx-auto mb-4"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Your Referral Code</h3>
        <p className="text-sm text-muted-foreground">Share this code to earn 5% on Level 1 and 1% on Level 2</p>
      </div>
      
      <div className="bg-muted p-4 rounded-md mb-4">
        <div className="text-2xl font-mono font-bold text-center tracking-wider">
          {referralCode}
        </div>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={copyToClipboard}
          className="w-full gap-2"
          variant="outline"
        >
          <Copy className="h-4 w-4" />
          Copy Code
        </Button>
        
        <Button
          onClick={shareReferralLink}
          className="w-full gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share Referral Link
        </Button>
      </div>
    </div>
  );
};
