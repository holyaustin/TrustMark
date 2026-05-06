// components/ui/BadgeSymbol.tsx
'use client';

interface BadgeSymbolProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function BadgeSymbol({ size = 'md', showText = true, className = '' }: BadgeSymbolProps) {
  const dimensions = {
    sm: { width: 80, height: 28, fontSize: 8, checkSize: 12 },
    md: { width: 120, height: 40, fontSize: 10, checkSize: 16 },
    lg: { width: 160, height: 52, fontSize: 12, checkSize: 20 }
  };
  
  const dim = dimensions[size];
  
  return (
    <div className={`inline-block ${className}`}>
      <svg width={dim.width} height={dim.height} viewBox={`0 0 ${dim.width} ${dim.height}`} xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width={dim.width} height={dim.height} rx="8" fill="#1E3A8A" />
        
        {/* Double checkmark symbol */}
        <g transform={`translate(${dim.width - dim.checkSize - 8}, ${(dim.height - dim.checkSize) / 2})`}>
          <path d="M2 8L6 12L14 3" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M-4 8L0 12L8 3" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
        
        {/* Text */}
        {showText && (
          <>
            <text x="10" y={dim.fontSize + 4} fill="white" fontSize={dim.fontSize} fontWeight="bold">
              TRUSTMARK
            </text>
            <text x="10" y={dim.height - 6} fill="#FFD700" fontSize={dim.fontSize - 2}>
              VERIFIED
            </text>
          </>
        )}
      </svg>
    </div>
  );
}