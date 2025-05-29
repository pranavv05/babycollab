"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "SkillSync helped me find team members for my final year project. We ended up winning the college hackathon and are now turning it into a startup!",
    name: "Alex Johnson",
    role: "Computer Science Student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The skill exchange feature allowed me to learn UI/UX design from a senior while I taught them Python. It's a win-win for everyone involved.",
    name: "Priya Sharma",
    role: "Data Science Major",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The AI Resume Scanner helped me optimize my resume, and I landed three interviews in the first week. I'm now working at my dream company!",
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setAutoplay(false)
    setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }

  const previous = () => {
    setAutoplay(false)
    setCurrent((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="w-full flex-shrink-0 border-none shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Quote className="h-12 w-12 text-blue-600 mb-6" />
                <p className="mb-6 text-xl italic">{testimonial.quote}</p>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-2">
        <Button variant="outline" size="icon" onClick={previous} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => {
              setAutoplay(false)
              setCurrent(index)
            }}
            className={`h-2 w-2 rounded-full p-0 ${index === current ? "bg-primary" : "bg-muted"}`}
          >
            <span className="sr-only">Go to testimonial {index + 1}</span>
          </Button>
        ))}
        <Button variant="outline" size="icon" onClick={next} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  )
}

