// components/dashboard/QRDisplay.tsx
'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BadgeSymbol from '@/components/ui/BadgeSymbol';
import { Copy, Download, Share2, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface QRDisplayProps {
  qrUrl: string;
  shortLink: string;
  businessName: string;
  verificationDate: string;
  trustScore?: number;
  trustGrade?: string;
}

export default function QRDisplay({ 
  qrUrl, 
  shortLink, 
  businessName, 
  verificationDate,
  trustScore,
  trustGrade 
}: QRDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `trustmark-${businessName.replace(/\s/g, '-')}.png`;
    link.click();
  };

  const shareOnWhatsApp = () => {
    const message = `Check my TrustMark verified badge: ${shortLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      return 'Just now';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log('QRDisplay rendering with:', { qrUrl, shortLink, businessName, trustScore, trustGrade });

  return (
    <Card className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <BadgeSymbol size="lg" showText={true} score={trustScore || 85} grade={trustGrade || 'AA'} />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Your TrustMark Badge</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Share this QR code or link with buyers to prove you're verified
      </p>
      
      {/* QR Code Image */}
      <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-5 shadow-md border border-gray-200 dark:border-gray-700">
        {qrUrl ? (
          <Image 
            src={qrUrl} 
            alt="TrustMark QR Code" 
            width={200} 
            height={200} 
            className="mx-auto"
            unoptimized
          />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">Loading QR...</p>
          </div>
        )}
      </div>
      
      {/* Share Link Section */}
      <div className="flex flex-col items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg w-full max-w-md">
          
          <p className="text-sm font-mono break-all flex-1">
            {shortLink}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" onClick={copyLink}>
            <Copy size={16} className="mr-1" /> {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button size="sm" variant="outline" onClick={downloadQR}>
            <Download size={16} className="mr-1" /> Download QR
          </Button>
          <Button size="sm" variant="outline" onClick={shareOnWhatsApp}>
            <Share2 size={16} className="mr-1" /> Share
          </Button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="text-xs text-gray-500 border-t pt-4 mt-2">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Verified since: {formatDate(verificationDate)}</span>
          </div>
          {trustScore && (
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Trust Score: {trustScore}%</span>
            </div>
          )}
        </div>
        <p className="mt-2">Buyers can scan this code or click the link to verify your identity instantly.</p>
      </div>
    </Card>
  );
}