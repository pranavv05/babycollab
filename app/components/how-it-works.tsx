import { Users, Code, Award, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Create Your Profile</h3>
        <p className="text-sm text-muted-foreground">
          Sign up and showcase your skills, experience, and projects you're interested in.
        </p>

        <div className="hidden md:block mt-8">
          <ArrowRight className="h-8 w-8 text-blue-600/30 dark:text-blue-400/30 rotate-0 md:rotate-90 lg:rotate-0" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect with Peers</h3>
        <p className="text-sm text-muted-foreground">
          Find students and professionals with complementary skills and interests.
        </p>

        <div className="hidden md:block mt-8">
          <ArrowRight className="h-8 w-8 text-purple-600/30 dark:text-purple-400/30 rotate-0 md:rotate-90 lg:rotate-0" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            3
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Collaborate on Projects</h3>
        <p className="text-sm text-muted-foreground">
          Work together on real-world projects to build your portfolio and gain experience.
        </p>

        <div className="hidden md:block mt-8">
          <ArrowRight className="h-8 w-8 text-blue-600/30 dark:text-blue-400/30 rotate-0 md:rotate-90 lg:rotate-0" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            4
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Grow Your Career</h3>
        <p className="text-sm text-muted-foreground">
          Earn badges, build your reputation, and unlock job opportunities as you progress.
        </p>
      </div>
    </div>
  )
}

