export default function HeroIllustration() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <svg viewBox="0 0 1024 1024" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <circle cx="512" cy="512" r="400" fill="url(#grad1)" />
        <circle cx="512" cy="512" r="300" fill="url(#grad2)" />

        {/* People icons */}
        <g transform="translate(312, 312)">
          <circle cx="0" cy="0" r="60" fill="#4F46E5" />
          <circle cx="0" cy="0" r="40" fill="white" />
          <circle cx="0" cy="-15" r="10" fill="#4F46E5" />
          <rect x="-20" y="5" width="40" height="20" rx="10" fill="#4F46E5" />
        </g>

        <g transform="translate(512, 412)">
          <circle cx="0" cy="0" r="60" fill="#7C3AED" />
          <circle cx="0" cy="0" r="40" fill="white" />
          <circle cx="0" cy="-15" r="10" fill="#7C3AED" />
          <rect x="-20" y="5" width="40" height="20" rx="10" fill="#7C3AED" />
        </g>

        <g transform="translate(612, 612)">
          <circle cx="0" cy="0" r="60" fill="#4F46E5" />
          <circle cx="0" cy="0" r="40" fill="white" />
          <circle cx="0" cy="-15" r="10" fill="#4F46E5" />
          <rect x="-20" y="5" width="40" height="20" rx="10" fill="#4F46E5" />
        </g>

        {/* Connection lines */}
        <line x1="372" y1="372" x2="512" y2="412" stroke="#4F46E5" strokeWidth="4" />
        <line x1="512" y1="412" x2="612" y2="612" stroke="#7C3AED" strokeWidth="4" />
        <line x1="372" y1="372" x2="612" y2="612" stroke="#4F46E5" strokeWidth="4" strokeDasharray="10,10" />
      </svg>
    </div>
  )
}

