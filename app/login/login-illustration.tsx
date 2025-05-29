export default function LoginIllustration() {
  return (
    <div className="relative w-full h-[400px] md:h-[600px]">
      <svg viewBox="0 0 800 800" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect width="800" height="800" fill="url(#loginGrad)" rx="20" />

        {/* Lock Icon */}
        <circle cx="400" cy="300" r="100" fill="#F3F4F6" stroke="#4F46E5" strokeWidth="2" />
        <rect x="370" y="280" width="60" height="80" rx="10" fill="#4F46E5" />
        <circle cx="400" cy="320" r="10" fill="white" />
        <rect x="395" y="320" width="10" height="20" fill="white" />

        {/* Login Form */}
        <rect x="250" y="430" width="300" height="50" rx="5" fill="#F3F4F6" />
        <text x="270" y="460" fill="#6B7280" fontFamily="Arial" fontSize="14">
          Email
        </text>

        <rect x="250" y="500" width="300" height="50" rx="5" fill="#F3F4F6" />
        <text x="270" y="530" fill="#6B7280" fontFamily="Arial" fontSize="14">
          Password
        </text>

        {/* Login Button */}
        <rect x="250" y="570" width="300" height="50" rx="25" fill="#7C3AED" />
        <text x="400" y="600" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="16">
          Log In
        </text>

        {/* Decorative Elements */}
        <circle cx="150" cy="150" r="50" fill="#4F46E5" fillOpacity="0.2" />
        <circle cx="650" cy="650" r="70" fill="#7C3AED" fillOpacity="0.2" />
        <circle cx="700" cy="200" r="30" fill="#4F46E5" fillOpacity="0.3" />
        <circle cx="100" cy="600" r="40" fill="#7C3AED" fillOpacity="0.3" />
      </svg>
    </div>
  )
}

