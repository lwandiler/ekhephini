
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

const NewsList = ({ news = mockNews, compact = false }: NewsListProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Use the provided news items or the mock ones if not provided
  const displayNews = news.length > 0 ? news : mockNews;

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
    <div className={`grid ${compact ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
      {displayNews.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gray-900 border-gray-800 text-white group h-full flex flex-col">
          {!compact && (
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>
            </div>
          )}
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-medium ${getCategoryColor(item.category)} text-white px-2 py-1 rounded-full flex items-center gap-1`}>
                <Tag size={12} />
                {item.category}
              </span>
            </div>
            <CardTitle className={`${compact ? "text-lg" : "text-xl"} text-white group-hover:text-purple-300 transition-colors duration-300`}>
              {item.title}
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-gray-400 mt-2">
              <div className="flex items-center mr-3">
                <Calendar size={14} className="mr-1 text-purple-400" />
                {formatDate(item.date)}
              </div>
              <div className="flex items-center">
                <User size={14} className="mr-1 text-purple-400" />
                {item.author}
              </div>
            </CardDescription>
          </CardHeader>
          
           {!compact && (
            <CardContent className="flex-1">
              <div 
                className="text-gray-300 prose prose-sm prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: item.excerpt }}
              />
            </CardContent>
          )}
          
          <CardFooter className={`${compact ? "pt-2 pb-4" : ""} mt-auto`}>
            <Button 
              variant="outline" 
              size={compact ? "sm" : "default"}
              className="text-purple-400 border-purple-600 hover:bg-purple-700 hover:text-white transition-all duration-300"
              asChild
            >
              <Link to={`/news/${item.id}`} className="flex items-center">
                Read More
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NewsList;
