import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: January 2026</p>
        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-400">
          <p>At TrustMark, we take your privacy seriously. We collect only the information necessary to verify your identity and protect your account.</p>
          <p>We do not sell your personal information to third parties. Your data is stored securely and used only for verification purposes.</p>
          <p>For full details, please contact our privacy team at privacy@trustmark.africa.</p>
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}