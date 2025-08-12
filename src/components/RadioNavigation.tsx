import { Link, useLocation } from 'react-router-dom';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const RadioNavigation = () => {
  const { togglePlayPause, isPlaying } = useAudioPlayer();
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="w-full h-[111px] bg-white shadow-lg relative z-10">
      <div className="w-full h-full px-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/440913099aa7d9071a45bc3199334e3ff05b9d7e?width=226"
            alt="Radio Station Logo"
            className="w-[113px] h-[71px] object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-[52px]">
          <Link 
            to="/" 
            className="font-asap text-[16px] font-medium text-black"
          >
            Home
          </Link>
          <div
            onClick={() => {
              if (location.pathname === '/') {
                // Scroll to shows section on home page
                const showsSection = document.getElementById('shows-section');
                if (showsSection) {
                  showsSection.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                // Navigate to home page and then scroll to shows section
                window.location.href = '/#shows-section';
              }
            }}
            className="font-asap text-[16px] font-medium text-black cursor-pointer"
          >
            Shows
          </div>
          <Link 
            to="/schedule" 
            className="font-asap text-[16px] font-medium text-black"
          >
            Schedule
          </Link>
          <Link 
            to="/podcasts" 
            className="font-asap text-[16px] font-medium text-black"
          >
            Podcasts
          </Link>
          <Link 
            to="/about" 
            className="font-asap text-[16px] font-medium text-black"
          >
            About Us
          </Link>
          {!user && (
            <Link 
              to="/auth" 
              className="font-asap text-[16px] font-medium text-primary"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Radio Player Controls */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlayPause}
            className="relative cursor-pointer !bg-white hover:!bg-white hover:!opacity-100"
            style={{ backgroundColor: 'white !important' }}
            title={isPlaying ? "Pause" : "Play"}
          >
            {/* Outer circle - play button */}
            <svg className="w-14 h-[52px]" viewBox="0 0 58 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M46.53 6.98699C42.3594 3.9804 37.3632 2.12027 32.1098 1.61815C26.8565 1.11603 21.5567 1.99208 16.8132 4.14666C12.0697 6.30123 8.07298 9.64786 5.2775 13.8059C2.48202 17.964 1 22.7666 1 27.6676C1 32.5686 2.48202 37.3712 5.2775 41.5293C8.07298 45.6874 12.0697 49.034 16.8132 51.1886C21.5567 53.3432 26.8565 54.2192 32.1098 53.7171C37.3632 53.215 42.3594 51.3549 46.53 48.3483M50.5896 44.7685C55.0066 40.0139 57.4363 33.9452 57.4363 27.6676C57.4363 21.39 55.0066 15.3213 50.5896 10.5667"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Inner play/pause icon */}
            {isPlaying ? (
              // Pause icon
              <div className="absolute top-[18px] left-[22px] flex space-x-1">
                <div className="w-[3px] h-[17px] bg-black"></div>
                <div className="w-[3px] h-[17px] bg-black"></div>
              </div>
            ) : (
              // Play triangle
              <svg className="absolute top-[16px] left-[19px] w-5 h-[21px]" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.7039 9.85756L4.15472 1.52635C3.82393 1.34941 3.44879 1.25634 3.06698 1.2565C2.68517 1.25666 2.31012 1.35004 1.97951 1.52727C1.64889 1.7045 1.37434 1.95933 1.18342 2.26618C0.992506 2.57303 0.891949 2.9211 0.891846 3.27542V19.9378C0.891949 20.2922 0.992506 20.6402 1.18342 20.9471C1.37434 21.2539 1.64889 21.5088 1.97951 21.686C2.31012 21.8632 2.68517 21.9566 3.06698 21.9568C3.44879 21.9569 3.82393 21.8639 4.15472 21.6869L19.7039 13.3557C20.0348 13.1785 20.3096 12.9235 20.5006 12.6165C20.6917 12.3095 20.7923 11.9612 20.7923 11.6066C20.7923 11.2521 20.6917 10.9038 20.5006 10.5968C20.3096 10.2897 20.0348 10.0348 19.7039 9.85756Z"
                  fill="black"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* Radio Info */}
          <div className="text-right">
            <div className="font-asap text-[16px] font-normal leading-normal">
              <span className="text-black font-bold">live</span>
              <br />
              <span className="text-[#5F5F5F]">LIVE. 96.3 FM</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RadioNavigation;
