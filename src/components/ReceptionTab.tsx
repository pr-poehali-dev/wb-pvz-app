import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Product {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  status: 'pending' | 'received' | 'damaged';
  timestamp: string;
}

const ReceptionTab = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [manualCode, setManualCode] = useState('');

  const mockProducts = [
    { id: '1', name: 'Смартфон iPhone 15', barcode: '1234567890123', category: 'Электроника' },
    { id: '2', name: 'Наушники AirPods', barcode: '2345678901234', category: 'Аксессуары' },
    { id: '3', name: 'Кабель USB-C', barcode: '3456789012345', category: 'Аксессуары' },
    { id: '4', name: 'Чехол для телефона', barcode: '4567890123456', category: 'Аксессуары' },
  ];

  const handleScan = (code: string) => {
    const mockProduct = mockProducts.find(p => p.barcode === code) || 
      mockProducts[Math.floor(Math.random() * mockProducts.length)];

    const newProduct: Product = {
      id: Date.now().toString(),
      name: mockProduct.name,
      barcode: code,
      quantity: 1,
      status: 'pending',
      timestamp: new Date().toLocaleString('ru-RU')
    };

    setProducts(prev => [newProduct, ...prev]);
    setScannedCode(code);
    setManualCode('');
    console.log(`📦 Товар отсканирован: ${mockProduct.name}`);
  };

  const handleManualInput = () => {
    if (manualCode.trim()) {
      handleScan(manualCode.trim());
    }
  };

  const updateProductStatus = (productId: string, status: Product['status']) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, status } : p)
    );
  };

  const startScanning = () => {
    setIsScanning(true);
    // Имитация сканирования через 2 секунды
    setTimeout(() => {
      const randomCode = Math.random().toString().slice(2, 15);
      handleScan(randomCode);
      setIsScanning(false);
    }, 2000);
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'received': return 'CheckCircle';
      case 'damaged': return 'XCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="text-center">
        <Icon name="PackageCheck" size={48} className="text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Приёмка товаров</h2>
        <p className="text-gray-600">Сканируйте штрих-коды поступающих товаров</p>
      </div>

      {/* Сканирование */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="QrCode" size={20} />
            Сканирование товаров
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={startScanning}
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Сканирование...
                </>
              ) : (
                <>
                  <Icon name="QrCode" size={16} className="mr-2" />
                  Начать сканирование
                </>
              )}
            </Button>
            
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Или введите штрих-код вручную"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              />
              <Button onClick={handleManualInput} disabled={!manualCode.trim()}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          {isScanning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Icon name="Camera" size={32} className="text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800">Наведите камеру на штрих-код товара</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'received').length}</div>
            <div className="text-sm text-gray-600">Принято</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{products.filter(p => p.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Ожидает</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'damaged').length}</div>
            <div className="text-sm text-gray-600">Повреждено</div>
          </CardContent>
        </Card>
      </div>

      {/* Список отсканированных товаров */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Отсканированные товары</span>
              <Badge variant="secondary">{products.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Icon name="Package" size={20} className="text-gray-500" />
                  
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Штрих-код: {product.barcode} • {product.timestamp}
                    </div>
                  </div>

                  <Badge className={getStatusColor(product.status)}>
                    <Icon name={getStatusIcon(product.status) as any} size={12} className="mr-1" />
                    {product.status === 'pending' ? 'Ожидает' : 
                     product.status === 'received' ? 'Принято' : 'Повреждено'}
                  </Badge>

                  {product.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateProductStatus(product.id, 'received')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Icon name="Check" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateProductStatus(product.id, 'damaged')}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Отсканируйте первый товар для начала приёмки</p>
        </div>
      )}
    </div>
  );
};

export default ReceptionTab;