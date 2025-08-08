import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PrivacyLegalModal from '@/components/PrivacyLegalModal';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_name: string | null;
  icon_name: string | null;
  is_active: boolean;
}

const NewsletterFooter = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('platform');
      
      if (error) {
        console.error('Error fetching social links:', error);
        return;
      }
      
      setSocialLinks(data || []);
    };

    fetchSocialLinks();
  }, []);

  const getIcon = (iconName: string | null) => {
    switch (iconName?.toLowerCase()) {
      case 'facebook':
        return <Facebook size={24} />;
      case 'twitter':
        return <Twitter size={24} />;
      case 'instagram':
        return <Instagram size={24} />;
      case 'youtube':
        return <Youtube size={24} />;
      default:
        return <Facebook size={24} />;
    }
  };

  const getHoverColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'hover:text-blue-300';
      case 'twitter':
        return 'hover:text-blue-300';
      case 'instagram':
        return 'hover:text-pink-300';
      case 'youtube':
        return 'hover:text-red-300';
      default:
        return 'hover:text-blue-300';
    }
  };

  return (
    <section className="w-full bg-[#004995] py-16">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Privacy & Legal Link */}
        <div>
          <PrivacyLegalModal>
            <button className="text-white hover:text-blue-200 transition-colors font-asap text-[16px] underline bg-transparent border-none cursor-pointer">
              Privacy & Legal
            </button>
          </PrivacyLegalModal>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center gap-6">
          <h3 className="text-white font-asap text-[18px] font-bold">Follow Us</h3>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-white transition-colors ${getHoverColor(link.platform)}`}
                aria-label={link.display_name || link.platform}
              >
                {getIcon(link.icon_name)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterFooter;