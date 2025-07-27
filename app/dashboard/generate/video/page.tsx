"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Video, Sparkles } from "lucide-react"

const VIDEO_WEBHOOK_URL = "https://spmsuccess.app.n8n.cloud/webhook/video-generator";
const SCRIPT_WEBHOOK_URL = "https://spmsuccess.app.n8n.cloud/webhook/generate-video-script";

export default function VideoGeneratorPage() {
  const [scriptIdea, setScriptIdea] = useState("Introduce a new Italian pasta recipe with excitement.");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptError, setScriptError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [isSendingPrompt, setIsSendingPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");
  const [promptError, setPromptError] = useState("");

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    setScriptError("");
    setPrompt(""); // Clear previous script

    try {
      const response = await fetch(SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: scriptIdea }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = responseText;
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.Output || errorJson.message || responseText;
        } catch (jsonError) {
          // Ignore json parsing error, use the raw text
        }
        throw new Error(errorMessage || 'Failed to generate script.');
      }

      if (responseText) {
        const result = JSON.parse(responseText);
        setPrompt(result.Output || "");
      } else {
        setPrompt(""); // Set prompt to empty if response is empty
      }

    } catch (e: any) {
      setScriptError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsSendingPrompt(true);
    setPromptMessage("");
    setPromptError("");

    try {
      const response = await fetch(VIDEO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: prompt }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = responseText;
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || responseText;
        } catch (jsonError) {
          // Use raw text
        }
        throw new Error(errorMessage || 'Failed to send prompt.');
      }

      if (responseText) {
        const result = JSON.parse(responseText);
        setPromptMessage(result.message || "Successfully sent prompt for video generation!");
      } else {
        setPromptMessage("Successfully sent prompt for video generation!"); // Assume success on empty 2xx response
      }

    } catch (e: any) {
      setPromptError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsSendingPrompt(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white p-4">
      <Card className="w-full max-w-2xl bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Video className="w-6 h-6 mr-3 text-purple-500" />
            Video Generator
          </CardTitle>
          <CardDescription>Generate a script, then send it to the video generator.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Script Generation Section */}
          <div className="space-y-2 p-4 border border-gray-700 rounded-lg">
            <Label htmlFor="script-idea">1. Generate a Script</Label>
            <Textarea
              id="script-idea"
              value={scriptIdea}
              onChange={(e) => setScriptIdea(e.target.value)}
              placeholder="e.g., A 30-second ad for a new coffee brand..."
              className="bg-gray-800 border-gray-700 min-h-[100px]"
            />
            <Button
              onClick={handleGenerateScript}
              disabled={isGeneratingScript || !scriptIdea}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingScript ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Script...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Generate Script</>
              )}
            </Button>
            {scriptError && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-md">
                {scriptError}
              </div>
            )}
          </div>

          {/* Video Prompt Section */}
          <div className="space-y-2 p-4 border border-gray-700 rounded-lg">
            <Label htmlFor="prompt-input">2. Video Prompt (from generated script)</Label>
            <Textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Your generated script will appear here..."
              className="bg-gray-800 border-gray-700 font-mono text-sm min-h-[150px]"
              readOnly={isGeneratingScript}
            />
             <Button
              onClick={handleGenerateVideo}
              disabled={isSendingPrompt || !prompt}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSendingPrompt ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending Prompt...</>
              ) : ('Generate Video')}
            </Button>
            {promptError && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-md">
                {promptError}
              </div>
            )}
            {promptMessage && (
              <div className="text-green-500 text-sm text-center p-2 bg-green-500/10 rounded-md">
                {promptMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
