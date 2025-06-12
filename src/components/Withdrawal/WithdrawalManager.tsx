
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: string;
  processedDate?: string;
}

export const WithdrawalManager = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: 'W001',
      amount: 1200,
      method: 'Bank Transfer',
      status: 'completed',
      requestDate: '2024-01-15',
      processedDate: '2024-01-18'
    },
    {
      id: 'W002',
      amount: 800,
      method: 'UPI',
      status: 'pending',
      requestDate: '2024-01-20'
    },
    {
      id: 'W003',
      amount: 500,
      method: 'PayPal',
      status: 'approved',
      requestDate: '2024-01-22'
    }
  ]);

  const availableBalance = 2450;
  const minimumWithdrawal = 500;

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (amount < minimumWithdrawal) {
      toast.error(`Minimum withdrawal amount is ₹${minimumWithdrawal}`);
      return;
    }
    
    if (amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }
    
    if (!withdrawalMethod) {
      toast.error('Please select a withdrawal method');
      return;
    }

    const newWithdrawal: Withdrawal = {
      id: `W${String(withdrawals.length + 1).padStart(3, '0')}`,
      amount,
      method: withdrawalMethod,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);
    setWithdrawalAmount('');
    setWithdrawalMethod('');
    toast.success('Withdrawal request submitted successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{availableBalance.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>Minimum withdrawal amount: ₹{minimumWithdrawal}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min={minimumWithdrawal}
                max={availableBalance}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Withdrawal Method</Label>
              <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleWithdrawal} className="w-full">
            Request Withdrawal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Track your withdrawal requests and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(withdrawal.status)}
                    <Badge className={getStatusColor(withdrawal.status)}>
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">₹{withdrawal.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{withdrawal.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">ID: {withdrawal.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Requested: {withdrawal.requestDate}
                  </p>
                  {withdrawal.processedDate && (
                    <p className="text-sm text-muted-foreground">
                      Processed: {withdrawal.processedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
