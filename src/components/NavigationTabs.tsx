import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowAudioUploader: () => void;
}

const NavigationTabs = ({ activeTab, onTabChange, onShowAudioUploader }: NavigationTabsProps) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="flex max-w-md mx-auto">
        {['выдача', 'приёмка', 'возврат'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-4 px-2 text-center relative transition-colors ${
              activeTab === tab 
                ? 'text-primary font-medium' 
                : 'text-muted-foreground hover:text-primary/70'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name={
                tab === 'выдача' ? 'Package' : 
                tab === 'приёмка' ? 'PackageCheck' : 
                'RotateCcw'
              } size={16} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-scale-in" />
            )}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center p-2 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowAudioUploader}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          <Icon name="Volume2" size={12} className="mr-1" />
          Настроить озвучку
        </Button>
        <Badge variant="secondary" className="bg-muted">
          <Icon name="RotateCcw" size={12} className="mr-1" />
          13
        </Badge>
      </div>
    </div>
  );
};

export default NavigationTabs;