'use client';

interface BadgeSymbolProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  score?: number;
  grade?: string;
}

export default function BadgeSymbol({ 
  size = 'md', 
  showText = true, 
  className = '',
  score,
  grade 
}: BadgeSymbolProps) {
  const dimensions = {
    // Increased height and adjusted gradeCircle for better separation
    sm: { width: 130, height: 56, fontSize: 10, checkSize: 12, gradeCircle: 12, gradeFontSize: 12, textY: 14, spacing: 6 },
    md: { width: 190, height: 72, fontSize: 14, checkSize: 16, gradeCircle: 16, gradeFontSize: 18, textY: 20, spacing: 8 },
    lg: { width: 260, height: 96, fontSize: 18, checkSize: 22, gradeCircle: 20, gradeFontSize: 24, textY: 26, spacing: 10 },
    xl: { width: 340, height: 130, fontSize: 24, checkSize: 30, gradeCircle: 30, gradeFontSize: 36, textY: 34, spacing: 14 }
  };
  
  const dim = dimensions[size];
  
  const getGradeColor = (gradeLetter: string) => {
    switch (gradeLetter.charAt(0)) {
      case 'A': return '#22C55E';
      case 'B': return '#FACC15';
      case 'C': return '#FB923C';
      default: return '#9CA3AF';
    }
  };
  
  const gradeColor = grade ? getGradeColor(grade) : '#4ADE80';
  
  // Positioning logic with explicit spacing
  const rightAligmentX = dim.width - (dim.gradeCircle * 2) - 12;
  const gradeCenterY = dim.height - (dim.gradeCircle) - 10;
  // Position checkmark above the grade circle with a defined gap
  const checkAboveGradeY = gradeCenterY - (dim.gradeCircle) - (dim.checkSize) - dim.spacing;

  return (
    <div className={`inline-block ${className}`}>
      <svg width={dim.width} height={dim.height} viewBox={`0 0 ${dim.width} ${dim.height}`} xmlns="http://w3.org">
        <defs>
          <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#002366', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#001a4d', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Main Badge Body */}
        <rect width={dim.width} height={dim.height} rx="12" fill="url(#badgeGrad)" />
        
        {/* TRUSTMARK text - top left */}
        {showText && (
          <text x="12" y={dim.textY} fill="white" fontSize={dim.fontSize} fontWeight="900" fontFamily="sans-serif">
            TRUSTMARK
          </text>
        )}
        
        {/* Score and VERIFIED text - bottom left */}
        {showText && (
          <text x="12" y={dim.height - 12} fill={gradeColor} fontSize={dim.fontSize - 2} fontWeight="bold" fontFamily="sans-serif">
            {score !== undefined ? `${score}% VERIFIED` : 'VERIFIED'}
          </text>
        )}
        
        {/* Right Side Stack */}
        <g transform={`translate(${rightAligmentX}, 0)`}>
          
          {/* Double checkmark symbol - Positioned with dim.spacing ABOVE the circle */}
          <g transform={`translate(0, ${checkAboveGradeY})`}>
             <path d="M2 6L6 11L15 2" stroke={gradeColor} strokeWidth="3" fill="none" strokeLinecap="round"/>
             <path d="M-4 6L0 11L9 2" stroke={gradeColor} strokeWidth="3" fill="none" strokeLinecap="round"/>
          </g>

          {/* Grade circle with Large Font */}
          {grade && (
            <g transform={`translate(6, ${gradeCenterY})`}>
              <circle r={dim.gradeCircle} fill={gradeColor} stroke="white" strokeWidth="2" />
              <text 
                x="0" 
                y={dim.gradeCircle / 2.5} 
                textAnchor="middle" 
                fill="white" 
                fontSize={dim.gradeFontSize} 
                fontWeight="900"
                fontFamily="sans-serif"
              >
                {grade}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
