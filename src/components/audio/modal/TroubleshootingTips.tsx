
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const TroubleshootingTips: React.FC = () => {
  return (
    <div className="mt-4">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors">
          <HelpCircle size={12} />
          <span className="text-xs">Having trouble playing?</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="text-xs mt-2 space-y-2 text-gray-200">
          <p>• Try clicking the Play button multiple times</p>
          <p>• Refresh the page and try again</p>
          <p>• Try opening the stream in a new tab</p>
          <p>• Make sure your device isn't muted</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TroubleshootingTips;
