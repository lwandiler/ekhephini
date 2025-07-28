const RadioPlayerSection = () => {
  return (
    <section className="relative w-full bg-white py-16">
      <div className="container mx-auto px-[210px]">
        {/* Now Playing Card */}
        <div className="relative w-[1021px] h-[294px] mx-auto">
          {/* Main card background */}
          <div className="absolute left-0 top-8 w-full h-[262px] bg-[#004D9E] rounded-[30px]"></div>

          {/* Album cover */}
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/cb1343c9ea14749717c7a217081248e1aaf2fa09?width=532"
            alt="Now Playing Album Cover"
            className="absolute left-0 top-8 w-[266px] h-[262px] object-cover rounded-l-[30px]"
          />

          {/* Content */}
          <div className="absolute left-[303px] top-0 w-[682px] h-[269px]">
            {/* Song Title */}
            <h2 className="absolute left-0 top-[57px] w-[402px] text-white font-asap text-[40px] font-bold leading-normal">
              KO- Skhanda Republic Now Playing
            </h2>

            {/* Station Info */}
            <p className="absolute left-0 top-[159px] text-white font-asap text-[16px] font-normal leading-normal">
              Live Radio 96.3 FM
            </p>

            {/* Shows Link */}
            <div className="absolute right-0 top-0 w-[68px] h-[73px]">
              <p className="absolute left-0 top-[55px] text-white font-asap text-[16px] font-normal leading-normal">
                Shows
              </p>
              <svg className="absolute left-[51px] top-0 w-2 h-4 rotate-90" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.13655 9.98113C9.04147 9.91956 8.96604 9.84641 8.91457 9.76586C8.8631 9.68531 8.8366 9.59895 8.8366 9.51174C8.8366 9.42452 8.8631 9.33817 8.91457 9.25762C8.96604 9.17707 9.04147 9.10391 9.13655 9.04235L13.5123 6.19896H1.0198C0.74933 6.19896 0.489941 6.12915 0.298691 6.00487C0.107442 5.8806 -1.26765e-06 5.71205 -1.26765e-06 5.5363C-1.26765e-06 5.36055 0.107442 5.192 0.298691 5.06772C0.489941 4.94345 0.74933 4.87363 1.0198 4.87363H13.5123L9.13655 2.02914C8.94497 1.90465 8.83734 1.73581 8.83734 1.55975C8.83734 1.3837 8.94497 1.21485 9.13655 1.09036C9.32813 0.965873 9.58797 0.895935 9.8589 0.895935C10.1298 0.895935 10.3897 0.965873 10.5813 1.09036L16.7001 5.06636C16.7951 5.12792 16.8706 5.20107 16.922 5.28162C16.9735 5.36217 17 5.44853 17 5.53574C17 5.62296 16.9735 5.70932 16.922 5.78987C16.8706 5.87042 16.7951 5.94357 16.7001 6.00513L10.5813 9.98113C10.4865 10.0429 10.3739 10.0919 10.25 10.1254C10.126 10.1588 9.99312 10.176 9.8589 10.176C9.72468 10.176 9.59178 10.1588 9.46783 10.1254C9.34387 10.0919 9.23129 10.0429 9.13655 9.98113Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Player Controls */}
            <div className="absolute left-0 top-[157px] w-[682px] h-[112px]">
              {/* Time */}
              <p className="absolute right-0 top-[73px] text-white font-asap text-[14px] font-normal leading-normal">
                00:00 / 00.00
              </p>

              {/* Main Play Button */}
              <svg className="absolute left-0 top-[49px] w-[63px] h-[63px]" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M48.8132 9.21514C44.6426 5.97532 39.6464 3.97089 34.393 3.42982C29.1397 2.88875 23.8399 3.83275 19.0964 6.15447C14.3529 8.47618 10.3562 12.0824 7.5607 16.5631C4.76522 21.0437 3.2832 26.2189 3.2832 31.5001C3.2832 36.7813 4.76522 41.9564 7.5607 46.4371C10.3562 50.9177 14.3529 54.524 19.0964 56.8457C23.8399 59.1674 29.1397 60.1114 34.393 59.5703C39.6464 59.0293 44.6426 57.0248 48.8132 53.785M52.8728 49.9276C57.2898 44.8042 59.7196 38.2646 59.7196 31.5001C59.7196 24.7355 57.2898 18.196 52.8728 13.0726"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M42.9871 29.6121L27.4379 20.6346C27.1071 20.4439 26.732 20.3436 26.3502 20.3438C25.9684 20.344 25.5933 20.4446 25.2627 20.6356C24.9321 20.8266 24.6575 21.1012 24.4666 21.4318C24.2757 21.7625 24.1752 22.1375 24.175 22.5193V40.4743C24.1752 40.8562 24.2757 41.2312 24.4666 41.5619C24.6575 41.8925 24.9321 42.1671 25.2627 42.3581C25.5933 42.5491 25.9684 42.6497 26.3502 42.6499C26.732 42.6501 27.1071 42.5498 27.4379 42.3591L42.9871 33.3816C43.318 33.1906 43.5928 32.9159 43.7838 32.5851C43.9749 32.2542 44.0755 31.8789 44.0755 31.4968C44.0755 31.1148 43.9749 30.7395 43.7838 30.4086C43.5928 30.0778 43.318 29.8031 42.9871 29.6121Z"
                  fill="white"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Skip Controls */}
              <div className="absolute left-[90px] top-0 w-16 h-[99px]">
                {/* 10s labels */}
                <p className="absolute left-0 top-[83px] text-white font-asap text-[14px] font-normal leading-normal">10s</p>
                <p className="absolute right-0 top-[83px] text-white font-asap text-[14px] font-normal leading-normal">10s</p>

                {/* Skip backward */}
                <svg className="absolute left-[3px] top-0 w-4 h-[11px]" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.09277 6.1759L7.8291 10.6866L7.8291 8.00696L8.33984 8.0177C10.0695 8.05431 11.4149 8.25071 12.5098 8.64758C13.7021 9.07995 14.5605 9.72638 15.4463 10.5216L15.4463 10.5226L15.6934 10.7443L15.6934 10.6329C15.6934 8.90722 15.2319 7.55862 14.3643 6.56848L14.1855 6.37512C12.9889 5.15181 11.049 4.44171 8.31348 4.35364L7.8291 4.33801L7.8291 1.66516L1.09277 6.1759Z"
                    fill="white"
                    stroke="white"
                  />
                </svg>

                {/* Skip forward */}
                <svg className="absolute right-[3px] top-0 w-4 h-[11px]" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.2939 6.1759L8.55762 10.6866V8.00696L8.04688 8.0177C6.31726 8.05431 4.97185 8.25071 3.87695 8.64758C2.68458 9.07995 1.82624 9.72638 0.94043 10.5216V10.5226L0.693359 10.7443V10.6329C0.693359 8.90722 1.15482 7.55862 2.02246 6.56848L2.20117 6.37512C3.39783 5.15181 5.33773 4.44171 8.07324 4.35364L8.55762 4.33801V1.66516L15.2939 6.1759Z"
                    fill="white"
                    stroke="white"
                  />
                </svg>
              </div>

              {/* Progress Bar */}
              <svg className="absolute left-[181px] top-[76px] w-[395px] h-[10px]" viewBox="0 0 395 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.00006H394.5" stroke="white" strokeWidth="2" />
                <circle cx="5" cy="5.00006" r="4.5" fill="white" stroke="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioPlayerSection;
