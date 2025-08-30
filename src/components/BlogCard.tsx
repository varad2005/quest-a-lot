import { Link } from 'react-router-dom';
import { Blog } from '@/store/blogStore';
import { Heart, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogCardProps {
  blog: Blog;
  onLike?: (id: string) => void;
  showStatus?: boolean;
}

export const BlogCard = ({ blog, onLike, showStatus = false }: BlogCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: Blog['status']) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'rejected':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <article className="blog-card group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/blog/${blog.id}`}>
              <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {blog.title}
              </h2>
            </Link>
            <p className="text-muted-foreground mt-2 leading-relaxed line-clamp-3">
              {blog.excerpt}
            </p>
          </div>
          {showStatus && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                blog.status
              )}`}
            >
              {blog.status}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{blog.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(blog.id)}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className="w-4 h-4 mr-1" />
              {blog.likes}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};