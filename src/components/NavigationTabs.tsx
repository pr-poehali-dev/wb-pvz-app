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
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-center gap-8 px-6 py-4">
        <div 
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === 'выдача' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
          }`}
          onClick={() => onTabChange('выдача')}
        >
          <Icon name="Package" size={24} className="mb-2" />
          <span className="text-sm font-medium">Выдача</span>
          {activeTab === 'выдача' && (
            <div className="w-full h-0.5 bg-purple-600 mt-2" />
          )}
        </div>
        
        <div 
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === 'приёмка' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
          }`}
          onClick={() => onTabChange('приёмка')}
        >
          <Icon name="Truck" size={24} className="mb-2" />
          <span className="text-sm font-medium">Приёмка</span>
        </div>
        
        <div 
          className={`flex flex-col items-center cursor-pointer relative ${
            activeTab === 'возврат' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
          }`}
          onClick={() => onTabChange('возврат')}
        >
          <Icon name="RotateCcw" size={24} className="mb-2" />
          <span className="text-sm font-medium">Возврат</span>
          <span className="absolute -top-1 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            13
          </span>
        </div>
      </div>
      
      {/* Настройка озвучки - скрытая кнопка внизу */}
      <div className="flex justify-center pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowAudioUploader}
          className="text-xs text-gray-400 hover:text-purple-600"
        >
          <Icon name="Volume2" size={12} className="mr-1" />
          Настроить озвучку
        </Button>
      </div>
    </div>
  );
};

export default NavigationTabs;