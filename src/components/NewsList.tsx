
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

interface NewsListProps {
  news: NewsItem[];
  compact?: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Local Music Festival Announces Lineup",
    excerpt: "The annual City Sound Festival has revealed its star-studded lineup for this year's event, featuring both international stars and local talent.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-28",
    author: "Jessica Winters",
    category: "Events"
  },
  {
    id: "2",
    title: "New Morning Show Host Joins Radio Wave Hub",
    excerpt: "We're excited to welcome Alex Johnson as our new morning show host starting next Monday. Alex brings 10 years of radio experience and a passion for great music.",
    image: "https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-25",
    author: "Editorial Team",
    category: "Station News"
  },
  {
    id: "3",
    title: "Interview: Rising Star Talks New Album",
    excerpt: "In an exclusive interview with Radio Wave Hub, emerging artist Maya Lee discusses her creative process and the inspirations behind her debut album.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-22",
    author: "Marcus King",
    category: "Interviews"
  },
  {
    id: "4",
    title: "Listeners' Choice Awards Voting Now Open",
    excerpt: "Cast your vote for your favorite shows, hosts, and music in our annual Listeners' Choice Awards. Winners will be announced during our special broadcast.",
    image: "https://images.unsplash.com/photo-1566981731417-d4c8ec28dccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-20",
    author: "Sarah Johnson",
    category: "Station News"
  }
];

const NewsList = ({ news = [], compact = false }: NewsListProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Only show published news from database, no fallback to mock data
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No news articles published yet.</p>
      </div>
    );
  }

  // Map category to colors
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Events': 'bg-purple-600',
      'Station News': 'bg-blue-600',
      'Interviews': 'bg-pink-600',
      'Music': 'bg-green-600'
    };
    
    return categoryMap[category] || 'bg-purple-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <div key={item.id} className="bg-white rounded-[30px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#F99300] text-white px-3 py-1 rounded-[20px] font-asap text-[12px] font-bold">
              {item.category}
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-black font-asap text-[24px] font-bold leading-normal mb-2">
              {item.title}
            </h3>
            <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-2">
              By: {item.author}
            </p>
            <p className="text-[#5F5F5F] font-asap text-[14px] font-normal leading-normal mb-4">
              {formatDate(item.date)}
            </p>
            <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-6">
              {item.excerpt}
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="text-black font-asap text-[14px] font-normal leading-normal">Read More</span>
              <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.13655 11.4911L13.5123 6.70738H1.0198C0.74933 6.70738 0.489941 6.61907 0.298691 6.46189C0.107442 6.3047 -1.26765e-06 6.09152 -1.26765e-06 5.86923C-1.26765e-06 5.64693 0.107442 5.43375 0.298691 5.27656C0.489941 5.11938 0.74933 5.03107 1.0198 5.03107H13.5123L9.13655 1.4333C8.94497 1.27584 8.83734 1.06228 8.83734 0.839607C8.83734 0.61693 8.94497 0.403372 9.13655 0.245915C9.32813 0.0884585 9.58797 2.34629e-09 9.8589 0C10.1298 -2.34629e-09 10.3897 0.0884585 10.5813 0.245915L16.7001 5.27483C16.7951 5.3527 16.8706 5.44523 16.922 5.54711C16.9735 5.64899 17 5.75821 17 5.86853C17 5.97884 16.9735 6.08807 16.922 6.18995C16.8706 6.29183 16.7951 6.38435 16.7001 6.46222L10.5813 11.4911C10.4865 11.5693 10.3739 11.6313 10.25 11.6736C10.126 11.7159 9.99312 11.7377 9.8589 11.7377C9.72468 11.7377 9.59178 11.7159 9.46783 11.6736C9.34387 11.6313 9.23129 11.5693 9.13655 11.4911Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
