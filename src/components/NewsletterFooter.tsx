import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const NewsletterFooter = () => {
  return (
    <section className="w-full bg-[#004995] py-16">
      <div className="container mx-auto px-4 flex justify-end">
        <div className="flex items-center gap-6">
          <h3 className="text-white font-asap text-[18px] font-bold">Follow Us</h3>
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-300 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-red-300 transition-colors"
            >
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterFooter;