"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { startProfileScrape } from '@/lib/scraper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle } from 'lucide-react'
import Image from 'next/image'

const questions = [
  {
    id: 1,
    question: "What is your product/service?",
    type: "textarea",
    placeholder: "e.g., A project management SaaS for small businesses"
  },
  {
    id: 2,
    question: "Who are your ideal customers?",
    type: "textarea",
    placeholder: "e.g., Freelancers, startups, and agencies"
  },
  {
    id: 3,
    question: "What is the topic?",
    type: "textarea",
    placeholder: "e.g., The future of AI in marketing"
  },
  {
    id: 4,
    question: "What's your unique style?",
    type: "select",
    options: ["Professional", "Casual", "Witty", "Inspirational", "Technical"]
  },
  {
    id: 5,
    question: "Where do you want to post?",
    type: "select",
    options: ["LinkedIn", "Twitter/X", "Blog", "All of the above"]
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: onboarding } = await supabase
          .from('onboarding')
          .select('completed')
          .eq('user_id', user.id)
          .single();
        
        if (onboarding?.completed) {
          router.push('/dashboard');
        }
      }
    };
    
    checkOnboardingStatus();
  }, [router]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not found. Please sign in again.');
      }

      if (questions.some(q => !answers[q.id])) {
        throw new Error('Please answer all questions before proceeding.');
      }

      const onboardingData = {
        user_id: user.id,
        question1: answers[1] || '',
        question2: answers[2] || '',
        question3: answers[3] || '',
        question4: answers[4] || '',
        question5: answers[5] || '',
        completed: true,
      };

      const { error: saveError } = await supabase
        .from('onboarding')
        .upsert(onboardingData, { onConflict: 'user_id' });

      if (saveError) {
        throw saveError;
      }

      // Kick off automatic profile scrape (does not block the user)
      try {
        await startProfileScrape();
      } catch (scrapeError) {
        // We don't block the user for this, just log the error for debugging.
        console.error('Failed to start profile scrape:', scrapeError);
      }

      setIsCompleted(true);
      // Redirect after a short delay to show completion message
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Onboarding Complete!</CardTitle>
            <CardDescription>
              Thank you for completing the onboarding. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="flex items-center justify-center gap-8">
        <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome! Let's get to know you</CardTitle>
          <CardDescription className="text-center">
            Please answer a few questions to personalize your experience
          </CardDescription>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQ.question}</h3>
            {currentQ.type === 'select' ? (
              <Select 
                value={answers[currentQ.id] || ''} 
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {currentQ.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Textarea
                placeholder={currentQ.placeholder}
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                rows={4}
              />
            )}
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0 || isLoading}
            >
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id] || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  'Complete Setup'
                ) : (
                  'Next'
                )}
              </Button>

            </div>
          </div>
        </CardContent>
        </Card>
        <div className="hidden lg:block">
          <Image 
            src="/cute-3d-robot-say-hello-png (1).png"
            alt="Onboarding Robot"
            width={400}
            height={400}
            className="object-contain animate-bounce"
          />
        </div>
      </div>
    </div>
  )
}
