import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import { notFound } from 'next/navigation';
import { Shield, MapPin, Phone, Clock, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';

interface Props {
  params: { id: string };
}

export default async function VerifyPage({ params }: Props) {
  await connectToDatabase();
  
  const badge = await Badge.findOne({ badgeId: params.id }).populate('userId');
  
  if (!badge || !badge.userId) {
    notFound();
  }
  
  const user = badge.userId as any;
  const isVerified = badge.isActive && !user.simSwapDetected;
  
  // Increment view count
  await Badge.updateOne({ badgeId: params.id }, { $inc: { views: 1 } });
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isVerified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {isVerified ? (
              <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{user.businessName}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isVerified ? 'TrustMark Verified Seller' : 'Verification Inactive'}
          </p>
        </div>
        
        {/* Verification Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Phone className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500">Phone Status</p>
              <p className="font-medium">{user.verifiedNumber ? '✓ Verified' : 'Not Verified'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500">Location Status</p>
              <p className="font-medium">{user.verifiedLocation ? '✓ Verified' : 'Not Verified'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500">SIM Swap Status (Last 24h)</p>
              <p className="font-medium text-green-600">
                {user.simSwapDetected ? '⚠️ Recent swap detected' : '✓ No recent swap'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="w-5 h-5 text-royal-600" />
            <div>
              <p className="text-gray-500">Verified Since</p>
              <p className="font-medium">
                {user.verificationDate ? new Date(user.verificationDate).toLocaleDateString() : 'Not yet'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Message */}
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
          <p>This verification is powered by TrustMark using mobile network APIs.</p>
          <p className="mt-1">Report suspicious activity: report@trustmark.ng</p>
        </div>
      </Card>
    </div>
  );
}