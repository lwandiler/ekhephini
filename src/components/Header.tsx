
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Radio, User, LogOut } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { StationContext } from '@/contexts/StationContext';
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
  const { settings } = useContext(StationContext);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg relative z-10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
              <img 
                src={settings.logoUrl} 
                alt={settings.stationName} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary">{settings.stationName}</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-lg">
            <Link to="/" className="text-gray-700 font-medium hover:text-green-600 transition-colors">Home</Link>
            
            <Link to="/podcasts" className="text-gray-700 font-medium hover:text-green-600 transition-colors">Podcasts</Link>
            <Link to="/catchup" className="text-gray-700 font-medium hover:text-green-600 transition-colors">Catch Up</Link>
            <Link to="/announcements" className="text-gray-700 font-medium hover:text-green-600 transition-colors">Announcements</Link>
            <Link to="/news" className="text-gray-700 font-medium hover:text-green-600 transition-colors">News</Link>
            {user && (
              <Link to="/admin" className="text-gray-700 font-medium hover:text-green-600 transition-colors">Admin</Link>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <Avatar className="h-9 w-9 ring-2 ring-green-400">
                      <AvatarImage src="" alt={user.email || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-500 text-white">
                        {user.email ? user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-700">
                  <DropdownMenuItem className="cursor-default hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4 text-green-600" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={() => signOut()} className="hover:bg-gray-100">
                    <LogOut className="mr-2 h-4 w-4 text-green-600" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="text-gray-700 font-medium hover:text-green-600 transition-colors">Sign In</Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <Avatar className="h-8 w-8 ring-2 ring-green-400">
                      <AvatarImage src="" alt={user.email || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-500 text-white">
                        {user.email ? user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-700">
                  <DropdownMenuItem className="cursor-default hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4 text-green-600" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={() => signOut()} className="hover:bg-gray-100">
                    <LogOut className="mr-2 h-4 w-4 text-green-600" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            <Button
              variant="ghost" 
              size="icon" 
              className="text-gray-700 hover:bg-gray-100" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} className="text-green-600" /> : <Menu size={24} className="text-green-600" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4 text-lg border-t border-gray-200 mt-4">
            <Link to="/" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>Home</Link>
            
            <Link to="/podcasts" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>Podcasts</Link>
            <Link to="/catchup" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>Catch Up</Link>
            <Link to="/announcements" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>Announcements</Link>
            <Link to="/news" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>News</Link>
            {user && (
              <Link to="/admin" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>Admin</Link>
            )}
            {!user && (
              <Link to="/auth" className="text-gray-700 font-medium hover:text-green-600 transition-colors" onClick={toggleMenu}>Sign In</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
