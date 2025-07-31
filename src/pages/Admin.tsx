
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import ThemeSelector from '@/components/ThemeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';


const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simple authentication - replace with your actual auth logic
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      setError('Invalid credentials. Use admin/password');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password.",
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    setUsername('');
    setPassword('');
    setError('');
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
              <h1 className="text-3xl font-bold">Radio Station Admin</h1>
              <Button onClick={handleLogout} variant="outline">
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
                      Demo account: admin / password
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-white">
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
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
      
    </div>
  );
};

export default Admin;
