import { useAuthStore } from '@/store/authStore';
import { useBlogStore } from '@/store/blogStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, FileText, Users, TrendingUp } from 'lucide-react';

export const Admin = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getPendingBlogs, updateBlogStatus, getApprovedBlogs } = useBlogStore();
  const { toast } = useToast();

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const pendingBlogs = getPendingBlogs();
  const approvedBlogs = getApprovedBlogs();

  const handleApprove = (blogId: string, title: string) => {
    updateBlogStatus(blogId, 'approved');
    toast({
      title: 'Blog Approved',
      description: `"${title}" has been approved and published.`,
    });
  };

  const handleReject = (blogId: string, title: string) => {
    updateBlogStatus(blogId, 'rejected');
    toast({
      title: 'Blog Rejected',
      description: `"${title}" has been rejected.`,
      variant: 'destructive',
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage blog posts and community content
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingBlogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting moderation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{approvedBlogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Live on the platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {approvedBlogs.reduce((total, blog) => total + blog.likes, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total likes received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Pending Reviews
            </CardTitle>
            <CardDescription>
              Review and moderate submitted blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBlogs.length > 0 ? (
              <div className="space-y-6">
                {pendingBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="border rounded-lg p-6 space-y-4 bg-gradient-card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {blog.author.name}</span>
                          <span>•</span>
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-warning bg-warning/10">
                        Pending
                      </Badge>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">Content Preview:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {blog.content.substring(0, 300)}
                        {blog.content.length > 300 && '...'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        onClick={() => handleApprove(blog.id, blog.title)}
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(blog.id, blog.title)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  There are no pending blog posts to review at the moment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest approved blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedBlogs.length > 0 ? (
              <div className="space-y-4">
                {approvedBlogs.slice(-5).reverse().map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card/50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{blog.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        By {blog.author.name} • {formatDate(blog.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        {blog.likes}
                      </div>
                      <Badge variant="secondary" className="text-success bg-success/10">
                        Published
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No published posts yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};