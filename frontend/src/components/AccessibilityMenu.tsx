import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility, X, ZoomIn, ZoomOut, Type, Contrast, Moon, Sun, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme, actualTheme } = useTheme();

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      toast({
        title: "Font Size Increased",
        description: `Font size is now ${newSize}%`,
      });
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      toast({
        title: "Font Size Decreased",
        description: `Font size is now ${newSize}%`,
      });
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = '100%';
    toast({
      title: "Font Size Reset",
      description: "Font size restored to default",
    });
  };

  const toggleHighContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    if (newContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    toast({
      title: newContrast ? "High Contrast Enabled" : "High Contrast Disabled",
      description: newContrast ? "Colors adjusted for better visibility" : "Normal colors restored",
    });
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    
    const messages = {
      light: { title: "Light Mode", description: "Switched to light theme" },
      dark: { title: "Dark Mode", description: "Switched to dark theme" },
      system: { title: "System Theme", description: "Following your system preference" }
    };
    
    toast(messages[nextTheme]);
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (theme === 'system') return `System (${actualTheme === 'dark' ? 'Dark' : 'Light'})`;
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
        size="icon"
        aria-label="Accessibility Options"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      {/* Accessibility Menu */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-2xl z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Accessibility</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Adjust settings for better accessibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Font Size Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4" />
                <span>Text Size: {fontSize}%</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 80}
                  className="flex-1"
                >
                  <ZoomOut className="h-4 w-4 mr-1" />
                  Smaller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFontSize}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 150}
                  className="flex-1"
                >
                  <ZoomIn className="h-4 w-4 mr-1" />
                  Larger
                </Button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Contrast className="h-4 w-4" />
                <span>High Contrast</span>
              </div>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                className="w-full"
              >
                {highContrast ? "Disable" : "Enable"} High Contrast
              </Button>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                {getThemeIcon()}
                <span>Theme: {getThemeLabel()}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={cycleTheme}
                className="w-full"
              >
                {getThemeIcon()}
                <span className="ml-2">Switch Theme</span>
              </Button>
              <p className="text-xs text-muted-foreground">
                Cycles: Light → Dark → System
              </p>
            </div>

            {/* Info */}
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p>These settings are saved for your current session.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AccessibilityMenu;
