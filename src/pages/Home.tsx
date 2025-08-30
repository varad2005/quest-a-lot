import { useBlogStore } from '@/store/blogStore';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, PenSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Home = () => {
  const { getApprovedBlogs, getTrendingBlogs, likeBlog } = useBlogStore();
  const { isAuthenticated } = useAuthStore();
  
  const approvedBlogs = getApprovedBlogs();
  const trendingBlogs = getTrendingBlogs();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-background via-muted/20 to-accent-light/10">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Share Your{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Ideas
              </span>{' '}
              with the World
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join our community of writers and readers. Discover amazing stories,
              share your thoughts, and connect with like-minded people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
              <Button asChild variant="hero">
                <Link to="/submit">
                  <PenSquare className="w-5 h-5 mr-2" />
                  Start Writing
                </Link>
              </Button>
              ) : (
                <>
                <Button asChild variant="hero">
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
                  <Button variant="outline" asChild>
                    <Link to="/auth?mode=login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Trending Section */}
        {trendingBlogs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h2 className="text-3xl font-bold">Trending Posts</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {trendingBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onLike={likeBlog}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Latest Posts</h2>
            </div>
          </div>
          
          {approvedBlogs.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {approvedBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onLike={likeBlog}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <PenSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your story with the community.
              </p>
              {isAuthenticated && (
                <Button asChild variant="accent">
                  <Link to="/submit">Write the First Post</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};