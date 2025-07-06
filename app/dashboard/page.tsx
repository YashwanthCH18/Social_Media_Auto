"use client";

import Link from "next/link";
import GeneratorCard from "@/components/Dashboard/generator-card";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [isLoading, user, router]);

  const generators = [
    {
      tag: "Content",
      title: "Blog Generator",
      description: "Generate full-length blog content tailored to your Content DNA.",
      href: "/dashboard/generate/blog",
            imageUrl: "/download.png",
      hoverTheme: 'blog' as const,
    },
    {
      tag: "Social",
      title: "LinkedIn Post Generator",
      description: "Create short, scroll-stopping posts for LinkedIn.",
      href: "/dashboard/generate/linkedin",
      imageUrl: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      hoverTheme: 'linkedin' as const,
    },
    {
      tag: "Media",
      title: "Video Generator",
      description: "Create scripts for Instagram Reels and YouTube Shorts.",
      href: "/dashboard/generate/video",
      imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      hoverTheme: 'video' as const,
    },
  ];

  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full gap-12">
      {generators.map((generator, index) => (
        <Link href={generator.href} key={index}>
            <GeneratorCard
              tag={generator.tag}
              title={generator.title}
              description={generator.description}
              imageUrl={generator.imageUrl}
              hoverTheme={generator.hoverTheme}
            />
        </Link>
      ))}
    </div>
  );
}
