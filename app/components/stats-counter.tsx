"use client"

import { useEffect, useState, useRef } from "react"

interface StatsCounterProps {
  end: number
  suffix?: string
  label: string
  duration?: number
}

export default function StatsCounter({ end, suffix = "", label, duration = 2000 }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = 0

    const step = () => {
      const currentTime = Date.now()
      const progress = Math.min((currentTime - startTime) / duration, 1)

      countRef.current = Math.floor(startValue + progress * (end - startValue))
      setCount(countRef.current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)

    return () => {
      countRef.current = 0
    }
  }, [end, duration, isVisible])

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

