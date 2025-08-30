import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { PenSquare, User, LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <PenSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            BlogHub
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
              Write
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden md:flex"
              >
                <Link to="/submit">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Write
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/submit">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Write
                    </Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/auth?mode=login">Sign In</Link>
              </Button>
              <Button asChild variant="hero">
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};