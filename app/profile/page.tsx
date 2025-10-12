"use client"

import { useState } from "react"
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Github,
  Linkedin,
  Globe,
  Edit,
  Save,
  X,
  Target,
  FolderKanban,
  Award,
  Calendar,
} from "lucide-react"

// Mock user data
const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Computer Science Student",
  location: "San Francisco, CA",
  bio: "Passionate about building innovative solutions and learning new technologies. Currently pursuing a degree in Computer Science with a focus on full-stack development and AI.",
  avatar: "JD",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Tailwind CSS", "Git", "Docker", "AWS"],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      period: "2021 - 2025",
      description: "GPA: 3.8/4.0. Focus on Software Engineering and Artificial Intelligence.",
    },
  ],
  experience: [
    {
      title: "Software Engineering Intern",
      company: "Tech Startup Inc.",
      period: "Summer 2024",
      description:
        "Developed full-stack features using React and Node.js. Improved application performance by 30% through optimization.",
    },
    {
      title: "Freelance Web Developer",
      company: "Self-Employed",
      period: "2023 - Present",
      description: "Built responsive websites for local businesses using modern web technologies.",
    },
  ],
  links: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    website: "https://johndoe.dev",
  },
  stats: {
    projectsJoined: 4,
    roadmapsCreated: 3,
    tasksCompleted: 47,
    joinedDate: "January 2024",
  },
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(initialUserData)
  const [editedData, setEditedData] = useState(initialUserData)

  const handleSave = () => {
    setUserData(editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {userData.avatar}
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="text-3xl font-bold text-foreground bg-background border border-border rounded px-3 py-1 mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userData.name}</h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.role}
                    onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                    className="text-lg text-muted-foreground bg-background border border-border rounded px-3 py-1 mb-2 w-full"
                  />
                ) : (
                  <p className="text-lg text-muted-foreground mb-2">{userData.role}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.location}
                        onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                        className="bg-background border border-border rounded px-2 py-0.5"
                      />
                    ) : (
                      userData.location
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FolderKanban className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{userData.stats.projectsJoined}</p>
              </div>
              <p className="text-sm text-muted-foreground">Projects Joined</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{userData.stats.roadmapsCreated}</p>
              </div>
              <p className="text-sm text-muted-foreground">Roadmaps Created</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{userData.stats.tasksCompleted}</p>
              </div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-foreground">{userData.stats.joinedDate}</p>
              </div>
              <p className="text-sm text-muted-foreground">Member Since</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                About
              </h2>
              {isEditing ? (
                <textarea
                  value={editedData.bio}
                  onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{userData.bio}</p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Experience
              </h2>
              <div className="space-y-4">
                {userData.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-primary mb-1">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education
              </h2>
              <div className="space-y-4">
                {userData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-primary mb-1">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground mb-2">{edu.period}</p>
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Links
              </h2>
              <div className="space-y-3">
                <a
                  href={userData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Github className="w-5 h-5 group-hover:text-primary" />
                  <span className="text-sm">GitHub Profile</span>
                </a>
                <a
                  href={userData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Linkedin className="w-5 h-5 group-hover:text-primary" />
                  <span className="text-sm">LinkedIn Profile</span>
                </a>
                <a
                  href={userData.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Globe className="w-5 h-5 group-hover:text-primary" />
                  <span className="text-sm">Personal Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
