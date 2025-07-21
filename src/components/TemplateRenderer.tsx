
import React from 'react';
import ClassicTemplate from '@/templates/ClassicTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import MinimalistTemplate from '@/templates/MinimalistTemplate';
import { ThemeOptions } from '@/types/theme';
import { Podcast } from '@/components/PodcastCard';

interface TemplateRendererProps {
  featuredShows: any[];
  featuredNews: any[];
  featuredPodcasts: Podcast[];
  themeOptions: ThemeOptions;
  onListenLiveClick?: () => void;
  onPlayPodcast?: (podcast: Podcast) => void;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  featuredShows,
  featuredNews,
  featuredPodcasts,
  themeOptions,
  onListenLiveClick,
  onPlayPodcast
}) => {
  switch (themeOptions.type) {
    case 'modern':
      return (
        <ModernTemplate 
          featuredShows={featuredShows} 
          featuredNews={featuredNews}
          featuredPodcasts={featuredPodcasts}
          themeOptions={themeOptions}
          onListenLiveClick={onListenLiveClick}
          onPlayPodcast={onPlayPodcast}
        />
      );
    case 'minimalist':
      return (
        <MinimalistTemplate 
          featuredShows={featuredShows} 
          featuredNews={featuredNews}
          featuredPodcasts={featuredPodcasts}
          themeOptions={themeOptions}
          onListenLiveClick={onListenLiveClick}
          onPlayPodcast={onPlayPodcast}
        />
      );
    default:
      return (
        <ClassicTemplate 
          featuredShows={featuredShows}
          featuredNews={featuredNews}
          featuredPodcasts={featuredPodcasts}
          onListenLiveClick={onListenLiveClick}
          onPlayPodcast={onPlayPodcast}
        />
      );
  }
};

export default TemplateRenderer;
