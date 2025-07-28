const RadioContentSections = () => {
  return (
    <div className="w-full bg-white">
      {/* Best Place Section */}
      <section className="py-16 px-[100px]">
        <div className="flex items-start space-x-16">
          {/* Left Content */}
          <div className="flex-1">
            {/* Play Icon */}
            <div className="flex items-center mb-8">
              <svg className="w-[51px] h-[52px]" viewBox="0 0 53 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M42.1442 6.65452C38.3753 3.66944 33.8605 1.82261 29.1131 1.32408C24.3658 0.825557 19.5765 1.69534 15.2899 3.8345C11.0034 5.97367 7.39166 9.29637 4.86546 13.4247C2.33926 17.553 1 22.3213 1 27.1873C1 32.0532 2.33926 36.8215 4.86546 40.9498C7.39166 45.0781 11.0034 48.4008 15.2899 50.54C19.5765 52.6792 24.3658 53.549 29.1131 53.0504C33.8605 52.5519 38.3753 50.7051 42.1442 47.72M45.8127 44.1659C49.8043 39.4453 52 33.4199 52 27.1873C52 20.9546 49.8043 14.9292 45.8127 10.2087"
                  stroke="#5F5F5F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className="absolute ml-[18px] w-[18px] h-[20px]" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.0156 9.49736L3.95128 1.44798C3.65208 1.27702 3.31277 1.1871 2.96742 1.18726C2.62207 1.18741 2.28284 1.27764 1.98379 1.44887C1.68475 1.6201 1.43641 1.86631 1.26373 2.16278C1.09105 2.45925 1.00009 2.79554 1 3.13788V19.2366C1.00009 19.579 1.09105 19.9153 1.26373 20.2117C1.43641 20.5082 1.68475 20.7544 1.98379 20.9256C2.28284 21.0969 2.62207 21.1871 2.96742 21.1873C3.31277 21.1874 3.65208 21.0975 3.95128 20.9265L18.0156 12.8772C18.3149 12.7059 18.5634 12.4596 18.7362 12.163C18.909 11.8663 19 11.5298 19 11.1873C19 10.8447 18.909 10.5082 18.7362 10.2115C18.5634 9.91491 18.3149 9.66859 18.0156 9.49736Z"
                  fill="black"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Episode Info */}
            <div className="mb-4">
              <span className="text-black font-asap text-[16px] font-bold leading-normal">Episode 1</span>
              <span className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal"> Categori - 0.13</span>
            </div>

            {/* Title */}
            <h2 className="w-[328px] text-black font-asap text-[40px] font-bold leading-normal mb-8">
              Best place to find design inspiration
            </h2>

            {/* Description */}
            <p className="w-[611px] text-[#5F5F5F] font-asap text-[25px] font-normal leading-normal mb-8">
              Our Radio is the place to get in-depth insights on a variety of interesting topics, from technology to mental health.
              <br /><br />
              We are committed to delivering high-quality content that inspires, educates and entertains our listeners, featuring experts and leading sources to share their knowledge and experiences.
            </p>

            {/* Episode Page Link */}
            <div className="flex items-center space-x-2">
              <span className="text-black font-asap text-[16px] font-normal leading-normal">Episode Page</span>
              <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.13655 11.4911C9.04147 11.4133 8.96604 11.3207 8.91457 11.2189C8.8631 11.117 8.8366 11.0078 8.8366 10.8974C8.8366 10.7871 8.8631 10.6779 8.91457 10.576C8.96604 10.4741 9.04147 10.3816 9.13655 10.3038L13.5123 6.70738H1.0198C0.74933 6.70738 0.489941 6.61907 0.298691 6.46189C0.107442 6.3047 -1.26765e-06 6.09152 -1.26765e-06 5.86923C-1.26765e-06 5.64693 0.107442 5.43375 0.298691 5.27656C0.489941 5.11938 0.74933 5.03107 1.0198 5.03107H13.5123L9.13655 1.4333C8.94497 1.27584 8.83734 1.06228 8.83734 0.839607C8.83734 0.61693 8.94497 0.403372 9.13655 0.245915C9.32813 0.0884585 9.58797 2.34629e-09 9.8589 0C10.1298 -2.34629e-09 10.3897 0.0884585 10.5813 0.245915L16.7001 5.27483C16.7951 5.3527 16.8706 5.44523 16.922 5.54711C16.9735 5.64899 17 5.75821 17 5.86853C17 5.97884 16.9735 6.08807 16.922 6.18995C16.8706 6.29183 16.7951 6.38435 16.7001 6.46222L10.5813 11.4911C10.4865 11.5693 10.3739 11.6313 10.25 11.6736C10.126 11.7159 9.99312 11.7377 9.8589 11.7377C9.72468 11.7377 9.59178 11.7159 9.46783 11.6736C9.34387 11.6313 9.23129 11.5693 9.13655 11.4911Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/9aefcb01b5008efd9d11167375fdeee3b51a31ba?width=1110"
              alt="Design Inspiration"
              className="w-[555px] h-[558px] object-cover rounded-[30px]"
            />
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
        <div className="relative w-full px-4">
          {/* Card 1 */}
          <div className="absolute left-[-215px] top-0 w-[610px] h-[328px] bg-white rounded-[30px] shadow-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/c767071a9d004021120dd75c7e47c296a73c84d2?width=590"
              alt="Episode 09"
              className="w-[295px] h-[328px] object-cover rounded-l-[30px]"
            />
            <div className="absolute right-4 top-4 w-16 h-16 bg-white rounded-[20px] flex items-center justify-center">
              <svg className="w-[35px] h-[35px]" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.625 1.48743C9.65417 1.93951 4.375 8.04993 4.375 15.0353V24.7916C4.375 27.2124 6.32917 29.1666 8.75 29.1666H10.2083C11.8125 29.1666 13.125 27.8541 13.125 26.2499V20.4166C13.125 18.8124 11.8125 17.4999 10.2083 17.4999H7.29167V15.0062C7.29167 9.40618 11.6083 4.53534 17.1938 4.37493C18.5599 4.33372 19.9205 4.56732 21.1947 5.06188C22.4688 5.55643 23.6307 6.30186 24.6114 7.25395C25.592 8.20604 26.3715 9.34538 26.9035 10.6044C27.4354 11.8634 27.7092 13.2165 27.7083 14.5833V17.4999H24.7917C23.1875 17.4999 21.875 18.8124 21.875 20.4166V26.2499C21.875 27.8541 23.1875 29.1666 24.7917 29.1666H26.25C28.6708 29.1666 30.625 27.2124 30.625 24.7916V14.5833C30.625 7.04367 24.2667 0.991592 16.625 1.48743Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="absolute left-[320px] top-[120px] w-[233px]">
              <p className="text-[#5F5F5F] font-asap text-[20px] font-normal leading-normal mb-4">Episode 09 - Technology</p>
              <h3 className="text-black font-asap text-[40px] font-bold leading-normal mb-8">
                SRKP selects: to hide behind safe
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-black font-asap text-[16px] font-normal leading-normal">Episode Page</span>
                <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.13655 11.4911..." fill="black" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 - Center */}
          <div className="absolute left-[415px] top-0 w-[610px] h-[328px] bg-[#004D9E] rounded-[30px] shadow-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/20ac2a05baa4a83be6a9bd810a9958218cfab58e?width=590"
              alt="Episode 10"
              className="w-[295px] h-[328px] object-cover rounded-l-[30px]"
            />
            <div className="absolute right-4 top-4 w-16 h-16 bg-white rounded-[20px] flex items-center justify-center">
              <svg className="w-[35px] h-[35px]" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.625 1.48743C9.65417 1.93951 4.375 8.04993 4.375 15.0353V24.7916C4.375 27.2124 6.32917 29.1666 8.75 29.1666H10.2083C11.8125 29.1666 13.125 27.8541 13.125 26.2499V20.4166C13.125 18.8124 11.8125 17.4999 10.2083 17.4999H7.29167V15.0062C7.29167 9.40618 11.6083 4.53534 17.1938 4.37493C18.5599 4.33372 19.9205 4.56732 21.1947 5.06188C22.4688 5.55643 23.6307 6.30186 24.6114 7.25395C25.592 8.20604 26.3715 9.34538 26.9035 10.6044C27.4354 11.8634 27.7092 13.2165 27.7083 14.5833V17.4999H24.7917C23.1875 17.4999 21.875 18.8124 21.875 20.4166V26.2499C21.875 27.8541 23.1875 29.1666 24.7917 29.1666H26.25C28.6708 29.1666 30.625 27.2124 30.625 24.7916V14.5833C30.625 7.04367 24.2667 0.991592 16.625 1.48743Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="absolute left-[320px] top-[120px] w-[232px]">
              <p className="text-white font-asap text-[20px] font-normal leading-normal mb-4">Episode 10 - Technology</p>
              <h3 className="text-white font-asap text-[40px] font-bold leading-normal mb-8">
                SRKP selects: good tryout tricks
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-white font-asap text-[16px] font-normal leading-normal">Episode Page</span>
                <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.13655 11.4911..." fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="absolute left-[1045px] top-0 w-[610px] h-[328px] bg-white rounded-[30px] shadow-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/31ea6eec12dd403fdaea4ad3525ddf458d1121c6?width=590"
              alt="Episode 11"
              className="w-[295px] h-[328px] object-cover rounded-l-[30px]"
            />
            <div className="absolute right-4 top-4 w-16 h-16 bg-white rounded-[20px] flex items-center justify-center">
              <svg className="w-[35px] h-[35px]" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.625 1.48743C9.65417 1.93951 4.375 8.04993 4.375 15.0353V24.7916C4.375 27.2124 6.32917 29.1666 8.75 29.1666H10.2083C11.8125 29.1666 13.125 27.8541 13.125 26.2499V20.4166C13.125 18.8124 11.8125 17.4999 10.2083 17.4999H7.29167V15.0062C7.29167 9.40618 11.6083 4.53534 17.1938 4.37493C18.5599 4.33372 19.9205 4.56732 21.1947 5.06188C22.4688 5.55643 23.6307 6.30186 24.6114 7.25395C25.592 8.20604 26.3715 9.34538 26.9035 10.6044C27.4354 11.8634 27.7092 13.2165 27.7083 14.5833V17.4999H24.7917C23.1875 17.4999 21.875 18.8124 21.875 20.4166V26.2499C21.875 27.8541 23.1875 29.1666 24.7917 29.1666H26.25C28.6708 29.1666 30.625 27.2124 30.625 24.7916V14.5833C30.625 7.04367 24.2667 0.991592 16.625 1.48743Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="absolute left-[320px] top-[120px] w-[232px]">
              <p className="text-[#5F5F5F] font-asap text-[20px] font-normal leading-normal mb-4">Episode 11 - Technology</p>
              <h3 className="text-black font-asap text-[40px] font-bold leading-normal mb-8">
                SRKP selects: open your mind easy
              </h3>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="mt-[450px] flex items-center justify-center space-x-4">
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          <div className="w-10 h-10 border border-black rounded-full flex items-center justify-center">
            <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
          </div>
          <div className="w-[11.75px] h-[11.75px] bg-black rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default RadioContentSections;
