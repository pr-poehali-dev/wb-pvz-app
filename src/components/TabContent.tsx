import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TabContentProps {
  activeTab: string;
  onStartScanning?: () => void;
}

const TabContent = ({ activeTab, onStartScanning }: TabContentProps) => {
  if (activeTab === 'приёмка') {
    return (
      <div className="text-center py-12">
        <Icon name="PackageCheck" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Приёмка товаров</h3>
        <p className="text-muted-foreground mb-4">
          Сканируйте QR-коды поступающих товаров
        </p>
        <Button className="bg-primary text-white" onClick={onStartScanning}>
          <Icon name="QrCode" size={16} className="mr-2" />
          Начать сканирование
        </Button>
      </div>
    );
  }

  if (activeTab === 'возврат') {
    return (
      <div className="text-center py-12">
        <Icon name="RotateCcw" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Возврат товаров</h3>
        <p className="text-muted-foreground mb-4">
          Обработка возвратов клиентов
        </p>
        <Button className="bg-primary text-white" onClick={onStartScanning}>
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Обработать возврат
        </Button>
      </div>
    );
  }

  return null;
};

export default TabContent;