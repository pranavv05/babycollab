import { Users, Briefcase, Award } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Stop Building Alone. Start Building Your Future.
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            babycollab is the all-in-one platform for students to find teammates, collaborate on real-world projects,
            and build a portfolio that gets them hired. Go from classroom to career, together.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/"
              className="px-8 py-4 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Join the Waitlist
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-slate-500 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-white" />
              </div>
              <p className="text-sm text-slate-600">Join thousands of students already building.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 px-6 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-wide">
            Trusted by the next generation of talent
          </p>
          <div className="relative">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center gap-16 px-8 shrink-0">
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">University of State</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">TechCrunch</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">Product Hunt</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">MIT</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">Y Combinator</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">Stanford</div>
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-16 px-8 shrink-0">
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">University of State</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">TechCrunch</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">Product Hunt</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">MIT</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">Y Combinator</div>
                <div className="text-2xl font-bold text-slate-400 whitespace-nowrap">Stanford</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-100 rounded-2xl p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="text-6xl">😫</div>
                <p className="text-slate-600 font-medium">Messy workspace, scattered tools</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">THE STRUGGLE IS REAL</p>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Your career path is more than just a resume.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Juggling code on GitHub, team chats on Discord, and project plans on Google Docs is a chaotic mess.
                Building a standout portfolio in isolation is inefficient and demotivating. There has to be a better
                way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution / Features Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">
            Everything You Need to Succeed, All in One Place.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Find Your Squad.</h3>
              <p className="text-slate-600 leading-relaxed">
                Post your project ideas and discover skilled, motivated students to collaborate with. Build your team
                and get to work in minutes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Build Real Projects.</h3>
              <p className="text-slate-600 leading-relaxed">
                Use our integrated workspace with task boards and chat to manage your project from start to finish. Gain
                the practical experience employers are looking for.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Showcase Your Talent.</h3>
              <p className="text-slate-600 leading-relaxed">
                Every completed project automatically builds your dynamic portfolio. Earn skill endorsements from
                teammates to create a profile that proves your abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-t from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-slate-900">Ready to Build Your Future?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop waiting for experience to find you. Create it. Join babycollab today and start building the career you
            deserve.
          </p>
          <Link
            href="/"
            className="inline-block px-10 py-5 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Sign Up for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Social</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; 2025 babycollab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
