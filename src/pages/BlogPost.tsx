import { useParams, Navigate, Link } from 'react-router-dom';
import { useBlogStore } from '@/store/blogStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Calendar, User, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, likeBlog } = useBlogStore();
  const { toast } = useToast();

  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return <Navigate to="/404" replace />;
  }

  // Only show approved blogs to non-admin users
  if (blog.status !== 'approved') {
    return <Navigate to="/" replace />;
  }

  const handleLike = () => {
    likeBlog(blog.id);
    toast({
      title: 'Liked!',
      description: 'Thanks for showing your appreciation!',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Blog post link has been copied to your clipboard.',
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent-light/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Back Navigation */}
          <Button variant="ghost" asChild className="group">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </Button>

          {/* Article Header */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                Published
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                {blog.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {blog.excerpt}
              </p>
            </div>

            {/* Author & Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {blog.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{blog.author.name}</p>
                  <p className="text-sm">{blog.author.email}</p>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-8 bg-border"></div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{blog.likes} likes</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handleLike}
                variant="outline"
                className="hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4 mr-2" />
                Like ({blog.likes})
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <Card className="bg-gradient-card shadow-custom-lg border-0">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-8 text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Author Bio */}
          <Card className="bg-gradient-card/50 border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0">
                  {blog.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">About {blog.author.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A passionate writer sharing insights and stories with the BlogHub community.
                    Connect with them to read more of their work and engage in meaningful discussions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Enjoyed this post?</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleLike}
                  variant="accent"
                >
                <Heart className="w-4 h-4 mr-2" />
                Show Some Love
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share with Friends
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};