import React from 'react';
import Icon from '@/components/ui/icon';

const Sidebar = () => {
  return (
    <aside className="w-24 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="https://cdn.poehali.dev/files/44325e85-bd93-4098-8852-7df755a62c16.png" 
          alt="WB Logo" 
          className="w-12 h-12 rounded-lg"
        />
      </div>
      
      {/* Version info */}
      <div className="text-center mb-8">
        <div className="text-xs text-gray-500">ID 50006760</div>
        <div className="text-xs text-gray-500">V1.0.67</div>
      </div>
      
      {/* User icon */}
      <div className="mt-auto">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} className="text-purple-600" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;