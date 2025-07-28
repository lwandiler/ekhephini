import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Music, Headphones, Mail, Phone } from 'lucide-react';
import { StationContext } from '@/contexts/StationContext';

const Footer = () => {
  const { settings } = useContext(StationContext);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex justify-center mb-4 group">
              <img 
                src={settings.logoUrl} 
                alt={settings.stationName}
                className="w-12 h-12 object-contain transform transition-all duration-300 group-hover:scale-110"
              />
            </div>
            <p className="text-gray-300 leading-relaxed">
              {settings.stationDescription}
            </p>
            <div className="flex space-x-4">
              {settings.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-all duration-300">
                  <Facebook size={18} className="text-white" />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-all duration-300">
                  <Twitter size={18} className="text-white" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-500 flex items-center justify-center transition-all duration-300">
                  <Instagram size={18} className="text-white" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                  <Youtube size={18} className="text-white" />
                </a>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6 text-purple-300 border-b border-purple-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Music className="h-4 w-4" />Home</Link></li>
              <li><Link to="/shows" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Music className="h-4 w-4" />Shows</Link></li>
              <li><Link to="/podcasts" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Headphones className="h-4 w-4" />Podcasts</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2">News</Link></li>
              <li><Link to="/announcements" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2">Announcements</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6 text-purple-300 border-b border-purple-700 pb-2">Connect With Us</h3>
            <ul className="space-y-3">
              {settings.socialLinks.facebook && (
                <li><a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Facebook size={16} /> Facebook</a></li>
              )}
              {settings.socialLinks.twitter && (
                <li><a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Twitter size={16} /> Twitter</a></li>
              )}
              {settings.socialLinks.instagram && (
                <li><a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Instagram size={16} /> Instagram</a></li>
              )}
              {settings.socialLinks.youtube && (
                <li><a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Youtube size={16} /> YouTube</a></li>
              )}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6 text-purple-300 border-b border-purple-700 pb-2">Contact</h3>
            <address className="not-italic text-gray-300 space-y-3">
              <p className="flex items-center gap-2">{settings.stationName}</p>
              <p className="flex items-center gap-2">Broadcasting Station</p>
              {settings.contactInfo.email && (
                <p className="flex items-center gap-2 mt-4"><Mail size={16} className="text-purple-400" /> {settings.contactInfo.email}</p>
              )}
              {settings.contactInfo.phone && (
                <p className="flex items-center gap-2"><Phone size={16} className="text-purple-400" /> {settings.contactInfo.phone}</p>
              )}
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">© {currentYear} {settings.stationName}. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-purple-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
