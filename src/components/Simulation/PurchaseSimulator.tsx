
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingCart, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const PurchaseSimulator = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('1000');
  const [productName, setProductName] = useState('Test Product');
  const [processing, setProcessing] = useState(false);

  const simulatePurchase = async () => {
    if (!user) {
      toast.error('Please sign in to simulate a purchase');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('https://qztrpzbtoivuqrnhfnaw.supabase.co/functions/v1/process-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(amount),
          productName
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(`Purchase processed! ₹${amount} purchase completed`);
      } else {
        toast.error(result.error || 'Failed to process purchase');
      }
    } catch (error) {
      console.error('Error simulating purchase:', error);
      toast.error('Failed to simulate purchase');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Purchase Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Product Name</label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Amount (₹)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="pl-10"
            />
          </div>
        </div>

        <Button 
          onClick={simulatePurchase}
          disabled={processing || !user}
          className="w-full"
        >
          {processing ? 'Processing...' : 'Simulate Purchase'}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will trigger referral earnings for your referrers (5% Level 1, 1% Level 2)
        </p>
      </CardContent>
    </Card>
  );
};
