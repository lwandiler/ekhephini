const RadioContentSections = () => {
  return <div className="w-full bg-white">
      {/* Best Place Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
        <div className="flex items-start space-x-16">
          {/* Left Content */}
          <div className="flex-1">
            {/* Play Icon */}
            

            {/* Episode Info */}
            

            {/* Title */}
            <h2 className="max-w-[328px] text-black font-asap text-2xl md:text-3xl lg:text-[40px] font-bold leading-normal mb-8">
              Best place to find design inspiration
            </h2>

            {/* Description */}
            <p className="max-w-[611px] text-[#5F5F5F] font-asap text-lg md:text-xl lg:text-[25px] font-normal leading-normal mb-8">
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
        <h2 className="text-black font-asap text-[40px] font-bold leading-normal mb-4">Top 10 Songs</h2>
        <p className="text-[#5F5F5F] font-asap text-[25px] font-normal leading-normal mb-16">
          Discover the selection of the most popular Radio.
        </p>

        {/* Cards Grid */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="w-full bg-white rounded-[30px] shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/c767071a9d004021120dd75c7e47c296a73c84d2?width=590" alt="Episode 09" className="w-full md:w-1/2 h-[200px] md:h-[328px] object-cover" />
                <div className="p-6 flex-1">
                  <div className="flex justify-end mb-4">
                    <div className="w-12 h-12 bg-white rounded-[20px] flex items-center justify-center shadow-md">
                      <svg className="w-[25px] h-[25px]" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.625 1.48743C9.65417 1.93951 4.375 8.04993 4.375 15.0353V24.7916C4.375 27.2124 6.32917 29.1666 8.75 29.1666H10.2083C11.8125 29.1666 13.125 27.8541 13.125 26.2499V20.4166C13.125 18.8124 11.8125 17.4999 10.2083 17.4999H7.29167V15.0062C7.29167 9.40618 11.6083 4.53534 17.1938 4.37493C18.5599 4.33372 19.9205 4.56732 21.1947 5.06188C22.4688 5.55643 23.6307 6.30186 24.6114 7.25395C25.592 8.20604 26.3715 9.34538 26.9035 10.6044C27.4354 11.8634 27.7092 13.2165 27.7083 14.5833V17.4999H24.7917C23.1875 17.4999 21.875 18.8124 21.875 20.4166V26.2499C21.875 27.8541 23.1875 29.1666 24.7917 29.1666H26.25C28.6708 29.1666 30.625 27.2124 30.625 24.7916V14.5833C30.625 7.04367 24.2667 0.991592 16.625 1.48743Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-2">Episode 09 - Technology</p>
                  <h3 className="text-black font-asap text-[24px] font-bold leading-normal mb-4">
                    SRKP selects: to hide behind safe
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-black font-asap text-[14px] font-normal leading-normal">Episode Page</span>
                    <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.13655 11.4911L13.5123 6.70738H1.0198C0.74933 6.70738 0.489941 6.61907 0.298691 6.46189C0.107442 6.3047 -1.26765e-06 6.09152 -1.26765e-06 5.86923C-1.26765e-06 5.64693 0.107442 5.43375 0.298691 5.27656C0.489941 5.11938 0.74933 5.03107 1.0198 5.03107H13.5123L9.13655 1.4333C8.94497 1.27584 8.83734 1.06228 8.83734 0.839607C8.83734 0.61693 8.94497 0.403372 9.13655 0.245915C9.32813 0.0884585 9.58797 2.34629e-09 9.8589 0C10.1298 -2.34629e-09 10.3897 0.0884585 10.5813 0.245915L16.7001 5.27483C16.7951 5.3527 16.8706 5.44523 16.922 5.54711C16.9735 5.64899 17 5.75821 17 5.86853C17 5.97884 16.9735 6.08807 16.922 6.18995C16.8706 6.29183 16.7951 6.38435 16.7001 6.46222L10.5813 11.4911C10.4865 11.5693 10.3739 11.6313 10.25 11.6736C10.126 11.7159 9.99312 11.7377 9.8589 11.7377C9.72468 11.7377 9.59178 11.7159 9.46783 11.6736C9.34387 11.6313 9.23129 11.5693 9.13655 11.4911Z" fill="black" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Center */}
            <div className="w-full bg-[#004D9E] rounded-[30px] shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/20ac2a05baa4a83be6a9bd810a9958218cfab58e?width=590" alt="Episode 10" className="w-full md:w-1/2 h-[200px] md:h-[328px] object-cover" />
                <div className="p-6 flex-1">
                  <div className="flex justify-end mb-4">
                    <div className="w-12 h-12 bg-white rounded-[20px] flex items-center justify-center shadow-md">
                      <svg className="w-[25px] h-[25px]" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.625 1.48743C9.65417 1.93951 4.375 8.04993 4.375 15.0353V24.7916C4.375 27.2124 6.32917 29.1666 8.75 29.1666H10.2083C11.8125 29.1666 13.125 27.8541 13.125 26.2499V20.4166C13.125 18.8124 11.8125 17.4999 10.2083 17.4999H7.29167V15.0062C7.29167 9.40618 11.6083 4.53534 17.1938 4.37493C18.5599 4.33372 19.9205 4.56732 21.1947 5.06188C22.4688 5.55643 23.6307 6.30186 24.6114 7.25395C25.592 8.20604 26.3715 9.34538 26.9035 10.6044C27.4354 11.8634 27.7092 13.2165 27.7083 14.5833V17.4999H24.7917C23.1875 17.4999 21.875 18.8124 21.875 20.4166V26.2499C21.875 27.8541 23.1875 29.1666 24.7917 29.1666H26.25C28.6708 29.1666 30.625 27.2124 30.625 24.7916V14.5833C30.625 7.04367 24.2667 0.991592 16.625 1.48743Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-white font-asap text-[16px] font-normal leading-normal mb-2">Episode 10 - Technology</p>
                  <h3 className="text-white font-asap text-[24px] font-bold leading-normal mb-4">
                    SRKP selects: good tryout tricks
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-asap text-[14px] font-normal leading-normal">Episode Page</span>
                    <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.13655 11.4911L13.5123 6.70738H1.0198C0.74933 6.70738 0.489941 6.61907 0.298691 6.46189C0.107442 6.3047 -1.26765e-06 6.09152 -1.26765e-06 5.86923C-1.26765e-06 5.64693 0.107442 5.43375 0.298691 5.27656C0.489941 5.11938 0.74933 5.03107 1.0198 5.03107H13.5123L9.13655 1.4333C8.94497 1.27584 8.83734 1.06228 8.83734 0.839607C8.83734 0.61693 8.94497 0.403372 9.13655 0.245915C9.32813 0.0884585 9.58797 2.34629e-09 9.8589 0C10.1298 -2.34629e-09 10.3897 0.0884585 10.5813 0.245915L16.7001 5.27483C16.7951 5.3527 16.8706 5.44523 16.922 5.54711C16.9735 5.64899 17 5.75821 17 5.86853C17 5.97884 16.9735 6.08807 16.922 6.18995C16.8706 6.29183 16.7951 6.38435 16.7001 6.46222L10.5813 11.4911C10.4865 11.5693 10.3739 11.6313 10.25 11.6736C10.126 11.7159 9.99312 11.7377 9.8589 11.7377C9.72468 11.7377 9.59178 11.7159 9.46783 11.6736C9.34387 11.6313 9.23129 11.5693 9.13655 11.4911Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-full bg-white rounded-[30px] shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/31ea6eec12dd403fdaea4ad3525ddf458d1121c6?width=590" alt="Episode 11" className="w-full md:w-1/2 h-[200px] md:h-[328px] object-cover" />
                <div className="p-6 flex-1">
                  <div className="flex justify-end mb-4">
                    <div className="w-12 h-12 bg-white rounded-[20px] flex items-center justify-center shadow-md">
                      <svg className="w-[25px] h-[25px]" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.625 1.48743C9.65417 1.93951 4.375 8.04993 4.375 15.0353V24.7916C4.375 27.2124 6.32917 29.1666 8.75 29.1666H10.2083C11.8125 29.1666 13.125 27.8541 13.125 26.2499V20.4166C13.125 18.8124 11.8125 17.4999 10.2083 17.4999H7.29167V15.0062C7.29167 9.40618 11.6083 4.53534 17.1938 4.37493C18.5599 4.33372 19.9205 4.56732 21.1947 5.06188C22.4688 5.55643 23.6307 6.30186 24.6114 7.25395C25.592 8.20604 26.3715 9.34538 26.9035 10.6044C27.4354 11.8634 27.7092 13.2165 27.7083 14.5833V17.4999H24.7917C23.1875 17.4999 21.875 18.8124 21.875 20.4166V26.2499C21.875 27.8541 23.1875 29.1666 24.7917 29.1666H26.25C28.6708 29.1666 30.625 27.2124 30.625 24.7916V14.5833C30.625 7.04367 24.2667 0.991592 16.625 1.48743Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-2">Episode 11 - Technology</p>
                  <h3 className="text-black font-asap text-[24px] font-bold leading-normal mb-4">
                    SRKP selects: open your mind easy
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="mt-16 flex items-center justify-center space-x-4">
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          <div className="w-10 h-10 border border-black rounded-full flex items-center justify-center">
            <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          </div>
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
        </div>
      </section>
    </div>;
};
export default RadioContentSections;