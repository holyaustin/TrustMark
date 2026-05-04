import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-royal-600 dark:text-royal-400" />
              <span className="text-xl font-bold text-royal-800 dark:text-royal-400">TrustMark</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verified seller identity for social commerce across Africa.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} TrustMark. All rights reserved.
            </p>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">For Sellers</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/dashboard" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Dashboard</Link></li>
              <li><Link href="/get-verified" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Get Verified</Link></li>
              <li><Link href="/pricing" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Pricing</Link></li>
              <li><Link href="/help" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Help Center</Link></li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">For Buyers</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/verify" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Verify a Seller</Link></li>
              <li><Link href="/report" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Report Fraud</Link></li>
              <li><Link href="/trust-score" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Trust Score Explained</Link></li>
              <li><Link href="/safety-tips" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Safety Tips</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-royal-600 dark:hover:text-royal-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-royal-600 dark:hover:text-royal-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <p>TrustMark is a verified seller identity solution powered by Nokia Network-as-Code APIs.</p>
          <div className="flex space-x-4">
            <Link href="/accessibility" className="hover:text-royal-600">Accessibility</Link>
            <Link href="/cookies" className="hover:text-royal-600">Cookie Policy</Link>
            <Link href="/sitemap" className="hover:text-royal-600">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}