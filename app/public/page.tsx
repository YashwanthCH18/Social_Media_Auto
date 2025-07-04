"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type User } from '@supabase/supabase-js'

interface Blog {
  id: string;
  title: string;
  status: string;
}

export default function UserBlogsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndBlogs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: blogData, error } = await supabase
          .from('blog_posts')
          .select('id, title, status')
          .eq('user_id', session.user.id)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blogs:', error);
        } else {
          setBlogs(blogData || []);
        }
      }
      setLoading(false);
    };

    fetchSessionAndBlogs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-10">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-10">
        <h1 className="text-2xl font-semibold">Please sign in to view your blogs.</h1>
      </main>
    )
  }

  if (blogs.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-10">
        <h1 className="text-2xl font-semibold">No published blogs found.</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Published Blogs</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {blogs.map((blog) => (
          <a
            key={blog.id}
            href={`/public/${blog.id}`}
            className="block bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="p-4 h-44 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold line-clamp-2 mb-2">{blog.title}</h2>
              <span className="text-sm text-gray-600 mt-auto capitalize">{blog.status}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
