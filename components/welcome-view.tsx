"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface WelcomeViewProps {
  setActiveSection: (section: string) => void
}

export function WelcomeView({ setActiveSection }: WelcomeViewProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between text-center space-y-8 px-4 relative">
      {/* Main Title - Top Area */}
      <div className="pt-16 relative z-10">
        <h1 className="font-bold text-foreground leading-tight text-5xl my-20">
          Transform weeks of work into <span className="text-blue-600">5 min</span>
        </h1>
      </div>

      {/* Background Logo - Center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Image
          src="/images/cal-poly-logo.png"
          alt="Cal Poly Background"
          width={400}
          height={300}
          className="max-w-full object-contain"
          priority
        />
      </div>

      {/* Button - Bottom Area */}
      <div className="pb-16 relative z-10">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg my-12"
          onClick={() => setActiveSection("upload")}
        >
          Start New Audit →
        </Button>
      </div>
    </div>
  )
}
