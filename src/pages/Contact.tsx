import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';

const Contact = () => {
  return (
    <div className="w-full min-h-screen bg-white font-asap">
      <RadioNavigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-black font-asap text-[40px] font-bold leading-normal mb-8 text-center">
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-black font-asap text-[25px] font-bold leading-normal mb-4">
                Get In Touch
              </h2>
              <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-6">
                We'd love to hear from you. Contact Ekhephini Community Radio for any inquiries or feedback.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-black font-asap text-[18px] font-bold leading-normal">Phone</h3>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal">+27 (0) 45 971 0000</p>
                </div>
                
                <div>
                  <h3 className="text-black font-asap text-[18px] font-bold leading-normal">Email</h3>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal">info@ekhephinifm.co.za</p>
                </div>
                
                <div>
                  <h3 className="text-black font-asap text-[18px] font-bold leading-normal">Address</h3>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal">
                    Barkly East<br />
                    Joe Gabi District<br />
                    Eastern Cape, South Africa
                  </p>
                </div>
                
                <div>
                  <h3 className="text-black font-asap text-[18px] font-bold leading-normal">Frequency</h3>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal">96.3 FM</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-black font-asap text-[25px] font-bold leading-normal mb-4">
                Send Us a Message
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-black font-asap text-[16px] font-bold leading-normal mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-300 text-black placeholder-gray-500 font-asap text-[14px] font-normal focus:outline-none focus:ring-2 focus:ring-[#004995]"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-black font-asap text-[16px] font-bold leading-normal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-300 text-black placeholder-gray-500 font-asap text-[14px] font-normal focus:outline-none focus:ring-2 focus:ring-[#004995]"
                    placeholder="Your email"
                  />
                </div>
                
                <div>
                  <label className="block text-black font-asap text-[16px] font-bold leading-normal mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-300 text-black placeholder-gray-500 font-asap text-[14px] font-normal focus:outline-none focus:ring-2 focus:ring-[#004995]"
                    placeholder="Subject"
                  />
                </div>
                
                <div>
                  <label className="block text-black font-asap text-[16px] font-bold leading-normal mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-[10px] bg-white border border-gray-300 text-black placeholder-gray-500 font-asap text-[14px] font-normal focus:outline-none focus:ring-2 focus:ring-[#004995] resize-vertical"
                    placeholder="Your message"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#F99300] hover:bg-orange-500 text-black font-asap text-[16px] font-bold py-3 px-6 rounded-[10px] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <NewsletterFooter />
    </div>
  );
};

export default Contact;
