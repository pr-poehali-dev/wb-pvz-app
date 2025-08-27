import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const audioRef = useRef(null);

  const playAudio = async (audioType: string, cellNumber?: string) => {
    try {
      // Симуляция воспроизведения аудио из облака
      const audioUrls = {
        cell: `https://files.sberdisk.ru/s/ls1nJsPTHTmjvzI/Ячейки/${cellNumber || '1'}.mp3`,
        discount: 'https://files.sberdisk.ru/s/ls1nJsPTHTmjvzI/Товары со скидкой проверьте ВБ кошелек.mp3',
        camera: 'https://files.sberdisk.ru/s/ls1nJsPTHTmjvzI/Проверьте товар под камерой.mp3',
        rate: 'https://files.sberdisk.ru/s/ls1nJsPTHTmjvzI/Оцените наш пункт выдачи в приложении.mp3'
      };
      
      // Симуляция озвучки
      console.log(`Воспроизводится: ${audioType}`, cellNumber);
    } catch (error) {
      console.error('Ошибка воспроизведения аудио:', error);
    }
  };

  const handleQRScan = () => {
    setIsScanning(true);
    // Симуляция сканирования QR-кода клиента
    setTimeout(() => {
      const mockOrder = {
        id: 'WB12345678',
        cell: 'А-15',
        items: ['Кроссовки Nike', 'Футболка'],
        total: 2890,
        status: 'ready'
      };
      setCurrentOrder(mockOrder);
      setIsScanning(false);
      // Озвучка номера ячейки
      playAudio('cell', '15');
      // Через 2 сек озвучка про скидку
      setTimeout(() => playAudio('discount'), 2000);
    }, 2000);
  };

  const handleProductScan = () => {
    // Симуляция сканирования товара со склада
    playAudio('camera');
  };

  const handlePayment = () => {
    // Симуляция успешной оплаты
    setTimeout(() => {
      playAudio('rate');
      setCurrentOrder(null);
    }, 1000);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length === 4) {
      const mockOrder = {
        id: 'WB87654321',
        cell: 'Б-23',
        items: ['Платье'],
        total: 1590,
        status: 'ready'
      };
      setCurrentOrder(mockOrder);
      playAudio('cell', '23');
      setTimeout(() => playAudio('discount'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
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
            <Icon name="Menu" size={20} />
            <Icon name="ShoppingCart" size={20} />
            <Icon name="Search" size={20} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="flex max-w-md mx-auto">
          {['выдача', 'приёмка', 'возврат'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-2 text-center relative ${
                activeTab === tab 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground'
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
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end p-2 max-w-md mx-auto">
          <Badge variant="secondary" className="bg-muted">
            <Icon name="RotateCcw" size={12} className="mr-1" />
            13
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-md mx-auto">
        {activeTab === 'выдача' && (
          <div className="space-y-6">
            {/* QR Scanner Section */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-lg font-semibold mb-6 text-foreground">
                  Отсканируйте QR-код клиента или курьера
                </h2>
                
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                    {isScanning ? (
                      <div className="animate-pulse">
                        <Icon name="Scan" size={40} className="text-primary" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="QrCode" size={24} className="text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleQRScan}
                  disabled={isScanning}
                  className="w-full mb-6 bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  {isScanning ? 'Сканирование...' : 'Начать сканирование'}
                </Button>

                <div className="text-muted-foreground text-sm mb-4">или</div>

                {/* Phone Input */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Введите номер телефона клиента
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Последние 4 цифры номера"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={4}
                      className="text-center text-lg font-mono"
                    />
                    <Button 
                      onClick={handlePhoneSubmit}
                      disabled={phoneNumber.length !== 4}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Order */}
            {currentOrder && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Заказ найден</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {currentOrder.status === 'ready' ? 'Готов к выдаче' : 'В обработке'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Номер:</span>
                      <span className="font-medium">{currentOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ячейка:</span>
                      <span className="font-bold text-primary text-xl">{currentOrder.cell}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Товары:</span>
                      <span className="font-medium">{currentOrder.items.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сумма:</span>
                      <span className="font-bold">{currentOrder.total} ₽</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button 
                      onClick={handleProductScan}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Icon name="Package" size={16} className="mr-2" />
                      Сканировать товар
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Icon name="CreditCard" size={16} className="mr-2" />
                      Оплачено
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'приёмка' && (
          <div className="text-center py-12">
            <Icon name="PackageCheck" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Приёмка товаров</h3>
            <p className="text-muted-foreground">
              Функция в разработке
            </p>
          </div>
        )}

        {activeTab === 'возврат' && (
          <div className="text-center py-12">
            <Icon name="RotateCcw" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Возврат товаров</h3>
            <p className="text-muted-foreground">
              Функция в разработке
            </p>
          </div>
        )}
      </div>

      {/* Audio element for sound playback */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
};

export default Index;