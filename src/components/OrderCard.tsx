import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Order } from '@/utils/orderUtils';

interface OrderCardProps {
  currentOrder: Order;
  orderStep: 'found' | 'scanned' | 'paid';
  onProductScan: () => void;
  onPayment: () => void;
}

const OrderCard = ({ currentOrder, orderStep, onProductScan, onPayment }: OrderCardProps) => {
  return (
    <Card className={`border-0 shadow-lg transition-all duration-500 ${
      orderStep === 'found' ? 'bg-gradient-to-r from-blue-50 to-indigo-50' :
      orderStep === 'scanned' ? 'bg-gradient-to-r from-orange-50 to-amber-50' :
      'bg-gradient-to-r from-green-50 to-emerald-50'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Icon name="Package" size={16} />
            Заказ найден
          </h3>
          <Badge className={`${
            orderStep === 'found' ? 'bg-blue-100 text-blue-800' :
            orderStep === 'scanned' ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {orderStep === 'found' ? 'Готов к выдаче' :
             orderStep === 'scanned' ? 'Товар проверен' :
             'Оплачено'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Номер:</span>
            <span className="font-medium font-mono">{currentOrder.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ячейка:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary text-2xl">{currentOrder.cell}</span>
              <Icon name="MapPin" size={16} className="text-primary" />
            </div>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Товары:</span>
            <div className="text-right">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="font-medium text-sm">{item}</div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-bold text-lg">{currentOrder.total.toLocaleString()} ₽</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {orderStep === 'found' && (
            <>
              <Button 
                onClick={onProductScan}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105"
              >
                <Icon name="Package" size={16} className="mr-2" />
                Сканировать товар
              </Button>
              <Button 
                onClick={onPayment}
                disabled
                className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Оплачено
              </Button>
            </>
          )}
          
          {orderStep === 'scanned' && (
            <Button 
              onClick={onPayment}
              className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              <Icon name="CreditCard" size={16} className="mr-2" />
              Оплачено
            </Button>
          )}

          {orderStep === 'paid' && (
            <div className="w-full text-center py-4">
              <Icon name="CheckCircle" size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">Заказ завершён!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;