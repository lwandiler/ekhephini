
import React from "react";
import BannerMedia from "./BannerMedia";
import BannerContent from "./BannerContent";

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  url: string;
  ctaText?: string;
}

interface BannerSlideProps {
  banner: Banner;
}

const BannerSlide: React.FC<BannerSlideProps> = ({ banner }) => {
  return (
    <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
      <a href={banner.url || "#"} className="block w-full h-full">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <BannerMedia 
          mediaType={banner.mediaType} 
          mediaUrl={banner.mediaUrl} 
          title={banner.title} 
        />
        <BannerContent 
          title={banner.title} 
          subtitle={banner.subtitle} 
          ctaText={banner.ctaText} 
          url={banner.url} 
          id={banner.id} 
        />
      </a>
    </div>
  );
};

export default BannerSlide;
