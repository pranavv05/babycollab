"use client"

import type React from "react"

import { useState } from "react"
import { Send, Star, MessageSquare, Bug, Lightbulb, MessageCircle } from "lucide-react"

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<string>("general")
  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)

  const feedbackTypes = [
    { id: "bug", label: "Bug Report", icon: Bug, description: "Report a technical issue" },
    { id: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest a new feature" },
    { id: "general", label: "General Feedback", icon: MessageCircle, description: "Share your thoughts" },
    { id: "suggestion", label: "Suggestion", icon: MessageSquare, description: "Suggest improvements" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the feedback to your backend
    console.log("[v0] Feedback submitted:", { feedbackType, rating, feedback, email })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback("")
      setRating(0)
      setEmail("")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Feedback & Suggestions</h1>
          <p className="text-muted-foreground">
            We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-600 dark:text-green-400 font-medium">
              Thank you for your feedback! We'll review it shortly.
            </p>
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Feedback Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      feedbackType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`w-5 h-5 mt-0.5 ${
                          feedbackType === type.id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className={`font-medium ${feedbackType === type.id ? "text-primary" : "text-foreground"}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              How would you rate your experience? (Optional)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows={6}
              placeholder="Tell us what's on your mind..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">{feedback.length} / 1000 characters</p>
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email (Optional - for follow-up)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!feedback.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Submit Feedback
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Our team reviews all feedback within 48 hours</li>
            <li>• Bug reports are prioritized and addressed quickly</li>
            <li>• Feature requests are evaluated for future updates</li>
            <li>• We may reach out if you provided your email</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
