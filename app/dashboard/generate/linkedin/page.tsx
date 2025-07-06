"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import ResearchGather from '@/components/Research/research-gather'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Linkedin,
  Sparkles,
  Hash,
  ImageIcon,
  Link2,
  BarChart3,
  Calendar,
  Send,
  Save,
  TrendingUp,
  Users,
  MessageSquare,
  Plus,
  Wand2,
  Type,
  Palette,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
} from "lucide-react"

export default function LinkedInGeneratorPage() {
  const [postContent, setPostContent] = useState("")
  const [characterCount, setCharacterCount] = useState(0)
  const [selectedTone, setSelectedTone] = useState("professional")
  const [autoHashtags, setAutoHashtags] = useState(true)
  const [selectedHashtags, setSelectedHashtags] = useState(["#AI", "#ContentMarketing", "#LinkedIn"])

  const maxCharacters = 2000
  const optimalLength = { min: 150, max: 300 }

  const tones = [
    { id: "professional", name: "Professional", description: "Formal and business-focused" },
    { id: "conversational", name: "Conversational", description: "Friendly and approachable" },
    { id: "thought-leadership", name: "Thought Leadership", description: "Authoritative and insightful" },
    { id: "educational", name: "Educational", description: "Informative and helpful" },
    { id: "inspirational", name: "Inspirational", description: "Motivating and uplifting" },
  ]

  const contentTypes = [
    { id: "text", name: "Text Post", icon: Type },
    { id: "image", name: "Image Post", icon: ImageIcon },
    { id: "link", name: "Article Link", icon: Link2 },
    { id: "poll", name: "Poll", icon: BarChart3 },
  ]

  const suggestedHashtags = [
    { tag: "#AI", engagement: "High", trending: true },
    { tag: "#ContentMarketing", engagement: "Medium", trending: false },
    { tag: "#LinkedIn", engagement: "High", trending: true },
    { tag: "#DigitalMarketing", engagement: "Medium", trending: false },
    { tag: "#SocialMedia", engagement: "High", trending: false },
    { tag: "#Marketing", engagement: "Medium", trending: false },
    { tag: "#Business", engagement: "Low", trending: false },
    { tag: "#Technology", engagement: "High", trending: true },
  ]

  const recentPosts = [
    {
      id: 1,
      content: "Just published a new article about AI in content creation...",
      engagement: 245,
      date: "2024-01-15",
      status: "published",
    },
    {
      id: 2,
      content: "Excited to share insights from our latest marketing campaign...",
      engagement: 0,
      date: "2024-01-20",
      status: "scheduled",
    },
    {
      id: 3,
      content: "The future of social media is here, and it's powered by AI...",
      engagement: 0,
      date: "",
      status: "draft",
    },
  ]

  const handleContentChange = (value: string) => {
    setPostContent(value)
    setCharacterCount(value.length)
  }



  const handleLinkedInPostGenerated = (post: { content: string }) => {
    setPostContent(post.content);
    setCharacterCount(post.content.length);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6"><ResearchGather showGenerateBlogButton={false} showGenerateLinkedInPostButton={true} onLinkedInPostGenerated={handleLinkedInPostGenerated} showVisitSiteButton={false} /></div>
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold flex items-center">
                <Linkedin className="w-6 h-6 mr-3 text-blue-500" />
                LinkedIn Content Manager
              </h1>
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Posts This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">18</div>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +25% vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2,847</div>
              <p className="text-xs text-blue-400 flex items-center mt-1">
                <MessageSquare className="w-3 h-3 mr-1" />
                +12% this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Profile Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,234</div>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <Users className="w-3 h-3 mr-1" />
                +8% this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Best Performing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-white">AI Content Guide</div>
              <p className="text-xs text-gray-400 mt-1">245 engagements</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Creation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Post Generator */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  AI Content Generator
                </CardTitle>
                <CardDescription>Generate LinkedIn posts based on your Content DNA and current trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Type Selector */}
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {contentTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2 border-gray-700 hover:border-blue-500 bg-transparent"
                      >
                        <type.icon className="w-6 h-6" />
                        <span className="text-sm">{type.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Goal</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Share insights about AI in marketing, promote new blog post..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                {/* Tone Selection */}
                <div className="space-y-2">
                  <Label>Tone & Style</Label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.id} value={tone.id}>
                          <div>
                            <div className="font-medium">{tone.name}</div>
                            <div className="text-sm text-gray-400">{tone.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


              </CardContent>
            </Card>

            {/* Live Editor */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Post Editor</span>
                  <div className="flex items-center space-x-2 text-sm">
                    <span
                      className={`${characterCount > maxCharacters ? "text-red-400" : characterCount > optimalLength.max ? "text-yellow-400" : characterCount >= optimalLength.min ? "text-green-400" : "text-gray-400"}`}
                    >
                      {characterCount}
                    </span>
                    <span className="text-gray-500">/ {maxCharacters}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Editor */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="What's on your mind? Share your insights with your LinkedIn network..."
                    value={postContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="min-h-[200px] bg-gray-800 border-gray-700 resize-none"
                  />

                  {/* Character Count Indicator */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      {characterCount >= optimalLength.min && characterCount <= optimalLength.max && (
                        <span className="text-green-400 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Optimal length
                        </span>
                      )}
                      {characterCount > maxCharacters && (
                        <span className="text-red-400 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Exceeds character limit
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400">
                      Optimal: {optimalLength.min}-{optimalLength.max} characters
                    </span>
                  </div>
                </div>

                {/* AI Enhancement Tools */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                    <Palette className="w-4 h-4 mr-2" />
                    Adjust Tone
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                    <Target className="w-4 h-4 mr-2" />
                    Optimize Length
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enhance Hook
                  </Button>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label>Add Media (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors cursor-pointer">
                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload image or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {/* Publishing Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" className="border-gray-700 bg-transparent">
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button variant="outline" className="border-gray-700 bg-transparent">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Post Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hashtag Management */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  Hashtag Manager
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch checked={autoHashtags} onCheckedChange={setAutoHashtags} />
                  <Label className="text-sm">Auto-suggest hashtags</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Hashtags */}
                <div className="space-y-2">
                  <Label className="text-sm">Selected Hashtags ({selectedHashtags.length}/30)</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedHashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-600/20 text-blue-400 border-blue-600/30"
                      >
                        {hashtag}
                        <button className="ml-1 text-blue-300 hover:text-white">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Suggested Hashtags */}
                <div className="space-y-2">
                  <Label className="text-sm">Suggested Hashtags</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {suggestedHashtags.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.tag}</span>
                          {item.trending && (
                            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs ${
                              item.engagement === "High"
                                ? "text-green-400"
                                : item.engagement === "Medium"
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {item.engagement}
                          </span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Hashtag Input */}
                <div className="space-y-2">
                  <Label className="text-sm">Add Custom Hashtag</Label>
                  <div className="flex space-x-2">
                    <Input placeholder="#YourHashtag" className="bg-gray-800 border-gray-700 text-sm" />
                    <Button size="sm" variant="outline" className="border-gray-700 bg-transparent">
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-white line-clamp-2 mb-2">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={post.status === "published" ? "default" : "secondary"}
                          className={`text-xs ${
                            post.status === "published"
                              ? "bg-green-600"
                              : post.status === "scheduled"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                          }`}
                        >
                          {post.status}
                        </Badge>
                        {post.engagement > 0 && (
                          <span className="text-xs text-gray-400">{post.engagement} engagements</span>
                        )}
                      </div>
                      {post.date && <p className="text-xs text-gray-500 mt-1">{post.date}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Analytics */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Quick Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Best posting time</span>
                    <span className="text-sm text-white">9:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Avg. engagement rate</span>
                    <span className="text-sm text-green-400">4.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Top hashtag</span>
                    <span className="text-sm text-white">#AI</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full border-gray-700 bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
