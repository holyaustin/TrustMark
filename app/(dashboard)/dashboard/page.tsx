'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import QRDisplay from '@/components/dashboard/QRDisplay';
import StatsCard from '@/components/dashboard/StatsCard';
import { Shield, QrCode, AlertTriangle, TrendingUp, Copy, Share2, Download, CheckCircle, XCircle, Clock, MapPin, Phone, Award, Users, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-royal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isVerified = profile.badgeActive && !profile.simSwapDetected;
  const daysVerified = profile.verificationDate 
    ? Math.floor((new Date().getTime() - new Date(profile.verificationDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-custom">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {profile.businessName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your TrustMark verified seller identity and track your trust score.
          </p>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 md:p-6 rounded-xl mb-8 ${
          isVerified 
            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              {isVerified ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              )}
              <div>
                <p className="font-bold text-lg">
                  {isVerified ? '✓ TrustMark Badge ACTIVE' : '⚠️ TrustMark Badge PENDING or SUSPENDED'}
                </p>
                <p className="text-sm">
                  {isVerified 
                    ? 'Buyers can verify your identity instantly. Share your QR code with confidence.' 
                    : profile.simSwapDetected 
                      ? 'SIM swap detected on your account. Please contact support immediately to re-verify.'
                      : 'Complete location verification to activate your TrustMark badge.'}
                </p>
              </div>
            </div>
            {!isVerified && !profile.simSwapDetected && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push('/get-verified')}
                className="ml-auto"
              >
                Complete Verification →
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid - Full Width Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard 
            title="Trust Score" 
            value={`${profile.trustScore || 70}%`} 
            icon={<Award size={24} className="text-royal-600" />}
            trend={profile.trustScore > 70 ? '+5%' : profile.trustScore < 70 ? '-3%' : '0%'}
          />
          <StatsCard 
            title="Verification Status" 
            value={isVerified ? 'Verified' : 'Pending'} 
            icon={isVerified ? <CheckCircle size={24} className="text-green-600" /> : <Clock size={24} className="text-yellow-600" />}
          />
          <StatsCard 
            title="Badge Views" 
            value={profile.badgeViews || 0} 
            icon={<Eye size={24} className="text-royal-600" />}
          />
          <StatsCard 
            title="Days Verified" 
            value={daysVerified} 
            icon={<Calendar size={24} className="text-royal-600" />}
            suffix="days"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - QR Code & Badge */}
          <div className="lg:col-span-2">
            {isVerified && profile.qrCodeUrl ? (
              <Card className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your TrustMark Badge
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Share this QR code or link with buyers to prove you're verified
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <img 
                      src={profile.qrCodeUrl} 
                      alt="TrustMark QR Code" 
                      className="w-48 h-48 md:w-56 md:h-56"
                    />
                  </div>
                  
                  {/* Badge Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="bg-royal-50 dark:bg-royal-900/30 p-4 rounded-xl mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Unique Badge ID</p>
                      <p className="font-mono text-lg font-bold text-royal-600 dark:text-royal-400">
                        {profile.badgeId}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Shareable Link</p>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={profile.shortLink} 
                            readOnly 
                            className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono"
                          />
                          <Button size="sm" onClick={() => copyLink(profile.shortLink)}>
                            <Copy size={16} className="mr-1" /> {copied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download size={16} className="mr-1" /> Download QR
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 size={16} className="mr-1" /> Share Badge
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    📱 Share your TrustMark badge on WhatsApp, Instagram, or Facebook Marketplace.<br />
                    Buyers scan to instantly verify your identity.
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Badge</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Complete your verification to get your TrustMark badge.
                </p>
                <Button onClick={() => router.push('/get-verified')}>
                  Start Verification →
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column - Business Info & Tips */}
          <div className="space-y-6">
            {/* Business Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-royal-600" />
                Business Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone size={14} /> Phone Number
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.phoneNumber}</p>
                  {profile.verifiedNumber && (
                    <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle size={12} /> Verified
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> Business Address
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">{profile.businessAddress}</p>
                  {profile.verifiedLocation && (
                    <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle size={12} /> Location Verified
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {profile.verificationDate ? new Date(profile.verificationDate).toLocaleDateString() : 'Not yet verified'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-6">
                Update Business Details
              </Button>
            </Card>

            {/* Trust Tips */}
            <Card className="p-6 bg-gradient-to-r from-royal-50 to-blue-50 dark:from-royal-950 dark:to-blue-950">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award size={20} className="text-royal-600" />
                Trust Tips
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Share your TrustMark badge on all your social profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respond to buyer verification requests promptly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep your business information up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Report any suspicious activity immediately</span>
                </li>
              </ul>
            </Card>

            {/* SIM Swap Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={20} className="text-royal-600" />
                Security Status
              </h3>
              <div className={`p-3 rounded-lg ${profile.simSwapDetected ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                <div className="flex items-center gap-2">
                  {profile.simSwapDetected ? (
                    <XCircle size={20} className="text-red-600" />
                  ) : (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                  <span className="font-medium">
                    {profile.simSwapDetected ? 'SIM Swap Detected' : 'No SIM Swap Detected'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {profile.simSwapDetected 
                    ? 'We detected a recent SIM swap on your number. Your badge has been suspended for security.'
                    : 'Your SIM card status is secure. We monitor 24/7 for any suspicious changes.'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Last checked: {profile.lastSimSwapCheck ? new Date(profile.lastSimSwapCheck).toLocaleString() : 'Not yet'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calendar icon component since it wasn't imported
function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}