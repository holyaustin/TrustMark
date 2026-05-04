import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Copy, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

interface QRDisplayProps {
  qrUrl: string;
  shortLink: string;
  businessName: string;
  verificationDate: string;
}

export default function QRDisplay({ qrUrl, shortLink, businessName, verificationDate }: QRDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `trustmark-${businessName}.png`;
    link.click();
  };

  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-semibold mb-2">Your TrustMark Badge</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Share this QR code or link with buyers to prove you're verified
      </p>
      
      <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
        <Image src={qrUrl} alt="TrustMark QR Code" width={200} height={200} className="mx-auto" />
      </div>
      
      <div className="flex flex-col items-center gap-2 mb-4">
        <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg break-all">
          {shortLink}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={copyLink}>
            <Copy size={16} className="mr-1" /> {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button size="sm" variant="outline" onClick={downloadQR}>
            <Download size={16} className="mr-1" /> Download QR
          </Button>
          <Button size="sm" variant="outline">
            <Share2 size={16} className="mr-1" /> Share
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 border-t pt-4 mt-2">
        <p>Verified since: {new Date(verificationDate).toLocaleDateString()}</p>
        <p className="mt-1">Buyers can scan this code to confirm your identity instantly.</p>
      </div>
    </Card>
  );
}