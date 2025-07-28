const NewsletterFooter = () => {
  return (
    <section className="w-full bg-[#004995] py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Newsletter Section */}
        <div className="relative w-[1175px] h-[212px] mx-auto mb-8 rounded-[30px] bg-[#004995] flex flex-col items-center justify-center">
          <h2 className="text-white font-asap text-[40px] font-bold leading-normal mb-4">
            Stay In The Loop
          </h2>
          <p className="text-white font-asap text-[14px] font-normal leading-normal mb-8">
            Get the latest news and updates delivered straight to your inbox.
          </p>

          {/* Email Subscription Form */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-[313px] h-[52px] px-4 rounded-[10px] bg-white border-none shadow-lg text-black placeholder-gray-500 font-asap text-[14px] font-normal"
              />
            </div>
            <button className="w-[129px] h-[52px] bg-[#F99300] rounded-[10px] shadow-lg text-black font-asap text-[14px] font-bold hover:bg-orange-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterFooter;
