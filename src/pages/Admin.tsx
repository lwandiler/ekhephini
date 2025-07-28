
import { useEffect, useState, useContext } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import ThemeSelector from '@/components/ThemeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { StationContext } from '@/contexts/StationContext';
import { useHomeTheme } from '@/hooks/useHomeTheme';
import { supabase } from '@/integrations/supabase/client';
import { adminService, AdminUser } from '@/services/api/adminService';

// Define banner interface for type consistency across components
export interface Banner {
  id: number;
  title: string;
  image: string;
  url: string;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { settings, setSettings } = useContext(StationContext);
  const { themeOptions, handleThemeChange, handleThemeOptionsChange } = useHomeTheme();

  // Authentication logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await adminService.login({ username, password });
      
      if (result.success && result.user) {
        setIsLoggedIn(true);
        setCurrentUser(result.user);
        
        // Store in session storage so refresh doesn't log user out
        sessionStorage.setItem('radioAdminLoggedIn', 'true');
        sessionStorage.setItem('radioAdminUser', JSON.stringify(result.user));
        
        // Also sign in to Supabase with anonymous auth to enable storage uploads
        try {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Supabase auth error:", error);
          } else {
            console.log("Anonymous auth successful:", data.session?.user.id);
          }
        } catch (error) {
          console.error("Failed to authenticate with Supabase:", error);
        }
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.name}!`,
        });
      } else {
        setError(result.error || 'Invalid username or password.');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error || "Invalid username or password.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      if (sessionStorage.getItem('radioAdminLoggedIn') === 'true') {
        setIsLoggedIn(true);
        const storedUser = sessionStorage.getItem('radioAdminUser');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            // Fallback for old format
            setCurrentUser({ name: storedUser } as AdminUser);
          }
        }
        
        // Check Supabase auth status
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // If no active session, create anonymous session
          try {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) {
              console.error("Supabase auth error:", error);
            } else {
              console.log("Anonymous auth refreshed:", data.session?.user.id);
            }
          } catch (authError) {
            console.error("Failed to authenticate with Supabase:", authError);
          }
        } else {
          console.log("Existing Supabase session found:", data.session.user.id);
        }
      }
      
      console.log('Admin: Login state check:', { 
        isLoggedIn: sessionStorage.getItem('radioAdminLoggedIn') === 'true',
        user: currentUser
      });
    };
    
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem('radioAdminLoggedIn');
    sessionStorage.removeItem('radioAdminUser');
    
    // Also sign out from Supabase
    try {
      await supabase.auth.signOut();
      console.log("Signed out of Supabase");
    } catch (error) {
      console.error("Failed to sign out from Supabase:", error);
    }
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {isLoggedIn ? (
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-purple-800">Admin Dashboard</h1>
                {currentUser && (
                  <p className="text-gray-600">Logged in as: {currentUser.name}</p>
                )}
              </div>
              <Button onClick={handleLogout} variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                Log Out
              </Button>
            </div>
            <AdminDashboard />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-md bg-white border-green-200 shadow-lg">
              <CardHeader className="space-y-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center text-white">Click Radio Admin</CardTitle>
                <CardDescription className="text-center text-green-100">
                  Enter your credentials to access the admin dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-6 bg-white">
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-black">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="Enter your username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-green-200 focus-visible:ring-green-500 bg-white text-black"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-black">Password</Label>
                      <a href="#" className="text-sm text-green-700 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-green-200 focus-visible:ring-green-500 bg-white text-black"
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-black">
                      Demo accounts:
                    </p>
                    <ul className="text-xs text-black list-disc pl-5 mt-1">
                      <li>Username: admin / Password: password123</li>
                      <li>Username: manager / Password: manager456</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-white">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
      
      {/* Add ThemeSelector for admin users with explicit check */}
      {isLoggedIn && (
        <>
          {console.log('Admin: Rendering ThemeSelector, user is logged in')}
          <ThemeSelector 
            currentTheme={themeOptions.type} 
            onThemeChange={handleThemeChange}
            themeOptions={themeOptions}
            onThemeOptionsChange={handleThemeOptionsChange} 
          />
        </>
      )}
      
      {/* Always render the theme selector when in development mode */}
      {process.env.NODE_ENV === 'development' && !isLoggedIn && (
        <div className="fixed bottom-4 right-4 bg-red-100 p-2 text-xs rounded">
          Dev mode: Theme selector would appear here when logged in
        </div>
      )}
    </div>
  );
};

export default Admin;
