import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Users, Database, Mail } from 'lucide-react';

const PrivacyLegal = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#004995] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy & Legal</h1>
          <p className="text-xl opacity-90">Your privacy and our legal commitments</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Privacy Policy
              </CardTitle>
              <CardDescription>
                How we collect, use, and protect your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us, such as when you contact us, 
                  subscribe to our newsletter, or interact with our radio services. This may include 
                  your name, email address, phone number, and any messages you send to us.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and improve our radio broadcasting services</li>
                  <li>To send you newsletters and updates about our programming</li>
                  <li>To respond to your inquiries and customer service requests</li>
                  <li>To comply with legal obligations and protect our rights</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. Your data 
                  is stored securely and we never sell your personal information to third parties.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Right to access your personal data</li>
                  <li>Right to rectify inaccurate information</li>
                  <li>Right to erase your data (where applicable)</li>
                  <li>Right to unsubscribe from our communications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Terms of Service
              </CardTitle>
              <CardDescription>
                Terms and conditions for using our radio services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Usage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ekhepini Community Radio provides broadcasting services for entertainment, 
                  information, and community engagement. By using our services, you agree to 
                  use them lawfully and respectfully.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Content Guidelines</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>No offensive, harmful, or inappropriate content</li>
                  <li>Respect intellectual property rights</li>
                  <li>No spam or commercial solicitation without permission</li>
                  <li>Maintain respectful community interaction</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Disclaimer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our broadcasting content is provided "as is" for entertainment and informational 
                  purposes. We strive for accuracy but do not guarantee the completeness or 
                  reliability of all information broadcast.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Broadcasting License */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                Broadcasting License
              </CardTitle>
              <CardDescription>
                Our authorization and compliance information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">License Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ekhepini Community Radio operates under the appropriate broadcasting licenses 
                  issued by the relevant South African authorities. We are committed to 
                  maintaining compliance with all broadcasting regulations and standards.
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">Community Service</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  As a community radio station, we serve the Barkly East and Joe Gabi District 
                  communities, providing local content, community announcements, and programming 
                  that reflects our community's interests and needs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Contact Us
              </CardTitle>
              <CardDescription>
                Questions about privacy or legal matters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, our Terms of Service, 
                or any legal matters, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> phumlanichrist@gmail.com</p>
                <p><strong>Phone:</strong> 0742578799</p>
                <p><strong>Address:</strong> Barkly East, Joe Gabi District, Eastern Cape</p>
                <p><strong>Website:</strong> www.khephinifm.co.za</p>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyLegal;