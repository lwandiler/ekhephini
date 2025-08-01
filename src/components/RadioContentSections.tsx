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

          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/9aefcb01b5008efd9d11167375fdeee3b51a31ba?width=1110" alt="Design Inspiration" className="w-full max-w-[555px] h-auto md:h-[558px] object-cover rounded-[30px]" />
          </div>
        </div>
      </section>

    </div>;
};
export default RadioContentSections;