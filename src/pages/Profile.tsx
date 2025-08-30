import { useAuthStore } from '@/store/authStore';
import { useBlogStore } from '@/store/blogStore';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Navigate } from 'react-router-dom';
import { PenSquare, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export const Profile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getUserBlogs } = useBlogStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  const userBlogs = getUserBlogs(user.id);
  const stats = {
    total: userBlogs.length,
    approved: userBlogs.filter(blog => blog.status === 'approved').length,
    pending: userBlogs.filter(blog => blog.status === 'pending').length,
    rejected: userBlogs.filter(blog => blog.status === 'rejected').length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.isAdmin && (
              <Badge variant="secondary" className="mt-2">
                Administrator
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* My Posts Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Blog Posts</CardTitle>
                <CardDescription>
                  Manage and track your published content
                </CardDescription>
              </div>
              <Button asChild variant="accent">
                <Link to="/submit">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Write New Post
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userBlogs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {userBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    showStatus={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <PenSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your thoughts and ideas with the world.
                </p>
                <Button asChild variant="accent">
                  <Link to="/submit">
                    <PenSquare className="w-4 h-4 mr-2" />
                    Write Your First Post
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};