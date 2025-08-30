import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useBlogStore } from '@/store/blogStore';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, Send } from 'lucide-react';

export const Submit = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addBlog } = useBlogStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both title and content.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const excerpt = formData.content.substring(0, 150) + '...';
      
      addBlog({
        title: formData.title,
        content: formData.content,
        excerpt,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        status: 'pending',
        likes: 0,
      });

      toast({
        title: 'Blog Submitted!',
        description: 'Your blog post has been submitted for review.',
      });

      navigate('/profile');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto">
            <PenSquare className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Write a New Post</h1>
            <p className="text-muted-foreground">
              Share your thoughts and ideas with the community
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-gradient-card shadow-custom-lg border-0">
          <CardHeader>
            <CardTitle>Create Your Blog Post</CardTitle>
            <CardDescription>
              Your post will be reviewed by our team before being published.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter a compelling title for your post"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your blog post content here. Be creative and engaging!"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[400px] resize-none"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {formData.content.length} characters
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">
                    {formData.title || 'Your title will appear here'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {formData.content 
                      ? formData.content.substring(0, 200) + (formData.content.length > 200 ? '...' : '')
                      : 'Your content preview will appear here as you type'
                    }
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="hero"
                  className="flex-1"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};