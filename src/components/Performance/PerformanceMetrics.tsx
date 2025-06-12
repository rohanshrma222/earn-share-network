
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Award, Users, DollarSign } from 'lucide-react';

export const PerformanceMetrics = () => {
  const performanceData = {
    monthlyTarget: 5000,
    currentEarnings: 3750,
    referralGoal: 10,
    currentReferrals: 8,
    conversionRate: 75,
    averageEarningPerReferral: 468,
    growthRate: 23,
    activeReferrals: 18,
    totalReferrals: 24
  };

  const achievements = [
    { name: 'First Referral', unlocked: true, icon: '🎉' },
    { name: '5 Referrals', unlocked: true, icon: '🏆' },
    { name: '₹1000 Earned', unlocked: true, icon: '💰' },
    { name: '10 Referrals', unlocked: false, icon: '🎯' },
    { name: '₹5000 Earned', unlocked: false, icon: '💎' },
    { name: 'Top Performer', unlocked: false, icon: '👑' }
  ];

  const targetProgress = (performanceData.currentEarnings / performanceData.monthlyTarget) * 100;
  const referralProgress = (performanceData.currentReferrals / performanceData.referralGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{performanceData.currentEarnings.toLocaleString()}</div>
            <div className="space-y-2">
              <Progress value={targetProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground">
                {targetProgress.toFixed(1)}% of ₹{performanceData.monthlyTarget.toLocaleString()} target
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Goal</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.currentReferrals}</div>
            <div className="space-y-2">
              <Progress value={referralProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground">
                {referralProgress.toFixed(1)}% of {performanceData.referralGoal} referral goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {performanceData.activeReferrals} of {performanceData.totalReferrals} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Referral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{performanceData.averageEarningPerReferral}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{performanceData.growthRate}% growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Strengths</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>High conversion rate (75%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>Above average earnings per referral</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>Strong referral network growth</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Opportunities</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span>2 more referrals to reach monthly goal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>₹1,250 needed for monthly target</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>Focus on Level 2 referral activation</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your referral milestones and badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <p className={`font-medium ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                    {achievement.name}
                  </p>
                  <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
