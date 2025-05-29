"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, FileText, Upload, X } from "lucide-react"

export default function ResumeScanner() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)

  const handleUpload = () => {
    setIsUploaded(true)
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      setIsAnalyzed(true)
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>Upload your resume to get AI-powered feedback and optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          {!isUploaded ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Upload your resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your resume file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-6">Supported formats: PDF, DOCX, TXT (Max 5MB)</p>
              <Button onClick={handleUpload} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">John_Doe_Resume.pdf</p>
                    <p className="text-xs text-muted-foreground">420 KB • Uploaded just now</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!isAnalyzing && !isAnalyzed ? (
                <Button onClick={handleAnalyze} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Analyze Resume
                </Button>
              ) : isAnalyzing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Analyzing resume...</p>
                    <p className="text-sm text-muted-foreground">60%</p>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {isAnalyzed && (
        <Card>
          <CardHeader>
            <CardTitle>Resume Analysis Results</CardTitle>
            <CardDescription>AI-powered feedback to help you optimize your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Overall Score</p>
                <p className="text-sm text-muted-foreground">78/100</p>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Keyword Match</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                        Present
                      </Badge>
                      <span className="text-sm">React</span>
                    </div>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                        Present
                      </Badge>
                      <span className="text-sm">JavaScript</span>
                    </div>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                        Missing
                      </Badge>
                      <span className="text-sm">TypeScript</span>
                    </div>
                    <X className="h-4 w-4 text-red-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                        Missing
                      </Badge>
                      <span className="text-sm">Next.js</span>
                    </div>
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Improvement Suggestions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Add more specific achievements with quantifiable results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Include TypeScript and Next.js in your skills section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Use more action verbs in your experience descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Tailor your resume more specifically to frontend development roles</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">ATS Compatibility</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Format Compatibility</p>
                    <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                      Good
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Keyword Optimization</p>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50">
                      Fair
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Readability</p>
                    <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                      Good
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Download Report</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Get Optimized Resume</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

