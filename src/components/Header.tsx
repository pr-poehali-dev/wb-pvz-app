import React from 'react';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Package" className="text-white" size={20} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">ID 50006760</div>
            <div className="text-xs text-muted-foreground">V1.0.67</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Icon name="Menu" size={20} className="text-muted-foreground" />
          <Icon name="ShoppingCart" size={20} className="text-muted-foreground" />
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default Header;