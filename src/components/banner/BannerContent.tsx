
import React from "react";
import { Button } from "@/components/ui/button";
import { Radio, Music, Headphones, Video } from "lucide-react";

interface BannerContentProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  url?: string;
  id: string;
}

const BannerContent: React.FC<BannerContentProps> = ({
  title,
  subtitle,
  ctaText,
  url,
  id
}) => {
  const getRandomIcon = (id: string) => {
    const icons = [
      <Radio size={24} className="text-green-400" key="radio" />, 
      <Music size={24} className="text-green-400" key="music" />, 
      <Headphones size={24} className="text-green-400" key="headphones" />, 
      <Video size={24} className="text-green-400" key="video" />
    ];

    // Use the first character of the UUID to determine the icon
    const charCode = id.charCodeAt(0);
    return icons[charCode % icons.length];
  };

  return <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 sm:p-12 z-20">
      <div className="max-w-3xl">
        <h3 className="text-3xl sm:text-5xl font-bold text-white mb-3 font-second">
          {title}
        </h3>
        {subtitle && <p className="text-lg sm:text-xl text-gray-200 mb-6">
            {subtitle}
          </p>}
        {ctaText && <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg py-6 px-8">
            {getRandomIcon(id)}
            <span className="ml-2">{ctaText}</span>
          </Button>}
      </div>
    </div>;
};

export default BannerContent;
