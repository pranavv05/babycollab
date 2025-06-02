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

  const extractTextFromPDF = async (file: File) => {
    // Mock extraction (replace with actual PDF text extraction in production)
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        resolve(`Extracted text from ${file.name}`); // Simulate text
      };
      reader.readAsDataURL(file);
    });
  };

  const getImprovementsFromGemini = async (resumeText: string) => {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `
          Analyze this resume and provide 10 specific, actionable recommendations to improve it.
          Focus on content quality, ATS optimization, and formatting.
          Respond with only the bullet points, no additional text.
          Resume: ${resumeText}
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API request failed");
    }

    const data = await response.json();
    return data.text.split('\n').filter((line: string) => line.trim().length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setImprovements([]);

    try {
      const resumeText = await extractTextFromPDF(file);
      const improvements = await getImprovementsFromGemini(resumeText);
      setImprovements(improvements);
      toast({ title: "Analysis complete!" });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">AI Resume Improver</h1>
          <p className="mt-3 text-xl text-gray-500">
            Upload your resume for AI-powered suggestions
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>We'll analyze it and suggest improvements</CardDescription>
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
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
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
                  setImprovements([]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
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
              <CardTitle>Recommended Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mt-0.5"
                    >
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{improvement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}