'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import QRDisplay from '@/components/dashboard/QRDisplay';
import StatsCard from '@/components/dashboard/StatsCard';
import { Shield, QrCode, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch('/api/user/profile');
    if (res.ok) {
      const data = await res.json();
      setProfile(data.user);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container-custom py-8 text-center">Loading dashboard...</div>;
  }

  if (!profile) {
    return (
      <div className="container-custom py-8 text-center">
        <p>Unable to load profile. Please refresh.</p>
      </div>
    );
  }

  const isVerified = profile.badgeActive && !profile.simSwapDetected;

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-2">Seller Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your TrustMark verified seller identity</p>

      {/* Verification Status Banner */}
      <div className={`p-4 rounded-lg mb-6 ${isVerified ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'}`}>
        <div className="flex items-center gap-3">
          {isVerified ? <Shield className="text-green-600" /> : <AlertTriangle className="text-yellow-600" />}
          <div>
            <p className="font-semibold">
              {isVerified ? 'Your TrustMark badge is ACTIVE' : 'Your TrustMark badge is PENDING or SUSPENDED'}
            </p>
            <p className="text-sm">
              {isVerified 
                ? 'Buyers can verify your identity. Share your QR code with confidence.' 
                : profile.simSwapDetected 
                  ? 'SIM swap detected. Please contact support to re-verify.' 
                  : 'Complete location verification to activate your badge.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Trust Score" value={`${profile.trustScore || 70}%`} icon={<TrendingUp size={20} />} />
        <StatsCard title="Verification Status" value={isVerified ? 'Verified' : 'Pending'} icon={<Shield size={20} />} />
        <StatsCard title="Badge Views" value={profile.badgeViews || 0} icon={<QrCode size={20} />} />
      </div>

      {/* QR Code Section */}
      {isVerified && profile.qrCodeUrl && (
        <QRDisplay 
          qrUrl={profile.qrCodeUrl} 
          shortLink={profile.shortLink} 
          businessName={profile.businessName}
          verificationDate={profile.verificationDate}
        />
      )}

      {/* Business Info Card */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Business Information</h3>
        <div className="space-y-3">
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
            <p className="text-sm text-gray-500">Verification Date</p>
            <p className="font-medium">{profile.verificationDate ? new Date(profile.verificationDate).toLocaleDateString() : 'Not yet'}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          Update Business Details
        </Button>
      </Card>
    </div>
  );
}