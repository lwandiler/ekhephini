import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Music, Headphones, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 overflow-hidden">
                <img 
                  src="/lovable-uploads/38150e55-823d-433a-8672-ae40d2fcf2da.png" 
                  alt="Moutse Community Radio"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-300 to-green-400">Moutse</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your favorite radio station bringing you the best music, shows, and entertainment 24/7. Tune in and experience the sound of tomorrow, today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-all duration-300">
                <Facebook size={18} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-all duration-300">
                <Twitter size={18} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-500 flex items-center justify-center transition-all duration-300">
                <Instagram size={18} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                <Youtube size={18} className="text-white" />
              </a>
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
              <li><a href="#" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Facebook size={16} /> Facebook</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Twitter size={16} /> Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Instagram size={16} /> Instagram</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"><Youtube size={16} /> YouTube</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6 text-purple-300 border-b border-purple-700 pb-2">Contact</h3>
            <address className="not-italic text-gray-300 space-y-3">
              <p className="flex items-center gap-2">123 Broadcasting Avenue</p>
              <p className="flex items-center gap-2">Radio City, RC 10001</p>
              <p className="flex items-center gap-2 mt-4"><Mail size={16} className="text-purple-400" /> info@clickradio.com</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-purple-400" /> (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">© {currentYear} Moutse. All Rights Reserved.</p>
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
