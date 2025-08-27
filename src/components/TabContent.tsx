import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TabContentProps {
  activeTab: string;
}

const TabContent = ({ activeTab }: TabContentProps) => {
  if (activeTab === 'приёмка') {
    return (
      <div className="text-center py-12">
        <Icon name="PackageCheck" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Приёмка товаров</h3>
        <p className="text-muted-foreground mb-4">
          Сканируйте QR-коды поступающих товаров
        </p>
        <Button className="bg-primary text-white" disabled>
          В разработке
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
        <Button className="bg-primary text-white" disabled>
          В разработке
        </Button>
      </div>
    );
  }

  return null;
};

export default TabContent;