import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

const RadioHeroSection = () => {
  const { isPlaying, isLoading, togglePlayPause } = useAudioPlayer();
  
  return (
    <section className="relative w-full min-h-[60vh] md:h-[600px] lg:h-[814px] overflow-hidden">
      {/* Background Image */}
      <img
        src="/lovable-uploads/47de82cb-61f3-4149-8be9-97f88490213c.png"
        alt="Radio Station Background"
        className="absolute inset-0 w-full h-full object-cover backdrop-blur-[50px]"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div>

      {/* Logo Overlay */}
      {/* <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/83493488be7d7e8aac21d19be5cf584126ee0efc?width=660"
        alt="Station Logo"
        className="absolute right-[160px] top-[350px] w-[330px] h-[207px] object-contain"
      /> */}

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 lg:px-16 xl:px-[185px] py-8 md:py-16 lg:py-32 xl:py-[209px] h-full flex flex-col justify-start">
        <h1 className="max-w-[600px] text-white font-asap text-4xl md:text-6xl lg:text-7xl xl:text-[96px] font-bold leading-normal mb-8 md:mb-12">
          Ekhephini FM 107.9 FM 
        </h1>

        <p className="max-w-[575px] text-white font-asap text-lg md:text-xl lg:text-2xl xl:text-[25px] font-normal leading-normal mb-12 md:mb-16">
          Since 2006, we have been the voice of progress for Barkly East and the wider Joe Gqabi District—broadcasting in your language, sharing your news, and building your community’s stories, 24/7. 
        </p>

        {/* Listen Live Button */}
        <div className="flex">
          <button 
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-[210px] h-[69px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-[50px] backdrop-blur-[45px] flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-[39px] h-[39px] animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : isPlaying ? (
                <svg className="w-[39px] h-[39px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" fill="white" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" fill="white" rx="1"/>
                </svg>
              ) : (
                <svg className="w-[39px] h-[39px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="5,3 19,12 5,21" fill="white"/>
                </svg>
              )}
              <div className="text-left">
                <div className="text-white font-asap text-[16px] font-bold leading-normal">
                  {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : 'Listen Live'}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RadioHeroSection;
