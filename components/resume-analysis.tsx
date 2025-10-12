"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"

const suggestions = [
  {
    category: "Action Verbs",
    severity: "high",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    items: [
      {
        original: "Responsible for managing a team of 5 developers",
        improved: "Led and mentored a team of 5 developers, improving delivery speed by 30%",
        reason: "Use strong action verbs and quantify achievements",
      },
      {
        original: "Worked on improving website performance",
        improved: "Optimized website performance, reducing load time by 45% and increasing user engagement by 25%",
        reason: "Be specific and include measurable results",
      },
    ],
  },
  {
    category: "Quantifiable Achievements",
    severity: "medium",
    icon: Lightbulb,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    items: [
      {
        original: "Developed new features for the mobile app",
        improved: "Developed 12+ new features for mobile app, contributing to 50K+ downloads in 3 months",
        reason: "Add specific numbers to demonstrate impact",
      },
    ],
  },
  {
    category: "ATS Optimization",
    severity: "low",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    items: [
      {
        original: "Skills: JS, React, Node",
        improved: "Skills: JavaScript, React.js, Node.js, TypeScript, Next.js, MongoDB",
        reason: "Use full names and include relevant keywords for ATS systems",
      },
    ],
  },
]

export function ResumeAnalysis() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Action Verbs"])
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const applySuggestion = (category: string, index: number) => {
    const key = `${category}-${index}`
    setAppliedSuggestions((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]))
  }

  const totalSuggestions = suggestions.reduce((acc, cat) => acc + cat.items.length, 0)
  const appliedCount = appliedSuggestions.length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Complete</h3>
            <p className="text-sm text-muted-foreground mb-3">
              We found {totalSuggestions} suggestions to improve your resume. Apply them to increase your chances of
              getting noticed.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">
                    {appliedCount}/{totalSuggestions} applied
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(appliedCount / totalSuggestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions by Category */}
      <div className="space-y-4">
        {suggestions.map((category) => {
          const Icon = category.icon
          const isExpanded = expandedCategories.includes(category.category)

          return (
            <div
              key={category.category}
              className={`bg-card border ${category.borderColor} rounded-lg overflow-hidden`}
            >
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-semibold text-foreground">{category.category}</h4>
                    <p className="text-sm text-muted-foreground">{category.items.length} suggestions</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                  {category.items.map((item, index) => {
                    const key = `${category.category}-${index}`
                    const isApplied = appliedSuggestions.includes(key)

                    return (
                      <div key={index} className="bg-secondary rounded-lg p-4">
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Current:</p>
                          <p className="text-sm text-foreground bg-muted/50 rounded px-3 py-2">{item.original}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-success mb-2">Suggested:</p>
                          <p className="text-sm text-foreground bg-success/5 border border-success/20 rounded px-3 py-2">
                            {item.improved}
                          </p>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground italic">{item.reason}</p>
                        </div>
                        <button
                          onClick={() => applySuggestion(category.category, index)}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isApplied
                              ? "bg-success/20 text-success border border-success/30"
                              : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          }`}
                        >
                          {isApplied ? (
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Applied
                            </span>
                          ) : (
                            "Apply Suggestion"
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors">
          Save Draft
        </button>
        <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
          Download Optimized Resume
        </button>
      </div>
    </div>
  )
}
