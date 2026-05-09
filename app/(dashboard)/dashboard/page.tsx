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

interface ProfileData {
  id: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessCountry: string;
  numberVerified: boolean;
  locationVerified: boolean;
  kycMatchVerified: boolean;
  simSwapDetected: boolean;
  badgeActive: boolean;
  verificationDate: string | null;
  trustScore: number;
  trustGrade: string;
  trustBreakdown: {
    kycMatch: number;
    simSwap: number;
    numberVerification: number;
    tenure: number;
    location: number;
    kycDataCompleteness: number;
  };
  userFullName: string | null;
  userDateOfBirth: string | null;
  tenureValid: boolean;
  tenureYears: number;
  badgeId: string;
  qrCodeUrl: string | null;
  shortLink: string | null;
  locationData: any;
  kycData: any;
  createdAt?: string;
}

interface TrustScoreData {
  totalScore: number;
  grade: string;
  breakdown: {
    kycMatch: number;
    simSwap: number;
    numberVerification: number;
    tenure: number;
    location: number;
    kycDataCompleteness: number;
  };
  recommendations: string[];
  lastCalculated: Date;
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  
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
        
        const userData = profileData.user as ProfileData;
        setProfile(userData);
        
        // Generate QR code if not exists (always ensure QR is available)
        if (!userData.qrCodeUrl && userData.id) {
          await generateQRCode(userData.id);
        }
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

  const generateQRCode = async (userId: string) => {
    if (generatingQR) return;
    setGeneratingQR(true);
    try {
      console.log('Generating QR code for user:', userId);
      const res = await fetch('/api/badge/generate', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.qrCodeUrl) {
        console.log('QR code generated successfully');
        setProfile((prev: ProfileData | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            qrCodeUrl: data.qrCodeUrl,
            shortLink: data.shortLink
          };
        });
      } else {
        console.error('QR generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setGeneratingQR(false);
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

  // Get current trust score and grade
  const currentScore = trustScore?.totalScore || profile.trustScore || 0;
  const currentGrade = trustScore?.grade || profile.trustGrade || 'F';
  
  // QR code is always shown (we generate if missing)
  const showQR = true;

  console.log('=== RENDERING DASHBOARD ===');
  console.log('Current Trust Score:', currentScore);
  console.log('Current Grade:', currentGrade);
  console.log('QR URL:', profile.qrCodeUrl);
  console.log('Short Link:', profile.shortLink);

  return (
    <div className="container-custom py-6 md:py-8">
      {/* Header with Large Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <BadgeSymbol 
            size="lg" 
            showText={true} 
            score={currentScore}
            grade={currentGrade}
          />
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
        profile.numberVerified 
          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
          : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
      }`}>
        <div className="flex items-center gap-3">
          {profile.numberVerified ? (
            <Shield className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          )}
          <div className="flex-1">
            <p className="font-semibold">
              {profile.numberVerified ? 'Your TrustMark profile is ACTIVE' : 'Complete phone verification to activate full features'}
            </p>
            <p className="text-sm">
              {profile.numberVerified 
                ? 'Your trust score is visible to buyers. Complete additional verifications to increase your score.' 
                : 'Verify your phone number to start building your trust score and display your badge.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {!profile.numberVerified && (
          <Button 
            variant="primary" 
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Verify Phone Number
          </Button>
        )}
        {!profile.locationVerified && profile.numberVerified && (
          <Button 
            variant="primary" 
            onClick={() => setShowLocationModal(true)}
            className="flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Verify Location (+15 pts)
          </Button>
        )}
        {!profile.kycMatchVerified && profile.numberVerified && (
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
          score={currentScore} 
          grade={currentGrade}
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

      {/* QR Code Section - ALWAYS SHOW */}
      <div className="mb-6">
        {generatingQR ? (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-royal-600 mb-3" />
              <p className="text-gray-500">Generating your unique badge link...</p>
            </div>
          </Card>
        ) : profile.qrCodeUrl ? (
          <QRDisplay 
            qrUrl={profile.qrCodeUrl} 
            shortLink={profile.shortLink || ''} 
            businessName={profile.businessName}
            verificationDate={profile.verificationDate || ''}
            trustScore={currentScore}
            trustGrade={currentGrade}
          />
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-3">Your badge link is being prepared...</p>
            <Button size="sm" onClick={() => generateQRCode(profile.id)} disabled={generatingQR}>
              <RefreshCw className={`w-4 h-4 mr-2 ${generatingQR ? 'animate-spin' : ''}`} />
              Generate Badge Link
            </Button>
          </Card>
        )}
      </div>

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
            <p className="text-sm text-gray-500">Trust Score</p>
            <p className="font-medium">{currentScore}% ({currentGrade})</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Tenure</p>
            <p className="font-medium">{profile.tenureYears ? `${profile.tenureYears} years` : 'Not verified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">
              {profile.verificationDate ? new Date(profile.verificationDate).toLocaleDateString() : 'Not yet'}
            </p>
          </div>
        </div>
      </Card>

      {/* Location Verification Modal */}
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