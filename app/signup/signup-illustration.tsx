export default function SignupIllustration() {
  return (
    <div className="relative w-full h-[400px] md:h-[600px]">
      <svg viewBox="0 0 800 800" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="signupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect width="800" height="800" fill="url(#signupGrad)" rx="20" />

        {/* Document/Form */}
        <rect x="200" y="150" width="400" height="500" rx="10" fill="white" stroke="#4F46E5" strokeWidth="2" />

        {/* Form Header */}
        <rect x="200" y="150" width="400" height="60" rx="10" fill="#4F46E5" />
        <text x="400" y="185" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="20">
          Sign Up Form
        </text>

        {/* Form Fields */}
        <rect x="240" y="240" width="320" height="40" rx="5" fill="#F3F4F6" />
        <text x="260" y="265" fill="#6B7280" fontFamily="Arial" fontSize="14">
          Name
        </text>

        <rect x="240" y="300" width="320" height="40" rx="5" fill="#F3F4F6" />
        <text x="260" y="325" fill="#6B7280" fontFamily="Arial" fontSize="14">
          Email
        </text>

        <rect x="240" y="360" width="320" height="40" rx="5" fill="#F3F4F6" />
        <text x="260" y="385" fill="#6B7280" fontFamily="Arial" fontSize="14">
          College
        </text>

        <rect x="240" y="420" width="320" height="40" rx="5" fill="#F3F4F6" />
        <text x="260" y="445" fill="#6B7280" fontFamily="Arial" fontSize="14">
          Password
        </text>

        {/* Submit Button */}
        <rect x="240" y="500" width="320" height="50" rx="25" fill="#7C3AED" />
        <text x="400" y="530" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="16">
          Create Account
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

