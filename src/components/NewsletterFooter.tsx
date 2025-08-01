import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const NewsletterFooter = () => {
  return (
    <section className="w-full bg-[#004995] py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-white font-asap text-[32px] font-bold leading-normal mb-8">
          Contact Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          <div className="space-y-2">
            <h3 className="font-asap text-[18px] font-bold mb-3">Contact Person</h3>
            <p className="font-asap text-[16px]">PHUMLANI Xanasi</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-asap text-[18px] font-bold mb-3">Get In Touch</h3>
            <div className="flex items-center justify-center gap-2">
              <Phone size={16} />
              <p className="font-asap text-[16px]">0742578799</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail size={16} />
              <p className="font-asap text-[16px]">phumlanichrist@gmail.com</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-asap text-[18px] font-bold mb-3">Visit Us</h3>
            <div className="flex items-center justify-center gap-2">
              <MapPin size={16} />
              <div className="text-center">
                <p className="font-asap text-[16px]">Barkly East</p>
                <p className="font-asap text-[16px]">Joe Gabi District</p>
                <p className="font-asap text-[16px]">Eastern Cape</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-asap text-[18px] font-bold mb-3">Listen & Visit</h3>
            <p className="font-asap text-[18px] font-bold">96.3 FM</p>
            <div className="flex items-center justify-center gap-2">
              <Globe size={16} />
              <p className="font-asap text-[16px]">www.khephinifm.co.za</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterFooter;
