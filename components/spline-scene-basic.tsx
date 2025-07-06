"use client"

import { SplineScene } from "@/components/ui/spline"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { InteractiveSpotlight } from "@/components/ui/interactive-spotlight"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function SplineSceneBasic() {
  return (
    <Card className="w-full bg-black/[0.96] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <InteractiveSpotlight size={300} />

      <div className="flex flex-col md:flex-row items-center w-full md:h-[600px]">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center text-center md:text-left items-center md:items-start">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Meet Your AI Assistant
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg mb-8">
            Your sophisticated AI companion that transforms content creation. Generate compelling blogs, viral LinkedIn
            posts, and engaging video scripts with advanced artificial intelligence.
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold w-fit"
            asChild
          >
            <Link href="/auth">
              Start Creating Content
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
        {/* Right content */}
        <div className="relative w-full h-[400px] md:flex md:flex-1 md:h-full">
          <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
        </div>
      </div>
    </Card>
  )
}
