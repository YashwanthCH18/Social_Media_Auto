"use client";

"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, Send } from 'lucide-react';

interface LinkedinPreviewProps {
  content: string;
}

const LinkedinPreview: React.FC<LinkedinPreviewProps> = ({ content }) => {
  return (
    <Card className="bg-white border-gray-200 w-full max-w-md shadow-lg rounded-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-base font-semibold text-gray-900">AI Content Team</CardTitle>
            <p className="text-xs text-gray-500">Promoted</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4 pt-4">
        <div className="flex space-x-4 text-gray-500 text-sm">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4 text-blue-600" />
            <span>123</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4 text-gray-600" />
            <span>45</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 className="h-4 w-4 text-gray-600" />
            <span>67</span>
          </div>
        </div>
        <div className="w-full border-t border-gray-200 pt-2 flex justify-around mt-2">
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
            <ThumbsUp className="h-5 w-5" />
            <span className="font-semibold">Like</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
            <Share2 className="h-5 w-5" />
            <span className="font-semibold">Share</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
            <Send className="h-5 w-5" />
            <span className="font-semibold">Send</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LinkedinPreview;
