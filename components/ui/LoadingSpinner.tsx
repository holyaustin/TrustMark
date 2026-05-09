// components/ui/LoadingSpinner.tsx
'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 text-center max-w-sm mx-4">
        <div className="w-16 h-16 border-4 border-royal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Verifying your number...
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please wait while we confirm your identity
        </p>
      </div>
    </div>
  );
}