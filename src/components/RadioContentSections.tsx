const RadioContentSections = () => {
  return <div className="w-full bg-white">
      {/* Best Place Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="flex-1 mt-4 md:mt-8">
            {/* Play Icon */}
            

            {/* Episode Info */}
            <div className="mb-4">
              
              
            </div>

            {/* Title */}
            <h2 className="max-w-[328px] text-black font-asap text-2xl md:text-3xl lg:text-[40px] font-bold leading-normal mb-8">
              Welcome to Ekhephini FM 107.9 FM – “Izwi Lenkqubela” 
            </h2>

            {/* Description */}
            <p className="max-w-[611px] text-[#5F5F5F] font-asap text-lg md:text-xl lg:text-[25px] font-normal leading-normal mb-8 text-left">
              Listen Live – Whether you’re in your township or on your farm, the signal is here to connect you. 
              <br /><br />
              View Today’s Schedule at a Glance – Know what’s airing when so you never miss local conversations that matter. 
              <br /><br />
              Join In – Ask questions, share stories, shout out to favourites—on air or via WhatsApp; your voice belongs here. 
              <br /><br />
            </p>

          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/9aefcb01b5008efd9d11167375fdeee3b51a31ba?width=1110" alt="Design Inspiration" loading="lazy" className="w-full h-auto object-cover rounded-[30px]" />
          </div>
        </div>
      </section>

    </div>;
};
export default RadioContentSections;