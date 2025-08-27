import React from 'react';
import ReceptionTab from './ReceptionTab';
import ReturnsTab from './ReturnsTab';

interface TabContentProps {
  activeTab: string;
  onStartScanning?: () => void;
}

const TabContent = ({ activeTab, onStartScanning }: TabContentProps) => {
  if (activeTab === 'приёмка') {
    return <ReceptionTab />;
  }

  if (activeTab === 'возврат') {
    return <ReturnsTab />;
  }

  return null;
};

export default TabContent;