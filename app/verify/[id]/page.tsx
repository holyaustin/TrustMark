// app/(public)/verify/[id]/page.tsx
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/Badge';
import { notFound } from 'next/navigation';
import Card from '@/components/ui/Card';
import BadgeSymbol from '@/components/ui/BadgeSymbol';
import { Shield, MapPin, Phone, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import TrustScoreMeter from '@/components/dashboard/TrustScoreMeter';

interface Props {
  params: { id: string };
}

export default async function VerifyPage({ params }: Props) {
  await connectToDatabase();
  
  const user = await User.findOne({ badgeId: params.id });
  
  if (!user) {
    notFound();
  }
  
  const isActive = user.badgeActive && !user.simSwapDetected;
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        {/* Badge Header */}
        <div className="text-center mb-6">
          <BadgeSymbol size="lg" showText={true} className="mb-4" />
          
          <h1 className="text-2xl font-bold mt-2">{user.businessName}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isActive ? 'Verified Seller' : 'Verification Inactive'}
          </p>
        </div>
        
        {/* Trust Score Display */}
        {user.trustScore > 0 && (
          <div className="mb-6">
            <TrustScoreMeter 
              score={user.trustScore} 
              grade={user.trustGrade || 'F'}
              breakdown={user.trustBreakdown}
            />
          </div>
        )}
        
        {/* Verification Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {user.kycMatchVerified ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />}
            <div>
              <p className="text-gray-500 text-xs">Identity Verified</p>
              <p className="font-medium text-sm">{user.kycMatchVerified ? 'Yes - KYC Match Confirmed' : 'Pending'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500 text-xs">Business Location</p>
              <p className="font-medium text-sm">{user.businessAddress}, {user.businessState}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Phone className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500 text-xs">Network Status</p>
              <p className="font-medium text-sm">
                {user.simSwapDetected ? '⚠️ Recent SIM change detected' : '✓ No recent SIM swap'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500 text-xs">Seller Since</p>
              <p className="font-medium text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
          <p>Verified using Nokia Network as Code APIs</p>
          <p className="mt-1">Report suspicious activity: report@trustmark.ng</p>
        </div>
      </Card>
    </div>
  );
}