"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { startTopicScrape } from '@/lib/scraper'

interface ResearchGatherProps {
  onBlogGenerated?: (blog: { id: string; title: string; content: string; status: string; }) => void;
  onLinkedInPostGenerated?: (post: { content: string }) => void;
  className?: string;
  showGenerateBlogButton?: boolean;
  showGatherResearchButton?: boolean;
  showGenerateLinkedInPostButton?: boolean;
  showVisitSiteButton?: boolean;
}

/**
 * Generic input + button to trigger the /scraper/topic endpoint.
 * Drop <ResearchGather/> anywhere a user can type a topic to gather research.
 */
export default function ResearchGather({
  className,
  onBlogGenerated,
  onLinkedInPostGenerated,
  showGenerateBlogButton = true,
  showGatherResearchButton = true,
  showGenerateLinkedInPostButton = false,
  showVisitSiteButton = true,
}: ResearchGatherProps) {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGathering, setIsGathering] = useState(false)
  const [isGeneratingPost, setIsGeneratingPost] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [blogInfo, setBlogInfo] = useState<any | null>(null)

  const handleGather = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Could not get user session. Please log in again.');
      }
      const jwt = session.access_token;
      const userId = session.user.id;

      // Step 1: Call the API to generate and save the blog.
      console.log('Calling API to generate and save blog...');
      const response = await fetch('https://leyu1qigsf.execute-api.ap-south-1.amazonaws.com/blog/manual-generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'API failed to generate blog');
      }

      const apiResponse = await response.json();
      console.log('API confirms blog saved:', apiResponse);

      const partialBlog = Array.isArray(apiResponse.blog) ? apiResponse.blog[0] : apiResponse.blog;
      if (!partialBlog || !partialBlog.title) {
        throw new Error('API response did not contain a blog with a title.');
      }

      // Step 2: Fetch the full blog post from the database to get the ID.
      console.log(`Fetching full blog post with title: "${partialBlog.title}"`);
      const { data: newPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', userId)
        .eq('title', partialBlog.title)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !newPost) {
        console.error('Failed to fetch the new blog post from database:', fetchError);
        throw new Error('Could not retrieve the newly created blog post. Please check your posts list.');
      }

      // Step 3: Update the UI with the complete blog post data.
      console.log('Successfully fetched complete blog post:', newPost);
      if (onBlogGenerated) {
        onBlogGenerated({
          id: newPost.id,
          title: newPost.title,
          content: newPost.html_content ?? newPost.content ?? '',
          status: newPost.status || 'draft'
        });
      }

      setSuccess(true);

    } catch (err: any) {
      console.error('Blog generation process failed:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResearch = async () => {
    if (!topic.trim()) return;

    setIsGathering(true);
    setError(null);

    try {
      const result = await startTopicScrape(topic.trim());
      console.log('Research gathered successfully:', result);
      alert('Research gathered successfully! Check the console for details.');
    } catch (err: any) {
      console.error('Research gathering failed:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGathering(false);
    }
  };

  const handleGenerateLinkedInPost = async () => {
    if (!topic.trim()) return;

    setIsGeneratingPost(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Could not get user session. Please log in again.');
      }
      const jwt = session.access_token;

      const response = await fetch('https://3vpkgdhdy4.execute-api.ap-south-1.amazonaws.com/generate/manual',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
          body: JSON.stringify({
            topic: topic.trim(),
            length: "short", // Hardcoded for now, can be made dynamic later
            additional_instructions: "Focus on the cost-saving benefits." // Hardcoded for now
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'API failed to generate LinkedIn post');
      }

      const result = await response.json();

      if (onLinkedInPostGenerated && result.content) {
        onLinkedInPostGenerated({ content: result.content });
      }

    } catch (err: any) {
      console.error('LinkedIn post generation failed:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingPost(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && blogInfo && (
        <Alert className="mt-4 border-green-600 bg-green-50 text-green-900">
          <AlertDescription>
            Blog generated successfully!<br />
            <b>Title:</b> {blogInfo.blog?.title} <br />
            <b>Status:</b> {blogInfo.blog?.status} <br />
            <b>User ID:</b> {blogInfo.uid}<br />
            {blogInfo.blog?.id && (
              <a
                href={`/public/${blogInfo.blog?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                View Live Blog
              </a>
            )}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="Enter a topic e.g. SaaS pricing strategies in 2025"
          value={topic}
          disabled={isLoading}
          onChange={(e) => setTopic(e.target.value)}
        />
        {showGenerateBlogButton && (
          <Button onClick={handleGather} disabled={isLoading || isGathering || !topic.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              'Generate Blog'
            )}
          </Button>
        )}
        {showGatherResearchButton && (
          <Button onClick={handleResearch} disabled={isGathering || isLoading || !topic.trim()}>
            {isGathering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gathering...
              </>
            ) : (
              'Gather Research'
            )}
          </Button>
        )}
        {showGenerateLinkedInPostButton && (
          <Button onClick={handleGenerateLinkedInPost} disabled={isGeneratingPost || isLoading || isGathering || !topic.trim()}>
            {isGeneratingPost ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Post...
              </>
            ) : (
              'Generate LinkedIn Post'
            )}
          </Button>
        )}
        {showVisitSiteButton && (
          <Button
            variant="outline"
            onClick={() => {
              window.open(`/public`, '_blank', 'noopener,noreferrer');
            }}
          >
            Visit Site
          </Button>
        )}

      </div>
    </div>
  )
}
