import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, Users, Target, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';

const About = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-white font-asap">
      {/* Navigation */}
      <RadioNavigation />
      
      {/* Main Content */}
      <div className="bg-gradient-to-b from-background to-muted/20">
        <div className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Button
                onClick={handleBackToHome}
                variant="ghost"
                className="mb-6 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                <Radio className="h-10 w-10 text-primary" />
                About Us
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn more about Ekhephini FM - your community radio station serving the Joe Gqabi District since 2006.
              </p>
            </div>

            {/* Hero Section */}
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30 mb-12">
              <CardHeader className="bg-yellow-400 border-b text-center">
                <CardTitle className="text-2xl font-bold">Ekhephini FM 107.9</CardTitle>
                <Badge variant="secondary" className="mx-auto mt-2">Community Radio • Since 2006</Badge>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Ekhephini FM is a community-owned, nonprofit radio station based in Barkly East, serving the Joe Gqabi District in the Eastern Cape. The station officially launched in 2006, having been set in motion by community members in late 2005, and operates on 107.9 FM from its base at the De Villiers Street library building. It broadcasts round-the-clock in IsiXhosa, English, Sesotho, and Afrikaans—a station by locals, for locals.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30">
                <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/10 border-b">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    To inform, entertain, and educate the people of Joe Gqabi through participatory radio programming, delivered in partnership with both public and private stakeholders.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30">
                <CardHeader className="bg-gradient-to-r from-secondary/20 to-accent/10 border-b">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary" />
                    Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    To empower and unify local communities by maintaining an accessible, high-quality broadcasting service that is deeply rooted in our cultural identity and local realities.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Community Focus */}
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-primary/5 to-secondary/5 mb-12">
              <CardContent className="p-8 text-center">
                <p className="text-xl font-semibold text-primary mb-4">
                  This is more than radio—it&apos;s about local conversations, civic participation, and cultural continuity.
                </p>
              </CardContent>
            </Card>

            {/* Content Information */}
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30">
              <CardHeader className="bg-gradient-to-r from-accent/20 to-primary/10 border-b">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-8 w-8 text-primary" />
                  What Our Content Is About
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Ekhephini FM aims for a rough 60% talk-to-information and 40% music split. Substance first.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Talk & Information Programming</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        Local news bulletins and public service talk shows that address health, agriculture, education, voter participation, and municipal services.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        Call-in and interactive segments, blending listener voices and local expertise in real time.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Music & Cultural Programming</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        Music programming focused on traditional Xhosa, local artists and cultures, interwoven with international content (about 90/10 ratio).
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        Community empowerment through radio—you&apos;ll find featured stories, training information, church spotlights, events listings, and local talent showcases in every slot.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages Section */}
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold mb-4">Broadcasting Languages</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="text-sm px-4 py-2">IsiXhosa</Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">English</Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">Sesotho</Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">Afrikaans</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Broadcasting 24/7 from De Villiers Street library building, Barkly East
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Footer */}
      <NewsletterFooter />
    </div>
  );
};

export default About;