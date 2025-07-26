
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Radio, Play, Heart } from "lucide-react";
import { useState } from "react";

interface ShowCardProps {
  id: number;
  title: string;
  host: string;
  time: string;
  description: string;
  image?: string;
  isLive?: boolean;
}

const ShowCard = ({ 
  title, 
  host, 
  time, 
  description, 
  image, 
  isLive = false 
}: ShowCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gray-900 border-gray-800 text-white group">
      <div className="relative">
        <img 
          src={image || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
        
        {isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE NOW
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 hover:bg-gray-800`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
        <CardDescription className="text-gray-300">Hosted by {host}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <Clock size={16} className="mr-2" />
          <span>{time}</span>
        </div>
        <p className="text-gray-300">{description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300"
        >
          <Radio className="mr-2 h-4 w-4" />
          Details
        </Button>
        <Button 
          variant="default" 
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
        >
          <Play className="mr-2 h-4 w-4" fill="currentColor" />
          Listen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShowCard;
