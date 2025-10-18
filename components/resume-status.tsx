import { FileText, Sparkles, Download } from "lucide-react"

export function ResumeStatus() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Resume</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <div className="bg-secondary border border-border rounded-lg p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground mb-1">Resume_JohnDoe_2024.pdf</h4>
            <p className="text-sm text-muted-foreground">Last updated 3 days ago</p>
          </div>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">5 AI Suggestions Available</p>
              <p className="text-xs text-muted-foreground">Improve your resume with AI-powered recommendations</p>
            </div>
          </div>
        </div>
        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-2.5 text-sm font-medium transition-colors">
          Analyze with AI
        </button>
      </div>
    </div>
  )
}