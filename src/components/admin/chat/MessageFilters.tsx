
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MessageFilter } from './types/messageTypes';

interface MessageFiltersProps {
  filter: MessageFilter;
  setFilter: (filter: MessageFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MessageFilters = ({ filter, setFilter, searchTerm, setSearchTerm }: MessageFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search messages..."
          className="pl-9 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
          className={filter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
          size="sm"
          className={filter === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Approved
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
          size="sm"
          className={filter === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          Rejected
        </Button>
      </div>
    </div>
  );
};

export default MessageFilters;
