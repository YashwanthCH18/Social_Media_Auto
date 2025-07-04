"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface OnboardingState {
  product_service: string;
  ideal_customers: string;
  problem_solved: string;
  unique_style: string;
  post_platforms: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingState>({
    product_service: "",
    ideal_customers: "",
    problem_solved: "",
    unique_style: "",
    post_platforms: "",
  });

  useEffect(() => {
    const fetchOnboardingData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('onboarding')
          .select('question1, question2, question3, question4, question5')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
          console.error("Error fetching onboarding data:", error);
          alert('Failed to load your data. Please try again.');
        } else if (data) {
          // Map database columns to state properties
          setOnboardingData({
            product_service: data.question1 || '',
            ideal_customers: data.question2 || '',
            problem_solved: data.question3 || '',
            unique_style: data.question4 || '',
            post_platforms: data.question5 || '',
          });
        }
      }
      setLoading(false);
    };

    fetchOnboardingData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setOnboardingData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Map state properties back to database columns
      const updates = {
        question1: onboardingData.product_service,
        question2: onboardingData.ideal_customers,
        question3: onboardingData.problem_solved,
        question4: onboardingData.unique_style,
        question5: onboardingData.post_platforms,
      };

      const { error } = await supabase
        .from('onboarding')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        alert(`Error saving changes: ${error.message}`);
      } else {
        alert("Changes saved successfully!");
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className='mt-2'>Loading your settings...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-950 text-white p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Profile & Settings</h1>
        <Tabs defaultValue="content-dna" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="content-dna">Content DNA</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="content-dna">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Content DNA</CardTitle>
                <CardDescription className="text-gray-400">
                  Modify your original onboarding answers. This helps us generate content that is perfectly tailored to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-400">
                <div className="space-y-2">
                  <Label htmlFor="product_service">What is your product/service?</Label>
                  <Input id="product_service" value={onboardingData.product_service} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ideal_customers">Who are your ideal customers?</Label>
                  <Input id="ideal_customers" value={onboardingData.ideal_customers} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problem_solved">What problem do you solve?</Label>
                  <Input id="problem_solved" value={onboardingData.problem_solved} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unique_style">What's your unique style?</Label>
                  <Input id="unique_style" value={onboardingData.unique_style} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post_platforms">Where do you want to post?</Label>
                  <Input id="post_platforms" value={onboardingData.post_platforms} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges} disabled={saving} className="ml-auto bg-blue-600 hover:bg-blue-700">
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="account">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Account Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your name, email, password, and other signup details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-400">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Alex" className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="alex@example.com" className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="bg-gray-800 border-gray-700 text-gray-200"/>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto bg-blue-600 hover:bg-blue-700">Update Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
