"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TVNoiseProps extends React.HTMLAttributes<HTMLDivElement> {
  opacity?: number
}

const TVNoise = React.forwardRef<HTMLDivElement, TVNoiseProps>(
  ({ className, opacity = 0.05, ...props }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let animationId: number

      const resize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      const loop = () => {
        const w = canvas.width
        const h = canvas.height
        const idata = ctx.createImageData(w, h)
        const buffer32 = new Uint32Array(idata.data.buffer)
        const len = buffer32.length

        for (let i = 0; i < len; i++) {
          if (Math.random() < 0.5) buffer32[i] = 0xff000000
        }

        ctx.putImageData(idata, 0, 0)
        animationId = requestAnimationFrame(loop)
      }

      resize()
      window.addEventListener("resize", resize)
      loop()

      return () => {
        window.removeEventListener("resize", resize)
        cancelAnimationFrame(animationId)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 overflow-hidden pointer-events-none z-50", className)}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-[0.05]"
          style={{ opacity }}
        />
      </div>
    )
  }
)
TVNoise.displayName = "TVNoise"

export default TVNoise
