"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Send, Loader2 } from "lucide-react"
import ResearchGather from '@/components/Research/research-gather'
import dynamic from 'next/dynamic'
import LinkedinPreview from '@/components/linkedin/LinkedinPreview';
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

const TiptapEditor = dynamic(() => import('@/components/editor/TiptapEditor'), { ssr: false })

export default function LinkedInGeneratorPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [postContent, setPostContent] = useState("")
  const [characterCount, setCharacterCount] = useState(0)
  const [copyText, setCopyText] = useState("Copy")
  const [isPosting, setIsPosting] = useState(false)
  const [postStatus, setPostStatus] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const maxCharacters = 2000
  const optimalLength = { min: 150, max: 300 }

  // Check and refresh session on component mount and when user changes
  useEffect(() => {
    const checkSession = async () => {
      if (user && !authLoading) {
        try {
          // Force refresh session to ensure it's valid
          const { error } = await supabase.auth.refreshSession()
          if (error) {
            console.warn('Session refresh warning:', error.message)
            setSessionError('Session may be expired. Some features might not work properly.')
          } else {
            setSessionError(null)
          }
        } catch (error) {
          console.error('Session check error:', error)
          setSessionError('Authentication error. Please try refreshing the page.')
        }
      }
    }

    checkSession()
  }, [user, authLoading])

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

  const handlePostToLinkedIn = async () => {
    if (!postContent) return;
    
    setIsPosting(true);
    setPostStatus(null);
    
    try {
      const response = await fetch('https://spmsuccess.app.n8n.cloud/webhook/auto-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedpost: postContent.replace(/<[^>]+>/g, '') // Remove HTML tags
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post to LinkedIn');
      }
      
      setPostStatus({
        type: 'success',
        message: 'Successfully posted to LinkedIn!'
      });
      
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      setPostStatus({
        type: 'error',
        message: 'Failed to post to LinkedIn. Please try again.'
      });
    } finally {
      setIsPosting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setPostStatus(null);
      }, 5000);
    }
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
      {sessionError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="bg-yellow-900/30 text-yellow-400 p-3 rounded-md text-sm">
            {sessionError}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ResearchGather
          showGenerateBlogButton={false}
          showGenerateLinkedInPostButton={true}
          onLinkedInPostGenerated={handleLinkedInPostGenerated}
          showVisitSiteButton={false}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Post Editor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <TiptapEditor value={postContent} onChange={handleContentChange} />
              {authLoading && (
                <div className="mt-2 text-sm text-gray-400">
                  Loading authentication...
                </div>
              )}
              {!user && !authLoading && (
                <div className="mt-2 text-sm text-red-400">
                  Please sign in to use the generation features.
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white">
                      <Copy className="h-4 w-4 mr-2" />
                      {copyText}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePostToLinkedIn} 
                      disabled={isPosting || !postContent || authLoading || !user}
                      className="text-blue-400 border-gray-700 hover:bg-gray-800 hover:text-blue-300"
                    >
                      {isPosting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post to LinkedIn
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {characterCount} / {maxCharacters} | Optimal: {optimalLength.min}-{optimalLength.max}
                  </div>
                </div>
                {postStatus && (
                  <div className={`text-sm p-2 rounded-md ${
                    postStatus.type === 'success' 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {postStatus.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">LinkedIn Preview</h2>
          <LinkedinPreview content={postContent} />
        </div>
      </div>
    </div>
  )
}
