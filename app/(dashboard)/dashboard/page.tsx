// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrustScoreMeter from '@/components/dashboard/TrustScoreMeter';
import KYCCompletionWidget from '@/components/dashboard/KYCCompletionWidget';
import TrustBreakdown from '@/components/dashboard/TrustBreakdown';
import SimSwapAlert from '@/components/verification/SimSwapAlert';
import QRDisplay from '@/components/dashboard/QRDisplay';
import BadgeSymbol from '@/components/ui/BadgeSymbol';
import LocationVerificationForm from '@/components/verification/LocationVerificationForm';
import KycFillInForm from '@/components/verification/KycFillInForm';
import AgeVerificationForm from '@/components/verification/AgeVerificationForm';
import { Shield, AlertTriangle, RefreshCw, MapPin, UserCheck, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [trustScore, setTrustScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states for verification steps
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

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
        console.log('Profile loaded:', {
          id: profileData.user.id,
          businessName: profileData.user.businessName,
          businessCity: profileData.user.businessCity,
          businessCountry: profileData.user.businessCountry,
          locationVerified: profileData.user.locationVerified,
          kycMatchVerified: profileData.user.kycMatchVerified
        });
        setProfile(profileData.user);
      } else {
        console.error('Profile fetch failed:', profileRes.status);
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
    try {
      const res = await fetch('/api/trust-score?refresh=true');
      if (res.ok) {
        const data = await res.json();
        setTrustScore(data);
        await fetchData();
      }
    } catch (error) {
      console.error('Error refreshing trust score:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLocationSuccess = async () => {
    setShowLocationModal(false);
    await fetchData();
  };

  const handleKycSuccess = async () => {
    setShowKycModal(false);
    await fetchData();
  };

  const handleAgeSuccess = async () => {
    setShowAgeModal(false);
    await fetchData();
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

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {!profile.locationVerified && profile.businessAddress && (
          <Button 
            variant="primary" 
            onClick={() => setShowLocationModal(true)}
            className="flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Verify Location (+15 pts)
          </Button>
        )}
        {!profile.locationVerified && !profile.businessAddress && (
          <div className="text-sm text-red-500 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            ⚠️ Business address missing. Please update your profile.
          </div>
        )}
        {!profile.kycMatchVerified && (
          <Button 
            variant="primary" 
            onClick={() => setShowKycModal(true)}
            className="flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Complete KYC (+20 pts)
          </Button>
        )}
        {!profile.userDateOfBirth && (
          <Button 
            variant="outline" 
            onClick={() => setShowAgeModal(true)}
            className="flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Add Date of Birth (+15 pts)
          </Button>
        )}
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
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{profile.businessCity || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-medium">{profile.businessCountry || 'Not set'}</p>
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
          {profile.locationData?.verifiedAt && (
            <div>
              <p className="text-sm text-gray-500">Last Location Verified</p>
              <p className="font-medium">
                {new Date(profile.locationData.verifiedAt).toLocaleDateString()}
                {profile.locationData.matchRate && ` (${profile.locationData.matchRate}% match)`}
              </p>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full md:w-auto"
          onClick={async () => {
            // Simple update modal - can be expanded
            const newAddress = prompt('Update business address:', profile.businessAddress);
            if (newAddress && newAddress !== profile.businessAddress) {
              await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessAddress: newAddress })
              });
              await fetchData();
            }
          }}
        >
          Update Business Details
        </Button>
      </Card>

      {/* Location Verification Modal */}
      {showLocationModal && profile.id && profile.businessAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLocationModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <LocationVerificationForm 
              userId={profile.id} 
              businessAddress={profile.businessAddress}
              businessCity={profile.businessCity || ''}
              businessCountry={profile.businessCountry || ''}
              onSuccess={handleLocationSuccess}
              onClose={() => setShowLocationModal(false)}
            />
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && profile.id && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowKycModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <KycFillInForm 
              userId={profile.id}
              kycData={{
                fullName: profile.kycData?.fullName || '',
                address: profile.businessAddress || '',
                birthdate: profile.kycData?.birthdate || ''
              }}
              onSuccess={handleKycSuccess}
              onClose={() => setShowKycModal(false)}
            />
          </div>
        </div>
      )}

      {/* Age Verification Modal */}
      {showAgeModal && profile.id && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAgeModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <AgeVerificationForm 
              userId={profile.id}
              onSuccess={handleAgeSuccess}
              onClose={() => setShowAgeModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}