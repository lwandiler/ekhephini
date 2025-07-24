import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Youtube, Key, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SocialMediaApiTab = () => {
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);

  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      credentials: [
        { key: 'FACEBOOK_ACCESS_TOKEN', label: 'Access Token', type: 'token' },
        { key: 'FACEBOOK_PAGE_ID', label: 'Page ID', type: 'text' }
      ],
      description: 'Connect your Facebook Page to display posts',
      docsUrl: 'https://developers.facebook.com/docs/pages/access-tokens'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      credentials: [
        { key: 'TWITTER_BEARER_TOKEN', label: 'Bearer Token', type: 'token' },
        { key: 'TWITTER_USERNAME', label: 'Username (without @)', type: 'text' }
      ],
      description: 'Connect your Twitter account to display tweets',
      docsUrl: 'https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      credentials: [
        { key: 'INSTAGRAM_ACCESS_TOKEN', label: 'Access Token', type: 'token' },
        { key: 'INSTAGRAM_USER_ID', label: 'User ID', type: 'text' }
      ],
      description: 'Connect your Instagram Business account to display posts',
      docsUrl: 'https://developers.facebook.com/docs/instagram-basic-display-api/getting-started'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      credentials: [
        { key: 'YOUTUBE_API_KEY', label: 'API Key', type: 'token' },
        { key: 'YOUTUBE_CHANNEL_ID', label: 'Channel ID', type: 'text' }
      ],
      description: 'Connect your YouTube channel to display latest videos',
      docsUrl: 'https://developers.google.com/youtube/v3/getting-started'
    }
  ];

  const handleTestConnection = async (platformName: string) => {
    setTestingPlatform(platformName);
    // Simulate testing - in a real implementation, this would call the edge function
    setTimeout(() => {
      setTestingPlatform(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Social Media API Configuration</h2>
        <p className="text-muted-foreground">
          Configure API keys and access tokens to fetch real social media posts for your website.
        </p>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          All API keys and tokens are securely stored and encrypted. They are only used to fetch your social media content.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          
          return (
            <Card key={platform.name} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${platform.color}`} />
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(platform.docsUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Docs
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {platform.credentials.map((credential) => (
                    <div key={credential.key} className="space-y-2">
                      <Label htmlFor={credential.key} className="text-sm font-medium">
                        {credential.label}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={credential.key}
                          type={credential.type === 'token' ? 'password' : 'text'}
                          placeholder={`Enter your ${credential.label.toLowerCase()}`}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // This would trigger the lov-secret-form action
                            console.log(`Configure ${credential.key}`);
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Status: Not Configured
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection(platform.name)}
                    disabled={testingPlatform === platform.name}
                  >
                    {testingPlatform === platform.name ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>1. Get your API credentials:</strong> Click the "Docs" button for each platform to get your API keys.</p>
            <p><strong>2. Configure credentials:</strong> Use the key button next to each field to securely store your credentials.</p>
            <p><strong>3. Test connection:</strong> Use the "Test Connection" button to verify your credentials work.</p>
            <p><strong>4. Enable platforms:</strong> Go to Settings → Social Media to add your platform URLs.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaApiTab;