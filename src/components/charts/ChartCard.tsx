
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrackData } from '@/types/charts';
import SongPositionIndicator from './SongPositionIndicator';
import { Music } from 'lucide-react';

interface ChartCardProps {
  title: string;
  period: string;
  data?: TrackData[];
}

const ChartCard = ({ title, period, data }: ChartCardProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white dark:text-white">{title}</CardTitle>
          <p className="text-sm text-gray-200 dark:text-gray-200">{period}</p>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-300 dark:text-gray-300">No chart data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white dark:text-white">{title}</CardTitle>
            <p className="text-sm text-gray-200 dark:text-gray-200">{period}</p>
          </div>
          <Badge variant="outline" className="bg-purple-900/20 text-purple-300 dark:text-purple-300 border-purple-700">
            {data.length} Tracks
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-white dark:text-white">Position</TableHead>
                <TableHead className="text-white dark:text-white">Track</TableHead>
                <TableHead className="hidden md:table-cell text-white dark:text-white">Artist</TableHead>
                <TableHead className="hidden md:table-cell text-white dark:text-white">Album</TableHead>
                <TableHead className="text-right text-white dark:text-white">Movement</TableHead>
                <TableHead className="text-right text-white dark:text-white">Plays</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((track) => (
                <TableRow key={track.id} className="hover:bg-muted/50 hover:bg-opacity-20">
                  <TableCell className="font-medium text-white dark:text-white">
                    <div className="flex items-center">
                      <span className="text-xl mr-2 text-white dark:text-white">{track.position}</span>
                      <span className="text-xs text-gray-300 dark:text-gray-300">
                        {track.prevPosition > 0 ? `was ${track.prevPosition}` : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white dark:text-white">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src={track.artwork} alt={track.title} />
                        <AvatarFallback>
                          <Music className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-white dark:text-white">{track.title}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-white dark:text-white">{track.artist}</TableCell>
                  <TableCell className="hidden md:table-cell text-white dark:text-white">{track.album}</TableCell>
                  <TableCell className="text-right">
                    <SongPositionIndicator 
                      prevPosition={track.prevPosition} 
                      movement={track.movement}
                    />
                  </TableCell>
                  <TableCell className="text-right text-white dark:text-white">{track.plays.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
