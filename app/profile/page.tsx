"use client"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
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
  Camera,
  Plus,
  Menu,
} from "lucide-react"

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // State for user profile data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: null as string | null,
    role: "",
    location: "",
    bio: "",
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    links: [] as any[],
    stats: {
      projectsJoined: 0,
      roadmapsCreated: 0,
      tasksCompleted: 0,
      joinedDate: "",
    },
  })
  
  const [editedData, setEditedData] = useState(userData)
  
  // Fetch user profile data from database
  useEffect(() => {
    if (isLoaded && user) {
      // Set initial user data from Clerk - this should be the real data
      const initialData = {
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || "User",
        email: user.primaryEmailAddress?.emailAddress || "No email",
        avatar: user.imageUrl || null,
        role: "",
        location: "",
        bio: "",
        experience: [],
        education: [],
        skills: [],
        links: [],
        stats: {
          projectsJoined: 0,
          roadmapsCreated: 0,
          tasksCompleted: 0,
          joinedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        },
      }
      
      setUserData(initialData)
      setEditedData(initialData)
      
      // Fetch additional profile data from our database
      fetchUserProfile()
    }
  }, [isLoaded, user])
  
  // Fetch user profile data from our database
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      
      // Update user data with database information, but preserve Clerk data as primary source
      setUserData(prev => ({
        ...prev,
        name: data.user?.fullName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || prev.name),
        email: user?.primaryEmailAddress?.emailAddress || data.user?.email || prev.email,
        avatar: user?.imageUrl || data.user?.avatarUrl || prev.avatar,
        location: data.profile?.location || prev.location,
        bio: data.profile?.bio || prev.bio,
        // Stats would be fetched separately
      }))
      
      setEditedData(prev => ({
        ...prev,
        name: data.user?.fullName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || prev.name),
        email: user?.primaryEmailAddress?.emailAddress || data.user?.email || prev.email,
        avatar: user?.imageUrl || data.user?.avatarUrl || prev.avatar,
        location: data.profile?.location || prev.location,
        bio: data.profile?.bio || prev.bio,
      }))
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Even if fetch fails, we still have the Clerk data which is the real data
      if (user) {
        setUserData(prev => ({
          ...prev,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || prev.name,
          email: user.primaryEmailAddress?.emailAddress || prev.email,
          avatar: user.imageUrl || prev.avatar,
        }))
        
        setEditedData(prev => ({
          ...prev,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || prev.name,
          email: user.primaryEmailAddress?.emailAddress || prev.email,
          avatar: user.imageUrl || prev.avatar,
        }))
      }
    }
  }
  
  // Save profile data to database
  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: editedData.name,
          bio: editedData.bio,
          location: editedData.location,
          // Add other fields as needed
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save profile')
      }
      
      // Update successful - update local state
      setUserData(editedData)
      setIsEditing(false)
      
      // Refresh the Clerk user data to ensure consistency across the app
      if (user) {
        await user.reload()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }
  
  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload to a service like Cloudinary
    // For now, we'll just create a data URL and save it to the database
    setIsUploading(true)
    
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const avatarUrl = event.target?.result as string
        
        // Save to database
        const response = await fetch('/api/profile/photo', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatarUrl }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload photo')
        }
        
        // Update local state
        setUserData(prev => ({ ...prev, avatar: avatarUrl }))
        setEditedData(prev => ({ ...prev, avatar: avatarUrl }))
        
        // Refresh the Clerk user data
        if (user) {
          await user.setProfileImage({ file })
        }
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background lg:ml-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background lg:ml-64 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Please Sign In</h2>
          <p className="text-muted-foreground">You need to be signed in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted border-4 border-card overflow-hidden">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {isUploading ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </button>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-transparent border-b border-border focus:border-primary outline-none w-full sm:w-auto"
                    />
                  ) : (
                    userData.name
                  )}
                </h1>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  
                  {userData.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.location}
                            onChange={(e) => setEditedData(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-transparent border-b border-border focus:border-primary outline-none"
                          />
                        ) : (
                          userData.location
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 sm:px-4 sm:py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Bio */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">About</h3>
            {isEditing ? (
              <textarea
                value={editedData.bio}
                onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full bg-secondary border border-border rounded-lg p-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : userData.bio ? (
              <p className="text-muted-foreground">{userData.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio added yet.</p>
            )}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
            <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">{userData.stats.projectsJoined}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Projects Joined</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">{userData.stats.roadmapsCreated}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Roadmaps Created</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">{userData.stats.tasksCompleted}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Tasks Completed</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 text-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">2024</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Member Since</p>
          </div>
        </div>
        
        {/* Experience, Education, Skills Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Experience */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience
              </h2>
              {isEditing && (
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {userData.experience.length > 0 ? (
              <div className="space-y-4">
                {userData.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4 py-1">
                    <h3 className="font-medium text-foreground">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company} • {exp.duration}</p>
                    <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No experience added yet.</p>
            )}
          </div>
          
          {/* Education & Skills */}
          <div className="space-y-4 sm:space-y-6">
            {/* Education */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h2>
                {isEditing && (
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {userData.education.length > 0 ? (
                <div className="space-y-4">
                  {userData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 py-1">
                      <h3 className="font-medium text-foreground">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No education added yet.</p>
              )}
            </div>
            
            {/* Skills */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Skills
                </h2>
                {isEditing && (
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No skills added yet.</p>
              )}
            </div>
            
            {/* Social Links */}
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Links
              </h2>
              
              <div className="space-y-3">
                {userData.links.length > 0 ? (
                  userData.links.map((link, index) => {
                    let Icon = Globe;
                    if (link.type === 'github') Icon = Github;
                    if (link.type === 'linkedin') Icon = Linkedin;
                    
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{link.label}</span>
                      </a>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground italic">No links added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}