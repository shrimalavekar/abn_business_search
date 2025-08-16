import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SearchBar } from './SearchBar';
import { Settings, Database, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onToggleSidebar: () => void;
}

export function Header({ 
  searchValue, 
  onSearchChange, 
  showAdvanced, 
  onToggleAdvanced, 
  onToggleSidebar 
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" px-4">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between py-4">
          {/* Brand and navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">BusinessSearch</h1>
                <p className="text-xs text-muted-foreground">Australian Business Directory</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              v2.0
            </Badge>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={onToggleAdvanced}
              className={`flex items-center gap-2 transition-all duration-200 ${
                showAdvanced ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/auth'}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Search section */}
        <div className="pb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={searchValue}
                  onChange={onSearchChange}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}