import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About TrustMark</h1>
        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-400">
          <p>TrustMark is on a mission to build trust in social commerce across Africa. With over 80% of SMEs using social media to sell products, buyers are often afraid of being scammed because anyone can pretend to be a legitimate seller.</p>
          <p>We solve this by using mobile network APIs (CAMARA) to verify that a seller's phone number and business location are real. Once verified, sellers get a TrustMark verified badge that they can share in their bio, on WhatsApp status, or on product posts.</p>
          <p>Buyers can click or scan the badge to instantly confirm the seller is legitimate.</p>
          <p>Founded in 2026, TrustMark is headquartered in Lagos, Nigeria, with operations across Kenya, Ghana, and South Africa.</p>
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