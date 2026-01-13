import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">MedPredict</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API
            </a>
            <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#api" className="text-sm text-muted-foreground hover:text-foreground">
                API
              </a>
              <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground">
                Architecture
              </a>
              <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground">
                Demo
              </a>
              <div className="flex gap-4 pt-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
