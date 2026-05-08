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
import { Shield, AlertTriangle, RefreshCw, MapPin, UserCheck } from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [trustScore, setTrustScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('=== FETCHING DASHBOARD DATA ===');
      
      const [profileRes, scoreRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/trust-score')
      ]);
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        console.log('Raw profile API response:', JSON.stringify(profileData, null, 2));
        
        // Ensure we have all the fields
        const userData = profileData.user;
        console.log('Business fields from API:', {
          businessAddress: userData.businessAddress,
          businessCity: userData.businessCity,
          businessCountry: userData.businessCountry
        });
        
        setProfile(userData);
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
  
  // Log what we're about to pass to the modal
  console.log('=== RENDERING DASHBOARD ===');
  console.log('profile.id:', profile.id);
  console.log('profile.businessAddress:', profile.businessAddress);
  console.log('profile.businessCity:', profile.businessCity);
  console.log('profile.businessCountry:', profile.businessCountry);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {!profile.locationVerified && (
          <Button 
            variant="primary" 
            onClick={() => {
              console.log('Opening location modal with:', {
                address: profile.businessAddress,
                city: profile.businessCity,
                country: profile.businessCountry
              });
              setShowLocationModal(true);
            }}
            className="flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Verify Location (+15 pts)
          </Button>
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
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrustScoreMeter 
          score={trustScore?.totalScore || profile.trustScore || 0} 
          grade={trustScore?.grade || profile.trustGrade || 'F'}
          breakdown={trustScore?.breakdown || profile.trustBreakdown}
        />
        
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
            <p className="font-medium">{profile.businessAddress || 'Not set'}</p>
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
            <p className="text-sm text-gray-500">KYC Name</p>
            <p className="font-medium">{profile.userFullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Tenure</p>
            <p className="font-medium">{profile.tenureYears ? `${profile.tenureYears} years` : 'Not verified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Date</p>
            <p className="font-medium">
              {profile.verificationDate ? new Date(profile.verificationDate).toLocaleDateString() : 'Not yet'}
            </p>
          </div>
        </div>
      </Card>

      {/* Location Verification Modal - Pass props directly from profile */}
      {showLocationModal && profile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLocationModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <LocationVerificationForm 
              userId={profile.id} 
              businessAddress={profile.businessAddress || ''}
              businessCity={profile.businessCity || ''}
              businessCountry={profile.businessCountry || ''}
              onSuccess={handleLocationSuccess}
              onClose={() => setShowLocationModal(false)}
            />
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && profile && (
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
    </div>
  );
}