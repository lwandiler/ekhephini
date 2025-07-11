
import { Message } from './types/messageTypes';
import { LoadingState, EmptyState } from './MessageTableStates';
import MessageTableRow from './MessageTableRow';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MessageTableProps {
  messages: Message[];
  loading: boolean;
  onView: (message: Message) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const MessageTable = ({
  messages,
  loading,
  onView,
  onApprove,
  onReject,
  onDelete
}: MessageTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingState colSpan={5} />
          ) : messages.length === 0 ? (
            <EmptyState colSpan={5} />
          ) : (
            messages.map((message) => (
              <MessageTableRow 
                key={message.id}
                message={message}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MessageTable;
