
import { useMessageManagement } from './chat/hooks/useMessageManagement';
import MessageFilters from './chat/MessageFilters';
import MessageTable from './chat/MessageTable';
import MessageViewDialog from './chat/MessageViewDialog';

const ChatMessagesTab = () => {
  const {
    messages,
    loading,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedMessage,
    isViewDialogOpen,
    setIsViewDialogOpen,
    handleApprove,
    handleReject,
    handleDelete,
    viewMessage
  } = useMessageManagement();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Chat Messages</h2>
          <p className="text-muted-foreground">Manage and moderate user chat messages</p>
        </div>
        
        <MessageFilters 
          filter={filter} 
          setFilter={setFilter} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </div>
      
      <MessageTable 
        messages={messages}
        loading={loading}
        onView={viewMessage}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
      
      {/* View Message Dialog */}
      <MessageViewDialog 
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        message={selectedMessage}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ChatMessagesTab;
