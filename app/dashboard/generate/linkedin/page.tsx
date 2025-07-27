"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import ResearchGather from '@/components/Research/research-gather'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const TiptapEditor = dynamic(() => import('@/components/editor/TiptapEditor'), { ssr: false })

export default function LinkedInGeneratorPage() {
  const [postContent, setPostContent] = useState("")
  const [characterCount, setCharacterCount] = useState(0)
  const [copyText, setCopyText] = useState("Copy")

  const maxCharacters = 2000
  const optimalLength = { min: 150, max: 300 }

  const handleCopy = () => {
    const plainText = postContent.replace(/<[^>]+>/g, '');
    navigator.clipboard.writeText(plainText).then(() => {
      setCopyText("Copied!");
      setTimeout(() => {
        setCopyText("Copy");
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

      const handleContentChange = (value: string) => {
    setPostContent(value)
    const strippedHtml = value.replace(/<[^>]+>/g, '');
    setCharacterCount(strippedHtml.length);
  }

        const handleLinkedInPostGenerated = (post: { content: string }) => {
    setPostContent(post.content);
    const strippedHtml = post.content.replace(/<[^>]+>/g, '');
    setCharacterCount(strippedHtml.length);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ResearchGather
          showGenerateBlogButton={false}
          showGenerateLinkedInPostButton={true}
          onLinkedInPostGenerated={handleLinkedInPostGenerated}
          showVisitSiteButton={false}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Post Editor</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <TiptapEditor value={postContent} onChange={handleContentChange} />
            <div className="flex justify-between items-center mt-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white">
                <Copy className="h-4 w-4 mr-2" />
                {copyText}
              </Button>
                            <div className="text-xs text-gray-500">
                {characterCount} / {maxCharacters} | Optimal: {optimalLength.min}-{optimalLength.max}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
