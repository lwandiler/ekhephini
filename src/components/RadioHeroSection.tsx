const RadioHeroSection = () => {
  return (
    <section className="relative w-full h-[814px] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/e154fb9d1aed06944969aa7592132dfc209c4bc2?width=2928"
        alt="Radio Station Background"
        className="absolute -left-3 top-0 w-[1464px] h-[823px] object-cover backdrop-blur-[50px]"
      />

      {/* Blue Gradient Overlay */}
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-transparent to-[#004995] opacity-78 backdrop-blur-[50px]"></div>

      {/* Logo Overlay */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/83493488be7d7e8aac21d19be5cf584126ee0efc?width=660"
        alt="Station Logo"
        className="absolute right-[160px] top-[350px] w-[330px] h-[207px] object-contain"
      />

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 lg:px-16 xl:px-[185px] py-8 md:py-16 lg:py-32 xl:py-[209px] h-full flex flex-col justify-start">
        <h1 className="max-w-[600px] text-white font-asap text-4xl md:text-6xl lg:text-7xl xl:text-[96px] font-bold leading-normal mb-8 md:mb-12">
          Now Live In Studio
        </h1>

        <p className="max-w-[575px] text-white font-asap text-lg md:text-xl lg:text-2xl xl:text-[25px] font-normal leading-normal mb-12 md:mb-16">
          Ekhephini Community Radio was founded
          in October 2005 by the community of Barkly East
          in Joe Gabi District. A local community radio station
          by the community for the community.
        </p>

        {/* Listen Live Button */}
        <div className="flex">
          <button className="w-[210px] h-[69px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-[50px] backdrop-blur-[45px] flex items-center justify-center transition-all duration-300 cursor-pointer">
            <div className="flex items-center space-x-4">
              <svg className="w-[39px] h-[39px]" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.5 19.5C20.3975 19.5 21.125 18.7725 21.125 17.875C21.125 16.9775 20.3975 16.25 19.5 16.25C18.6025 16.25 17.875 16.9775 17.875 17.875C17.875 18.7725 18.6025 19.5 19.5 19.5Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 22.75C12.0947 21.5429 11.5433 20.1075 11.4078 18.6047C11.2723 17.1019 11.558 15.591 12.2328 14.2414C12.9076 12.8918 13.9449 11.7567 15.2284 10.9635C16.512 10.1702 17.9911 9.75 19.5 9.75C21.0089 9.75 22.488 10.1702 23.7716 10.9635C25.0551 11.7567 26.0924 12.8918 26.7672 14.2414C27.442 15.591 27.7277 17.1019 27.5922 18.6047C27.4567 20.1075 26.9053 21.5429 26 22.75M17.875 27.625C17.875 27.194 18.0462 26.7807 18.351 26.476C18.6557 26.1712 19.069 26 19.5 26C19.931 26 20.3443 26.1712 20.6491 26.476C20.9538 26.7807 21.125 27.194 21.125 27.625C21.125 28.4375 20.5725 32.5 20.3125 34.9375C20.3125 35.153 20.2269 35.3597 20.0745 35.512C19.9222 35.6644 19.7155 35.75 19.5 35.75C19.2845 35.75 19.0779 35.6644 18.9255 35.512C18.7731 35.3597 18.6875 35.153 18.6875 34.9375C18.4275 32.5 17.875 28.4375 17.875 27.625Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M27.625 30.0625C30.2338 28.3194 32.213 25.7835 33.27 22.8293C34.3271 19.8751 34.4061 16.6593 33.4953 13.6568C32.5845 10.6543 30.7323 8.0243 28.2122 6.15523C25.692 4.28615 22.6376 3.2771 19.5 3.2771C16.3624 3.2771 13.308 4.28615 10.7878 6.15523C8.26771 8.0243 6.41548 10.6543 5.50471 13.6568C4.59394 16.6593 4.67292 19.8751 5.72998 22.8293C6.78705 25.7835 8.76615 28.3194 11.375 30.0625"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-left">
                <div className="text-white font-asap text-[16px] font-bold leading-normal">Listen Live</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RadioHeroSection;
