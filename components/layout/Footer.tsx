import Link from 'next/link';

export default function Footer() {
  const currentYear = 2026;

  const footerLinks = {
    platform: [
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/for-sellers', label: 'For Sellers' },
      { href: '/for-buyers', label: 'For Buyers' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/faq', label: 'FAQ' },
    ],
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/careers', label: 'Careers' },
      { href: '/press', label: 'Press' },
      { href: '/blog', label: 'Blog' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
      { href: '/gdpr', label: 'GDPR' },
      { href: '/accessibility', label: 'Accessibility' },
    ],
    support: [
      { href: '/help', label: 'Help Center' },
      { href: '/report', label: 'Report Fraud' },
      { href: '/safety-tips', label: 'Safety Tips' },
      { href: '/trust-score', label: 'Trust Score' },
      { href: '/api-docs', label: 'API Docs' },
    ],
  };

  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-royal-400">🛡️</span>
              <span className="text-xl font-bold text-white">TrustMark</span>
            </div>
            <p className="text-sm text-gray-400">
              Building trust in social commerce across Africa through network-verified seller identities.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-royal-400 transition text-xl">📘</a>
              <a href="#" className="text-gray-400 hover:text-royal-400 transition text-xl">🐦</a>
              <a href="#" className="text-gray-400 hover:text-royal-400 transition text-xl">📸</a>
              <a href="#" className="text-gray-400 hover:text-royal-400 transition text-xl">🔗</a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-royal-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-royal-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-royal-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-royal-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-3">
              <span>✉️</span>
              <span>support@trustmark.africa</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>📞</span>
              <span>+234 (0) 123 456 7890</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>📍</span>
              <span>Lagos, Nigeria | Nairobi, Kenya | Accra, Ghana</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} TrustMark. All rights reserved. Protecting social commerce across Africa.</p>
          <div className="flex space-x-6">
            <Link href="/sitemap" className="hover:text-royal-400 transition">Sitemap</Link>
            <Link href="/privacy" className="hover:text-royal-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-royal-400 transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}