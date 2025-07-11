import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { featuredNewsData } from '@/data/mockData';

const newsArticles = [
  {
    id: 1,
    title: "Local Music Festival Announces Lineup",
    excerpt: "The annual City Sound Festival has revealed its star-studded lineup for this year's event, featuring both international stars and local talent.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-28",
    author: "Jessica Winters",
    category: "Events"
  },
  {
    id: 2,
    title: "New Morning Show Host Joins Radio Wave Hub",
    excerpt: "We're excited to welcome Alex Johnson as our new morning show host starting next Monday. Alex brings 10 years of radio experience and a passion for great music.",
    image: "https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-25",
    author: "Editorial Team",
    category: "Station News"
  },
  {
    id: 3,
    title: "Interview: Rising Star Talks New Album",
    excerpt: "In an exclusive interview with Radio Wave Hub, emerging artist Maya Lee discusses her creative process and the inspirations behind her debut album.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-22",
    author: "Marcus King",
    category: "Interviews"
  },
  {
    id: 4,
    title: "Listeners' Choice Awards Voting Now Open",
    excerpt: "Cast your vote for your favorite shows, hosts, and music in our annual Listeners' Choice Awards. Winners will be announced during our special broadcast.",
    image: "https://images.unsplash.com/photo-1566981731417-d4c8ec28dccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-20",
    author: "Sarah Johnson",
    category: "Station News"
  },
  {
    id: 5,
    title: "Concert Review: Stadium Show Dazzles Fans",
    excerpt: "Last night's concert at the city stadium was a spectacular display of music and showmanship that left the audience wanting more.",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-18",
    author: "Michael Rodriguez",
    category: "Reviews"
  },
  {
    id: 6,
    title: "Music Industry Changes Post-Pandemic",
    excerpt: "A look at how the music and radio industry has evolved since the pandemic and what changes are here to stay.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: "2025-04-15",
    author: "David Chen",
    category: "Industry News"
  }
];

const News = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-radio-blue text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">News & Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Stay up to date with the latest news from the world of music, radio, and our station.
            </p>
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* News Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="all" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">All News</TabsTrigger>
                  <TabsTrigger value="station" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Station News</TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Events</TabsTrigger>
                  <TabsTrigger value="interviews" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Interviews</TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Reviews</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <NewsList news={newsArticles} />
              </TabsContent>
              
              <TabsContent value="station">
                <NewsList news={newsArticles.filter(item => item.category === "Station News")} />
              </TabsContent>
              
              <TabsContent value="events">
                <NewsList news={newsArticles.filter(item => item.category === "Events")} />
              </TabsContent>
              
              <TabsContent value="interviews">
                <NewsList news={newsArticles.filter(item => item.category === "Interviews")} />
              </TabsContent>
              
              <TabsContent value="reviews">
                <NewsList news={newsArticles.filter(item => item.category === "Reviews")} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-radio-blue mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Get the latest news, show updates, and exclusive content delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border rounded-md flex-1"
              />
              <button className="bg-radio-accent hover:bg-radio-accent/80 text-white px-6 py-2 rounded-md font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <RadioPlayer />
      <ChatBot />
    </div>
  );
};

export default News;
