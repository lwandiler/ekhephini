import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Eye, Mail, Phone, Globe, CheckCircle, XCircle } from 'lucide-react';

interface AdRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website_url?: string;
  ad_type: string;
  message?: string;
  budget_range?: string;
  preferred_duration?: string;
  status: string;
  created_at: string;
}

const AdRequestsTab = () => {
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAdRequests();
  }, []);

  const loadAdRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdRequests(data || []);
    } catch (error) {
      console.error('Error loading ad requests:', error);
      toast({
        title: "Error",
        description: "Failed to load ad requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('ad_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setAdRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );

      toast({
        title: "Success",
        description: `Ad request status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Ad Requests</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ad Requests</h2>
        <Badge variant="outline">{adRequests.length} Total Requests</Badge>
      </div>

      {adRequests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No ad requests yet</p>
              <p>Ad requests will appear here when users submit the form on the Shows page.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {adRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.company_name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Contact: {request.contact_name} • {formatDate(request.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedRequest(
                        expandedRequest === request.id ? null : request.id
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ad Type</p>
                    <p className="text-sm capitalize">{request.ad_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget</p>
                    <p className="text-sm">{request.budget_range || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-sm">{request.preferred_duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-sm capitalize">{request.status}</p>
                  </div>
                </div>

                {expandedRequest === request.id && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                            {request.email}
                          </a>
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                              {request.phone}
                            </a>
                          </div>
                        )}
                        {request.website_url && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <a 
                              href={request.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {request.website_url}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {request.message && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Message</p>
                          <p className="text-sm bg-gray-50 p-3 rounded">{request.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, 'contacted')}
                        disabled={request.status === 'contacted'}
                      >
                        Mark as Contacted
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, 'approved')}
                        disabled={request.status === 'approved'}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, 'rejected')}
                        disabled={request.status === 'rejected'}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdRequestsTab;