// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustScoreMeter from '@/components/dashboard/TrustScoreMeter';
import KYCCompletionWidget from '@/components/dashboard/KYCCompletionWidget';
import TrustBreakdown from '@/components/dashboard/TrustBreakdown';
import SimSwapAlert from '@/components/verification/SimSwapAlert';
import QRDisplay from '@/components/dashboard/QRDisplay';
import BadgeSymbol from '@/components/ui/BadgeSymbol';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [trustScore, setTrustScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, scoreRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/trust-score')
      ]);
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.user);
      }
      if (scoreRes.ok) {
        const scoreData = await scoreRes.json();
        setTrustScore(scoreData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTrustScore = async () => {
    setRefreshing(true);
    const res = await fetch('/api/trust-score?refresh=true');
    if (res.ok) {
      const data = await res.json();
      setTrustScore(data);
      await fetchData();
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="container-custom py-8 text-center">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-custom py-8 text-center">
        <p>Unable to load profile. Please refresh the page.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Refresh</Button>
      </div>
    );
  }

  const isVerified = profile.badgeActive && !profile.simSwapDetected;

  return (
    <div className="container-custom py-6 md:py-8">
      {/* Header with Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <BadgeSymbol size="md" showText={true} />
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage your TrustMark verified seller identity
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshTrustScore}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Trust Score
        </Button>
      </div>

      {/* SIM Swap Alert */}
      {profile.simSwapDetected && (
        <SimSwapAlert onResolve={() => fetchData()} />
      )}

      {/* Verification Status Banner */}
      <div className={`p-4 rounded-lg mb-6 ${
        isVerified 
          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
          : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
      }`}>
        <div className="flex items-center gap-3">
          {isVerified ? (
            <Shield className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          )}
          <div className="flex-1">
            <p className="font-semibold">
              {isVerified ? 'Your TrustMark badge is ACTIVE' : 'Your TrustMark badge is PENDING'}
            </p>
            <p className="text-sm">
              {isVerified 
                ? 'Buyers can verify your identity. Share your QR code with confidence.' 
                : profile.simSwapDetected 
                  ? '⚠️ SIM swap detected. Please contact support to re-verify your identity.'
                  : !profile.kycMatchVerified
                    ? 'Complete KYC verification to activate your badge and increase trust score.'
                    : !profile.locationVerified
                      ? 'Verify your business location to activate your badge.'
                      : 'Complete all verification steps to activate your badge.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Trust Score Meter */}
        <TrustScoreMeter 
          score={trustScore?.totalScore || profile.trustScore || 0} 
          grade={trustScore?.grade || profile.trustGrade || 'F'}
          breakdown={trustScore?.breakdown || profile.trustBreakdown}
        />
        
        {/* KYC Completion Widget */}
        <KYCCompletionWidget 
          profile={profile}
          onUpdate={fetchData}
        />
      </div>

      {/* Trust Breakdown Details */}
      <div className="mb-6">
        <TrustBreakdown 
          breakdown={trustScore?.breakdown || profile.trustBreakdown}
          recommendations={trustScore?.recommendations || []}
        />
      </div>

      {/* QR Code Section (Only if verified) */}
      {isVerified && profile.qrCodeUrl && (
        <QRDisplay 
          qrUrl={profile.qrCodeUrl} 
          shortLink={profile.shortLink} 
          businessName={profile.businessName}
          verificationDate={profile.verificationDate}
        />
      )}

      {/* Business Info Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Business Name</p>
            <p className="font-medium">{profile.businessName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{profile.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Address</p>
            <p className="font-medium">{profile.businessAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business State</p>
            <p className="font-medium">{profile.businessState}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">KYC Name (Matched)</p>
            <p className="font-medium">{profile.userFullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Date</p>
            <p className="font-medium">
              {profile.verificationDate ? new Date(profile.verificationDate).toLocaleDateString() : 'Not yet'}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full md:w-auto">
          Update Business Details
        </Button>
      </Card>
    </div>
  );
}