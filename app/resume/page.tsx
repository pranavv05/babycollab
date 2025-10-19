"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Sparkles, Download, Clock, TrendingUp, CheckCircle2 } from "lucide-react"
import { ResumeAnalysis, SuggestionCategory } from "@/components/resume-analysis"

// Mock resume versions
const initialResumeVersions = [
  {
    id: "1",
    name: "Resume_JohnDoe_v3.pdf",
    uploadedAt: "2024-02-28",
    analyzed: true,
    score: 85,
    // Ensure this property exists in the initial state
    analysisData: [] as SuggestionCategory[], 
  },
  {
    id: "2",
    name: "Resume_JohnDoe_v2.pdf",
    uploadedAt: "2024-02-15",
    analyzed: true,
    score: 72,
    analysisData: [] as SuggestionCategory[],
  },
  {
    id: "3",
    name: "Resume_JohnDoe_v1.pdf",
    uploadedAt: "2024-01-20",
    analyzed: true,
    score: 65,
    analysisData: [] as SuggestionCategory[],
  },
]

export default function ResumePage() {
  const [resumeVersions, setResumeVersions] = useState(initialResumeVersions);
  const [currentResume, setCurrentResume] = useState(resumeVersions[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Renders analysis only if the current resume has data
  const showAnalysis = currentResume.analyzed && currentResume.analysisData.length > 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log(`[v0] Uploading and analyzing resume: ${file.name}`);
    setIsAnalyzing(true);

    try {
      // 1. Prepare form data for API upload
      const formData = new FormData();
      formData.append('resume', file);

      // 2. Call the Next.js API route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('AI analysis failed on the server.');
      }

      const result = await response.json();
      const aiAnalysis: SuggestionCategory[] = result.analysis || []; // Default to empty array
      
      // 3. Mock the new score and create the new resume object
      const newScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      const mockNewResume = {
        id: Date.now().toString(),
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        analyzed: true,
        score: newScore,
        analysisData: aiAnalysis,
      };
      
      // 4. Update state
      setResumeVersions(prev => [mockNewResume, ...prev.slice(0, 2)]);
      setCurrentResume(mockNewResume);

    } catch (error) {
      console.error('Frontend upload/analysis error:', error);
      alert('Error analyzing file. Check console and API key/route.');
    } finally {
      setIsAnalyzing(false);
      e.target.value = '';
    }
  }

  // NOTE: This function is simplified as upload handles analysis
  const handleAnalyze = () => {
    if (isAnalyzing) return;
    alert("Use the 'Upload New Version & Analyze with AI' box to submit a file for AI processing.");
  }

  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Resume Builder</h1>
          <p className="text-lg text-muted-foreground">Optimize your resume with AI-powered suggestions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Resume Versions</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{resumeVersions.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="text-sm font-medium text-muted-foreground">Current Score</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{currentResume.score}/100</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-warning" />
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
            </div>
            <p className="text-lg font-bold text-foreground">
              {new Date(currentResume.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Resume & Analysis Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Current Resume</h2>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* Current Resume Info */}
              <div className="bg-secondary border border-border rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{currentResume.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[200px] bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${currentResume.score}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{currentResume.score}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload New Version (triggers upload and AI analysis) */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors mb-6">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base text-foreground mb-1 font-medium">Upload New Version & Analyze with AI</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, DOCX (max 5MB)</p>
                </label>
              </div>

              {/* Analyze Button (Hidden, as upload does the analysis now) */}
              {!showAnalysis && !isAnalyzing && (
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Re-Analyze with AI
                </button>
              )}


              {/* Analyzing State */}
              {isAnalyzing && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-base font-medium text-foreground mb-1">Analyzing Your Resume</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI is reviewing your resume and generating personalized suggestions...
                  </p>
                </div>
              )}

              {/* Analysis Results */}
              {showAnalysis && !isAnalyzing && currentResume.analysisData && (
                <ResumeAnalysis analysisData={currentResume.analysisData} mockScore={currentResume.score} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Version History */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Version History</h3>
              <div className="space-y-3">
                {resumeVersions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => setCurrentResume(version)}
                    className={`w-full text-left bg-secondary border rounded-lg p-3 transition-all ${
                      currentResume.id === version.id ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground truncate flex-1">{version.name}</p>
                      {version.analyzed && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 ml-2" />}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(version.uploadedAt).toLocaleDateString()}</span>
                      <span className="text-primary font-medium">{version.score}/100</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resume Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Use Action Verbs</p>
                    <p className="text-xs text-muted-foreground">
                      Start bullet points with strong action verbs like "Led", "Developed", "Achieved"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Quantify Achievements</p>
                    <p className="text-xs text-muted-foreground">Include numbers and metrics to demonstrate impact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Tailor to Job</p>
                    <p className="text-xs text-muted-foreground">
                      Customize your resume for each position you apply to
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}