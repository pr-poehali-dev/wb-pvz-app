import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ReturnItem {
  id: string;
  orderNumber: string;
  productName: string;
  customerName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  timestamp: string;
  refundAmount: number;
}

const ReturnsTab = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [returns, setReturns] = useState<ReturnItem[]>([
    {
      id: '1',
      orderNumber: 'WB789123456',
      productName: 'Смартфон iPhone 15 Pro',
      customerName: 'Иван Петров',
      reason: 'Не подошел размер',
      status: 'pending',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('ru-RU'),
      refundAmount: 89990
    },
    {
      id: '2',
      orderNumber: 'WB789123457',
      productName: 'Наушники Sony WH-1000XM5',
      customerName: 'Мария Сидорова',
      reason: 'Брак товара',
      status: 'approved',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('ru-RU'),
      refundAmount: 24990
    },
    {
      id: '3',
      orderNumber: 'WB789123458',
      productName: 'Кроссовки Nike Air Max',
      customerName: 'Алексей Козлов',
      reason: 'Не понравился цвет',
      status: 'processed',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString('ru-RU'),
      refundAmount: 12990
    }
  ]);
  const [selectedReturn, setSelectedReturn] = useState<ReturnItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleOrderSearch = () => {
    if (!orderNumber.trim()) return;

    // Имитация поиска заказа
    const mockReturnItem: ReturnItem = {
      id: Date.now().toString(),
      orderNumber: orderNumber,
      productName: `Товар по заказу ${orderNumber}`,
      customerName: 'Новый клиент',
      reason: 'Не указана',
      status: 'pending',
      timestamp: new Date().toLocaleString('ru-RU'),
      refundAmount: Math.floor(Math.random() * 50000) + 5000
    };

    setReturns(prev => [mockReturnItem, ...prev]);
    setOrderNumber('');
    console.log(`🔍 Найден заказ для возврата: ${orderNumber}`);
  };

  const updateReturnStatus = (returnId: string, status: ReturnItem['status'], reason?: string) => {
    setReturns(prev =>
      prev.map(item =>
        item.id === returnId
          ? { ...item, status, reason: reason || item.reason }
          : item
      )
    );
    
    if (selectedReturn?.id === returnId) {
      setSelectedReturn(null);
      setRejectReason('');
    }
  };

  const getStatusColor = (status: ReturnItem['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: ReturnItem['status']) => {
    switch (status) {
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'processed': return 'Package';
      default: return 'Clock';
    }
  };

  const getStatusText = (status: ReturnItem['status']) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'processed': return 'Обработано';
      default: return 'На рассмотрении';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalReturns = returns.length;
  const pendingReturns = returns.filter(r => r.status === 'pending').length;
  const approvedReturns = returns.filter(r => r.status === 'approved').length;
  const processedReturns = returns.filter(r => r.status === 'processed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center">
        <Icon name="RotateCcw" size={48} className="text-orange-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Обработка возвратов</h2>
        <p className="text-gray-600">Управление возвратами и возмещениями клиентов</p>
      </div>

      {/* Поиск заказа */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Search" size={20} />
            Найти заказ для возврата
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Введите номер заказа (например: WB789123456)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleOrderSearch()}
              className="flex-1"
            />
            <Button onClick={handleOrderSearch} disabled={!orderNumber.trim()}>
              <Icon name="Search" size={16} className="mr-2" />
              Найти заказ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-800">{totalReturns}</div>
            <div className="text-sm text-gray-600">Всего возвратов</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingReturns}</div>
            <div className="text-sm text-gray-600">На рассмотрении</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedReturns}</div>
            <div className="text-sm text-gray-600">Одобрено</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{processedReturns}</div>
            <div className="text-sm text-gray-600">Обработано</div>
          </CardContent>
        </Card>
      </div>

      {/* Список возвратов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Список возвратов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Список возвратов</span>
              <Badge variant="secondary">{totalReturns}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {returns.map((returnItem) => (
                <div 
                  key={returnItem.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReturn?.id === returnItem.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReturn(returnItem)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{returnItem.orderNumber}</div>
                      <div className="text-sm text-gray-600">{returnItem.productName}</div>
                      <div className="text-sm text-gray-500">{returnItem.customerName}</div>
                    </div>
                    <Badge className={getStatusColor(returnItem.status)}>
                      <Icon name={getStatusIcon(returnItem.status) as any} size={12} className="mr-1" />
                      {getStatusText(returnItem.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>{returnItem.timestamp}</span>
                    <span className="font-medium">{formatCurrency(returnItem.refundAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Детали возврата */}
        <Card>
          <CardHeader>
            <CardTitle>Обработка возврата</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReturn ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Номер заказа</label>
                    <div className="text-lg font-semibold">{selectedReturn.orderNumber}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Товар</label>
                    <div>{selectedReturn.productName}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Клиент</label>
                    <div>{selectedReturn.customerName}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Причина возврата</label>
                    <div>{selectedReturn.reason}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Сумма возврата</label>
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedReturn.refundAmount)}
                    </div>
                  </div>
                </div>

                {selectedReturn.status === 'pending' && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateReturnStatus(selectedReturn.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Icon name="CheckCircle" size={16} className="mr-2" />
                        Одобрить возврат
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Причина отклонения (при отклонении)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        onClick={() => updateReturnStatus(selectedReturn.id, 'rejected', rejectReason)}
                        variant="destructive"
                        className="w-full"
                      >
                        <Icon name="XCircle" size={16} className="mr-2" />
                        Отклонить возврат
                      </Button>
                    </div>
                  </div>
                )}

                {selectedReturn.status === 'approved' && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => updateReturnStatus(selectedReturn.id, 'processed')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Icon name="Package" size={16} className="mr-2" />
                      Отметить как обработанный
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Icon name="MousePointer" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Выберите возврат из списка для обработки</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnsTab;