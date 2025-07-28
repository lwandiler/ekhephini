
import React from "react";

interface BannerContentProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  url?: string;
  id: string;
}

const BannerContent: React.FC<BannerContentProps> = ({
  title,
  subtitle
}) => {

  return <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 sm:p-12 z-20">
      <div className="max-w-3xl">
        <h3 className="text-3xl sm:text-5xl font-bold text-white mb-3 font-second">
          {title}
        </h3>
        {subtitle && <p className="text-lg sm:text-xl text-gray-200 mb-6">
            {subtitle}
          </p>}
      </div>
    </div>;
};

export default BannerContent;
