import { create } from 'zustand';

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogState {
  blogs: Blog[];
  addBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlogStatus: (id: string, status: Blog['status']) => void;
  likeBlog: (id: string) => void;
  getApprovedBlogs: () => Blog[];
  getTrendingBlogs: () => Blog[];
  getUserBlogs: (userId: string) => Blog[];
  getPendingBlogs: () => Blog[];
}

// Mock data
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we\'ll explore the fundamentals of React development...',
    excerpt: 'Learn the basics of React development and start building modern web applications.',
    author: { id: '2', name: 'John Doe', email: 'john@example.com' },
    status: 'approved',
    likes: 42,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    content: 'TypeScript has evolved significantly over the years, introducing powerful patterns that can help you write more maintainable and type-safe code...',
    excerpt: 'Explore advanced TypeScript patterns and techniques for better code quality.',
    author: { id: '3', name: 'Jane Smith', email: 'jane@example.com' },
    status: 'approved',
    likes: 38,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Building Scalable APIs',
    content: 'When building APIs that need to scale, there are several important considerations to keep in mind...',
    excerpt: 'Best practices for creating APIs that can handle growing user bases.',
    author: { id: '4', name: 'Mike Johnson', email: 'mike@example.com' },
    status: 'approved',
    likes: 56,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

export const useBlogStore = create<BlogState>()((set, get) => ({
  blogs: mockBlogs,
  
  addBlog: (blogData) => {
    const newBlog: Blog = {
      ...blogData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ blogs: [...state.blogs, newBlog] }));
  },
  
  updateBlogStatus: (id, status) => {
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id === id ? { ...blog, status, updatedAt: new Date() } : blog
      ),
    }));
  },
  
  likeBlog: (id) => {
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
      ),
    }));
  },
  
  getApprovedBlogs: () => {
    return get().blogs.filter((blog) => blog.status === 'approved');
  },
  
  getTrendingBlogs: () => {
    return get().blogs
      .filter((blog) => blog.status === 'approved')
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  },
  
  getUserBlogs: (userId) => {
    return get().blogs.filter((blog) => blog.author.id === userId);
  },
  
  getPendingBlogs: () => {
    return get().blogs.filter((blog) => blog.status === 'pending');
  },
}));