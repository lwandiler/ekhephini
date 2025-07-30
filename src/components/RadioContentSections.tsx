const RadioContentSections = () => {
  return <div className="w-full bg-white">
      {/* Best Place Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
        <div className="flex items-start space-x-16">
          {/* Left Content */}
          <div className="flex-1 mt-8">
            {/* Play Icon */}
            

            {/* Episode Info */}
            <div className="mb-4">
              
              
            </div>

            {/* Title */}
            <h2 className="max-w-[328px] text-black font-asap text-2xl md:text-3xl lg:text-[40px] font-bold leading-normal mb-8">
              Best place to find design inspiration
            </h2>

            {/* Description */}
            <p className="max-w-[611px] text-[#5F5F5F] font-asap text-lg md:text-xl lg:text-[25px] font-normal leading-normal mb-8 text-left">
              Our Radio is the place to get in-depth insights on a variety of interesting topics, from technology to mental health.
              <br /><br />
              We are committed to delivering high-quality content that inspires, educates and entertains our listeners, featuring experts and leading sources to share their knowledge and experiences.
            </p>

            {/* Episode Page Link */}
            <div className="flex items-center space-x-2">
              <span className="text-black font-asap text-[16px] font-normal leading-normal">Episode Page</span>
              <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.13655 11.4911C9.04147 11.4133 8.96604 11.3207 8.91457 11.2189C8.8631 11.117 8.8366 11.0078 8.8366 10.8974C8.8366 10.7871 8.8631 10.6779 8.91457 10.576C8.96604 10.4741 9.04147 10.3816 9.13655 10.3038L13.5123 6.70738H1.0198C0.74933 6.70738 0.489941 6.61907 0.298691 6.46189C0.107442 6.3047 -1.26765e-06 6.09152 -1.26765e-06 5.86923C-1.26765e-06 5.64693 0.107442 5.43375 0.298691 5.27656C0.489941 5.11938 0.74933 5.03107 1.0198 5.03107H13.5123L9.13655 1.4333C8.94497 1.27584 8.83734 1.06228 8.83734 0.839607C8.83734 0.61693 8.94497 0.403372 9.13655 0.245915C9.32813 0.0884585 9.58797 2.34629e-09 9.8589 0C10.1298 -2.34629e-09 10.3897 0.0884585 10.5813 0.245915L16.7001 5.27483C16.7951 5.3527 16.8706 5.44523 16.922 5.54711C16.9735 5.64899 17 5.75821 17 5.86853C17 5.97884 16.9735 6.08807 16.922 6.18995C16.8706 6.29183 16.7951 6.38435 16.7001 6.46222L10.5813 11.4911C10.4865 11.5693 10.3739 11.6313 10.25 11.6736C10.126 11.7159 9.99312 11.7377 9.8589 11.7377C9.72468 11.7377 9.59178 11.7159 9.46783 11.6736C9.34387 11.6313 9.23129 11.5693 9.13655 11.4911Z" fill="black" />
              </svg>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/9aefcb01b5008efd9d11167375fdeee3b51a31ba?width=1110" alt="Design Inspiration" className="w-full max-w-[555px] h-auto md:h-[558px] object-cover rounded-[30px]" />
          </div>
        </div>
      </section>

      {/* Top 10 Songs Section */}
      <section className="py-16 text-center">
        <h2 className="text-black font-asap text-[40px] font-bold leading-normal mb-4">Show Schedule</h2>
        <p className="text-[#5F5F5F] font-asap text-[25px] font-normal leading-normal mb-16">
          Your favorite shows - previous, current and upcoming.
        </p>

        {/* Shows Grid */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Previous Show */}
            <div className="w-full bg-white rounded-[30px] shadow-lg overflow-hidden p-6">
              <div className="mb-4">
                <span className="text-[#5F5F5F] font-asap text-[14px] font-normal">Previous Show</span>
              </div>
              <img src="https://api.builder.io/api/v1/image/assets/TEMP/c767071a9d004021120dd75c7e47c296a73c84d2?width=590" alt="Previous Show" className="w-full h-[200px] object-cover rounded-[20px] mb-4" />
              <h3 className="text-black font-asap text-[20px] font-bold leading-normal mb-2">
                Morning Drive
              </h3>
              <p className="text-[#5F5F5F] font-asap text-[14px] font-normal mb-2">6:00 AM - 9:00 AM</p>
              <p className="text-[#5F5F5F] font-asap text-[14px] font-normal">with Sarah Johnson</p>
            </div>

            {/* Current Show */}
            <div className="w-full bg-[#004D9E] rounded-[30px] shadow-lg overflow-hidden p-6">
              <div className="mb-4">
                <span className="text-white font-asap text-[14px] font-normal">Now Playing</span>
              </div>
              <img src="https://api.builder.io/api/v1/image/assets/TEMP/20ac2a05baa4a83be6a9bd810a9958218cfab58e?width=590" alt="Current Show" className="w-full h-[200px] object-cover rounded-[20px] mb-4" />
              <h3 className="text-white font-asap text-[20px] font-bold leading-normal mb-2">
                Midday Mix
              </h3>
              <p className="text-white font-asap text-[14px] font-normal mb-2">9:00 AM - 12:00 PM</p>
              <p className="text-white font-asap text-[14px] font-normal">with Mike Rodriguez</p>
              <div className="mt-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Next Show */}
            <div className="w-full bg-white rounded-[30px] shadow-lg overflow-hidden p-6">
              <div className="mb-4">
                <span className="text-[#5F5F5F] font-asap text-[14px] font-normal">Up Next</span>
              </div>
              <img src="https://api.builder.io/api/v1/image/assets/TEMP/31ea6eec12dd403fdaea4ad3525ddf458d1121c6?width=590" alt="Next Show" className="w-full h-[200px] object-cover rounded-[20px] mb-4" />
              <h3 className="text-black font-asap text-[20px] font-bold leading-normal mb-2">
                Afternoon Vibes
              </h3>
              <p className="text-[#5F5F5F] font-asap text-[14px] font-normal mb-2">12:00 PM - 3:00 PM</p>
              <p className="text-[#5F5F5F] font-asap text-[14px] font-normal">with Emma Chen</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default RadioContentSections;