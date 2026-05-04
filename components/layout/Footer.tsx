import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">TrustMark</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">For Sellers</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/get-verified">Get Verified</Link></li>
              <li><Link href="/help">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">For Buyers</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/verify">Verify a Seller</Link></li>
              <li><Link href="/report">Report Fraud</Link></li>
              <li><Link href="/trust-score">Trust Score Explained</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 TrustMark. Protecting social commerce across Africa.
        </div>
      </div>
    </footer>
  );
}