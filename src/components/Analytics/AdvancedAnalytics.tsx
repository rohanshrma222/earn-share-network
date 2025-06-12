
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const dailyEarnings = [
    { date: '2024-01-01', level1: 120, level2: 30, total: 150 },
    { date: '2024-01-02', level1: 250, level2: 45, total: 295 },
    { date: '2024-01-03', level1: 180, level2: 25, total: 205 },
    { date: '2024-01-04', level1: 340, level2: 60, total: 400 },
    { date: '2024-01-05', level1: 220, level2: 40, total: 260 },
    { date: '2024-01-06', level1: 280, level2: 55, total: 335 },
    { date: '2024-01-07', level1: 190, level2: 35, total: 225 },
  ];

  const referralSource = [
    { name: 'Social Media', value: 40, count: 8 },
    { name: 'Direct Link', value: 30, count: 6 },
    { name: 'Email', value: 20, count: 4 },
    { name: 'Word of Mouth', value: 10, count: 2 },
  ];

  const conversionData = [
    { month: 'Jan', referrals: 24, purchases: 18, conversion: 75 },
    { month: 'Feb', referrals: 18, purchases: 12, conversion: 67 },
    { month: 'Mar', referrals: 32, purchases: 28, conversion: 88 },
    { month: 'Apr', referrals: 28, purchases: 20, conversion: 71 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Advanced Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="referrals">Referral Sources</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Earnings Breakdown</CardTitle>
              <CardDescription>Level 1 vs Level 2 earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, '']} />
                  <Area type="monotone" dataKey="level1" stackId="1" stroke="#8884d8" fill="#8884d8" name="Level 1" />
                  <Area type="monotone" dataKey="level2" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Level 2" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Where your referrals come from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={referralSource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {referralSource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Referral count by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={referralSource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Trends</CardTitle>
              <CardDescription>Referral to purchase conversion over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="referrals" fill="#8884d8" name="Referrals" />
                  <Bar dataKey="purchases" fill="#82ca9d" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
