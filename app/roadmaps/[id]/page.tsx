import { RoadmapDisplay, type Roadmap } from "@/components/roadmap-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { GoogleGenAI } from '@google/genai';

// Helper function to generate AI content
async function getAiGeneratedRoadmap(roadmapTopic: string): Promise<Roadmap> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    const jsonSchema = {
      type: "object",
      properties: {
        title: { type: "string" },
        field: { type: "string" },
        skillLevel: { type: "string" },
        timeline: { type: "string" },
        phases: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              duration: { type: "string" },
              milestones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    skills: { type: "array", items: { type: "string" } },
                    resources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          type: { type: "string", enum: ["Documentation", "Course", "Practice", "Platform", "Video", "Article"] }
                        },
                        required: ["title", "type"]
                      }
                    },
                    completed: { type: "boolean", description: "Default to false" }
                  },
                  required: ["title", "description", "skills", "resources", "completed"]
                }
              }
            },
            required: ["name", "duration", "milestones"]
          }
        }
      },
      required: ["title", "field", "skillLevel", "timeline", "phases"]
    };

    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: `Generate a detailed career roadmap for a "${roadmapTopic}". The roadmap should include a title, field, skill level, timeline, and multiple phases. Each phase must have several milestones, and each milestone should list skills, resources, and have a 'completed' status set to false. Output strictly in the requested JSON schema.` }],
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      }
    });

    return JSON.parse(modelResponse.text);
  } catch (error) {
    console.error("AI Roadmap Detail Generation Error:", error);
    // Fallback to a simple error structure if AI fails
    return {
      title: `Error Generating Roadmap for ${roadmapTopic}`,
      field: "Error",
      skillLevel: "N/A",
      timeline: "N/A",
      phases: [{
        name: "Error",
        duration: "N/A",
        milestones: [{
          title: "Could not generate content",
          description: "There was an error communicating with the AI service. Please try again later.",
          skills: [],
          resources: [],
          completed: false
        }]
      }]
    };
  }
}


export default async function RoadmapDetailPage({ params }: { params: { id: string } }) {
  // Convert URL slug back to a readable title (e.g., "product-management" -> "Product Management")
  const roadmapTitle = params.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const roadmapData = await getAiGeneratedRoadmap(roadmapTitle);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Baby Collab
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/roadmaps"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmaps
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <RoadmapDisplay roadmap={roadmapData} />
      </main>
    </div>
  )
}
