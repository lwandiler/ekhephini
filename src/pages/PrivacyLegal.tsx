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
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Thank you for visiting the website of Ekhephini FM ("the Station"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, share, and protect information collected through our website in accordance with the Protection of Personal Information Act (POPIA) and other applicable South African privacy laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Information Collection</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We may collect the following types of information when you visit our website:
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information:</h4>
                    <p className="text-muted-foreground text-sm">
                      We may collect personal information that you voluntarily provide to us, such as your name, email address, or phone number when you subscribe to our newsletter or contact us through our website.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Non-Personal Information:</h4>
                    <p className="text-muted-foreground text-sm">
                      We may automatically collect non-personal information, including your IP address, browser type, device information, and browsing patterns, through cookies or similar technologies.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Use of Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                  <li>To communicate with you and respond to your inquiries or requests</li>
                  <li>To personalize your experience on our website and improve our content and services</li>
                  <li>To analyze website traffic and usage trends to optimize our website's performance and functionality</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Third-Party Services</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may use third-party services, such as Google Analytics, to collect and analyze website usage data. These third-party services may use cookies or similar technologies to track your interactions with our website. Please refer to the privacy policies of these third-party services for more information on their data practices.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or as necessary to provide services on our behalf. We may share non-personal information with third-party service providers for the purpose of website analytics or other legitimate business purposes.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We take reasonable measures to protect the security of your personal information and prevent unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Retention</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We retain personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. If you would like us to delete your personal information from our records, please contact us using the information provided below.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">User Rights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to access, update, or delete your personal information held by us. If you would like to exercise any of these rights or have any questions or concerns about our privacy practices, please contact us.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Children's Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our website is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you are under 13 years of age, please do not provide any personal information on our website.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Changes to the Privacy Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately upon posting the revised Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any updates.
                </p>
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
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms and Conditions govern your use of the website of Ekhephini FM ("the Station"). By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these Terms and Conditions, you may not use our website.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Use of Website</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Access:</h4>
                    <p className="text-muted-foreground text-sm">
                      You must be at least 18 years old to access and use our website. By accessing our website, you represent that you are at least 18 years old or have the necessary legal capacity to enter into these Terms and Conditions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">License:</h4>
                    <p className="text-muted-foreground text-sm">
                      We grant you a limited, non-exclusive, non-transferable license to access and use our website for your personal, non-commercial use. You may not reproduce, distribute, modify, or create derivative works based on our website or its content without our prior written consent.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Content:</h4>
                    <p className="text-muted-foreground text-sm">
                      All content available on our website, including text, images, audio, and video, is the property of Ekhephini FM or its licensors and is protected by copyright laws. You may not use, copy, or distribute any content from our website without our permission.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">User Conduct:</h4>
                    <p className="text-muted-foreground text-sm">
                      You agree to use our website in compliance with applicable laws and regulations and in a manner that does not infringe upon the rights of others or interfere with the operation of our website. You may not engage in any conduct that is unlawful, defamatory, harassing, or otherwise objectionable.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Privacy</h3>
                <div>
                  <h4 className="font-medium mb-2">Privacy Policy:</h4>
                  <p className="text-muted-foreground text-sm">
                    Your use of our website is subject to our Privacy Policy, which governs the collection, use, and protection of your personal information. By using our website, you consent to the terms of our Privacy Policy.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Disclaimer:</h4>
                    <p className="text-muted-foreground text-sm">
                      Our website is provided on an "as is" and "as available" basis without any warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content on our website.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Limitation of Liability:</h4>
                    <p className="text-muted-foreground text-sm">
                      In no event shall Ekhephini FM or its affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website, including but not limited to damages for loss of profits, data, or goodwill.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Indemnification</h3>
                <p className="text-muted-foreground text-sm">
                  You agree to indemnify and hold harmless Ekhephini FM, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of or in connection with your use of our website or your violation of these Terms and Conditions.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Governing Law</h3>
                <p className="text-muted-foreground text-sm">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of South Africa. Any dispute arising out of or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of South Africa.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Changes to Terms and Conditions</h3>
                <p className="text-muted-foreground text-sm">
                  We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Any changes will be effective immediately upon posting the revised Terms and Conditions on our website. Your continued use of our website after the posting of changes constitutes your acceptance of the updated Terms and Conditions.
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