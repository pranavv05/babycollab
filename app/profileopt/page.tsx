'use client';
import { useState, useRef } from "react";
import { Loader2, UploadCloud, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ResumeImprover() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [improvements, setImprovements] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a resume PDF to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setImprovements([]);

    try {
      // In a real app, you would send the file to your backend
      // which would then call the Gemini API
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in a real app this would come from Gemini AI
      const mockImprovements = [
        "Add quantifiable achievements to your work experience (e.g., 'Increased sales by 30%')",
        "Include more action verbs like 'developed', 'implemented', 'led'",
        "Tailor your skills section to match the job description keywords",
        "Add a professional summary at the top highlighting your key qualifications",
        "Remove outdated or irrelevant work experience",
        "Include relevant certifications or training programs",
        "Optimize for ATS by using standard section headers (Work Experience, Education, etc.)",
        "Add links to your portfolio, GitHub, or LinkedIn profile",
        "Ensure consistent formatting (dates, bullet points, fonts)",
        "Keep resume to one page if you have less than 10 years of experience"
      ];
      
      setImprovements(mockImprovements);
      toast({
        title: "Analysis complete",
        description: "We've found areas to improve your resume",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            AI Resume Improver
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Upload your resume and get instant AI-powered suggestions to make it stand out
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
            <CardDescription>
              We'll analyze your resume and provide specific recommendations to improve it
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="resume">Resume PDF</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      id="resume" 
                      type="file" 
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="cursor-pointer"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Browse
                    </Button>
                  </div>
                </div>
                
                {file && (
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={!file || isLoading}
              >
                Clear
              </Button>
              <Button type="submit" disabled={!file || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Get Improvements
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {improvements.length > 0 && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recommended Improvements</CardTitle>
              <CardDescription>
                Based on our AI analysis of your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{improvement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Download Improved Resume (Coming Soon)
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}