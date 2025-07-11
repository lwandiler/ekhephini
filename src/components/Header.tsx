
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Radio, User, LogOut, BarChart3 } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { themeOptions } = useContext(ThemeContext);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-lg relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Radio size={24} className="text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">Click Radio</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-lg">
            <Link to="/" className="text-white font-medium hover:text-purple-300 transition-colors">Home</Link>
            <Link to="/shows" className="text-white font-medium hover:text-purple-300 transition-colors">Shows</Link>
            <Link to="/podcasts" className="text-white font-medium hover:text-purple-300 transition-colors">Podcasts</Link>
            <Link to="/announcements" className="text-white font-medium hover:text-purple-300 transition-colors">Announcements</Link>
            <Link to="/news" className="text-white font-medium hover:text-purple-300 transition-colors">News</Link>
            <Link to="/charts" className="text-white font-medium hover:text-purple-300 transition-colors flex items-center">
              <BarChart3 size={18} className="mr-1" />
              Charts
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <Avatar className="h-9 w-9 ring-2 ring-purple-400">
                      <AvatarImage src="" alt={user.email || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                        {user.email ? user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-purple-500 text-white">
                  <DropdownMenuItem className="cursor-default hover:bg-gray-800">
                    <User className="mr-2 h-4 w-4 text-purple-400" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={() => signOut()} className="hover:bg-gray-800">
                    <LogOut className="mr-2 h-4 w-4 text-purple-400" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <Avatar className="h-8 w-8 ring-2 ring-purple-400">
                      <AvatarImage src="" alt={user.email || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                        {user.email ? user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-purple-500 text-white">
                  <DropdownMenuItem className="cursor-default hover:bg-gray-800">
                    <User className="mr-2 h-4 w-4 text-purple-400" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={() => signOut()} className="hover:bg-gray-800">
                    <LogOut className="mr-2 h-4 w-4 text-purple-400" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="secondary" size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  Sign In
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} className="text-purple-300" /> : <Menu size={24} className="text-purple-300" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4 text-lg">
            <Link to="/" className="text-white font-medium hover:text-purple-300 transition-colors" onClick={toggleMenu}>Home</Link>
            <Link to="/shows" className="text-white font-medium hover:text-purple-300 transition-colors" onClick={toggleMenu}>Shows</Link>
            <Link to="/podcasts" className="text-white font-medium hover:text-purple-300 transition-colors" onClick={toggleMenu}>Podcasts</Link>
            <Link to="/announcements" className="text-white font-medium hover:text-purple-300 transition-colors" onClick={toggleMenu}>Announcements</Link>
            <Link to="/news" className="text-white font-medium hover:text-purple-300 transition-colors" onClick={toggleMenu}>News</Link>
            <Link to="/charts" className="text-white font-medium hover:text-purple-300 transition-colors flex items-center" onClick={toggleMenu}>
              <BarChart3 size={18} className="mr-1" />
              Charts
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
