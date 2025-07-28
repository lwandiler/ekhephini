const PresentersTestimonialsSection = () => {
  return (
    <div className="w-full bg-white">
      {/* Presenters & Shows Section */}
      <section className="py-16 text-center">
        <h2 className="text-black font-asap text-[40px] font-bold leading-normal mb-8">
          Our Presenters & Shows
        </h2>

        {/* Presenters Grid */}
        <div className="relative w-full h-[438px] px-4 mb-16">
          {/* Background presenters images */}
          <div className="absolute left-[-95px] top-0 w-[1630px] h-[438px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/581549f632af0fbe556c47ece189826b9202186e?width=608"
              alt="Presenter 1"
              className="absolute left-0 top-[65px] w-[304px] h-[310px] object-cover rounded-[30px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/669560f9fe905469c62ab7073e36259f844423aa?width=608"
              alt="Presenter 2"
              className="absolute left-[221px] top-[42px] w-[304px] h-[355px] object-cover rounded-[30px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/e0c5d8d3c0f63c25c322710668e289da4bd16405?width=608"
              alt="Presenter 3"
              className="absolute left-[442px] top-[21px] w-[304px] h-[397px] object-cover rounded-[30px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/2d98399094dd3151be1f58512cc54d32ebb0f075?width=608"
              alt="Presenter 4"
              className="absolute left-[663px] top-0 w-[304px] h-[438px] object-cover rounded-[30px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a8f86c67d083e3aea333d3b61a479455c5d1c5b6?width=608"
              alt="Presenter 5"
              className="absolute left-[884px] top-[21px] w-[304px] h-[397px] object-cover rounded-[30px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/520c6e13d723968ac9ead3525dbbc3bbbde8f724?width=608"
              alt="Presenter 6"
              className="absolute left-[1105px] top-[42px] w-[304px] h-[355px] object-cover rounded-[30px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8e69a104d90a0019a5220ef273eb4da99f070d8e?width=608"
              alt="Presenter 7"
              className="absolute left-[1326px] top-[64px] w-[304px] h-[310px] object-cover rounded-[30px]"
            />
          </div>

          {/* Blue overlay for blend effect */}
          <div className="absolute left-[-101px] top-0 w-[1630px] h-[438px] mix-blend-soft-light">
            <div className="absolute left-0 top-[65px] w-[304px] h-[310px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
            <div className="absolute left-[221px] top-[42px] w-[304px] h-[355px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
            <div className="absolute left-[442px] top-[21px] w-[304px] h-[397px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
            <div className="absolute left-[663px] top-0 w-[304px] h-[438px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
            <div className="absolute left-[884px] top-[21px] w-[304px] h-[397px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
            <div className="absolute left-[1105px] top-[42px] w-[304px] h-[355px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
            <div className="absolute left-[1326px] top-[64px] w-[304px] h-[310px] bg-[#004995] rounded-[30px] bg-blend-multiply"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 text-center bg-gray-50">
        <h2 className="text-black font-asap text-[40px] font-bold leading-normal mb-4">
          Our Radio Chats and a reflection of conversations that inspiration you
        </h2>
        <p className="text-[#5F5F5F] font-asap text-[25px] font-normal leading-normal mb-16 max-w-[522px] mx-auto">
          Every word they share reinforces our mission to provide meaningful and inspiring content to every listener.
        </p>

        {/* Testimonial Cards */}
        <div className="flex justify-center items-start gap-8 px-4">
          {/* Left Testimonial */}
          <div className="bg-white rounded-lg p-8 max-w-sm shadow-lg relative">
            <div className="mb-6">
              <p className="text-[#1B1A1A] font-['Schibsted_Grotesk'] text-[20px] font-medium leading-7">
                It gave me a way of expressing myself in a completely new and different way. Without AI I was only a consumer, now a creator. Also the AI video space is really going fast lately and better.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a9bf0646495fb908b54d228c30ef69849899a8c0?width=112"
                alt="Maria Andaloro"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-[#1B1A1A] font-['DM_Sans'] text-[16px] font-bold leading-6">Maria Andaloro</p>
                <p className="text-[#4B4B4B] font-['DM_Sans'] text-[16px] font-normal leading-6">Trashco Inc</p>
              </div>
            </div>
            {/* Quote Icon */}
            <svg className="absolute right-4 bottom-4 w-10 h-8 opacity-20" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.1969 16H4V15.9843C4 12.9055 5.52756 10.0551 8.08661 8.34646L15.1102 3.66142C16.0315 3.04724 16.2756 1.81102 15.6614 0.889764C15.2756 0.314961 14.6457 0 13.9921 0C13.6142 0 13.2283 0.110236 12.8819 0.338583L5.85827 5.02362C2.19685 7.46457 0 11.5669 0 15.9843V16.8031V31.1968C0 31.6378 0.354331 32 0.80315 32H15.1969C15.6378 32 16 31.6457 16 31.1968V16.8031C16 16.3543 15.6457 16 15.1969 16Z"
                fill="#EAEAEA"
              />
              <path
                d="M39.197 16H28.0002V15.9843C28.0002 12.9055 29.5277 10.0551 32.0868 8.34646L39.1104 3.66142C40.0317 3.04724 40.2758 1.81102 39.6616 0.889764C39.2758 0.314961 38.6459 0 37.9923 0C37.6144 0 37.2285 0.110236 36.8821 0.338583L29.8585 5.02362C26.1813 7.47244 23.9923 11.5669 23.9923 15.9843V16.8031V31.1968C23.9923 31.6378 24.3466 32 24.7955 32H39.197C39.638 32 40.0002 31.6457 40.0002 31.1968V16.8031C40.0002 16.3543 39.638 16 39.197 16Z"
                fill="#EAEAEA"
              />
            </svg>
          </div>

          {/* Center Testimonial */}
          <div className="bg-white rounded-lg p-8 max-w-sm shadow-lg text-center">
            <div className="mb-6">
              <p className="text-[#1B1A1A] font-['Schibsted_Grotesk'] text-[20px] font-medium leading-7">
                It gave me a way of expressing myself in a completely new and different way. Without AI I was only a consumer, now a creator. Also the AI video space is really going fast lately and better.
              </p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=112"
                alt="Maria Andaloro"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="text-[#1B1A1A] font-['DM_Sans'] text-[16px] font-bold leading-6">Maria Andaloro</p>
                <p className="text-[#4B4B4B] font-['DM_Sans'] text-[16px] font-normal leading-6">Trashco Inc</p>
              </div>
            </div>
          </div>

          {/* Right Testimonial */}
          <div className="bg-white rounded-lg p-8 max-w-sm shadow-lg relative">
            <div className="mb-6">
              <p className="text-[#1B1A1A] font-['Schibsted_Grotesk'] text-[20px] font-medium leading-7">
                It gave me a way of expressing myself in a completely new and different way. Without AI I was only a consumer, now a creator. Also the AI video space is really going fast lately and better.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a9bf0646495fb908b54d228c30ef69849899a8c0?width=112"
                alt="Maria Andaloro"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-[#1B1A1A] font-['DM_Sans'] text-[16px] font-bold leading-6">Maria Andaloro</p>
                <p className="text-[#4B4B4B] font-['DM_Sans'] text-[16px] font-normal leading-6">Trashco Inc</p>
              </div>
            </div>
            {/* Quote Icon */}
            <svg className="absolute right-4 bottom-4 w-10 h-8 opacity-20" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.1969 16H4V15.9843C4 12.9055 5.52756 10.0551 8.08661 8.34646L15.1102 3.66142C16.0315 3.04724 16.2756 1.81102 15.6614 0.889764C15.2756 0.314961 14.6457 0 13.9921 0C13.6142 0 13.2283 0.110236 12.8819 0.338583L5.85827 5.02362C2.19685 7.46457 0 11.5669 0 15.9843V16.8031V31.1968C0 31.6378 0.354331 32 0.80315 32H15.1969C15.6378 32 16 31.6457 16 31.1968V16.8031C16 16.3543 15.6457 16 15.1969 16Z"
                fill="#EAEAEA"
              />
              <path
                d="M39.197 16H28.0002V15.9843C28.0002 12.9055 29.5277 10.0551 32.0868 8.34646L39.1104 3.66142C40.0317 3.04724 40.2758 1.81102 39.6616 0.889764C39.2758 0.314961 38.6459 0 37.9923 0C37.6144 0 37.2285 0.110236 36.8821 0.338583L29.8585 5.02362C26.1813 7.47244 23.9923 11.5669 23.9923 15.9843V16.8031V31.1968C23.9923 31.6378 24.3466 32 24.7955 32H39.197C39.638 32 40.0002 31.6457 40.0002 31.1968V16.8031C40.0002 16.3543 39.638 16 39.197 16Z"
                fill="#EAEAEA"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PresentersTestimonialsSection;
