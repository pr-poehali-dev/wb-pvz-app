import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

// Типы данных
interface Order {
  id: string;
  customerPhone: string;
  cellNumber: string;
  items: OrderItem[];
  status: 'pending' | 'ready' | 'checking' | 'completed';
  total: number;
  hasDiscount: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  barcode: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<'scanning' | 'found' | 'bringing' | 'checking' | 'payment' | 'completed'>('scanning');
  const [showPayment, setShowPayment] = useState(false);

  // Система озвучки с облачными файлами
  const playAudio = async (fileName: string) => {
    try {
      const baseUrl = 'https://cloud.mail.ru/public/WMiM/n1UTJ5fwe';
      let audioUrl = '';
      
      switch (fileName) {
        case 'cell':
          // Случайная ячейка от A1 до Z50
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          const letter = letters[Math.floor(Math.random() * letters.length)];
          const number = Math.floor(Math.random() * 50) + 1;
          audioUrl = `${baseUrl}/Ячейки/${letter}${number}.mp3`;
          break;
        case 'discount':
          audioUrl = `${baseUrl}/Товары со скидкой проверьте ВБ кошелек.mp3`;
          break;
        case 'check_camera':
          audioUrl = `${baseUrl}/Проверьте товар под камерой.mp3`;
          break;
        case 'rate_us':
          audioUrl = `${baseUrl}/Оцените наш пункт выдачи в приложении.mp3`;
          break;
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  // Генерация тестового заказа
  const generateOrder = (): Order => {
    const items = [
      { id: '1', name: 'Футболка женская базовая', price: 899, image: '/api/placeholder/100/100', barcode: '1234567890123' },
      { id: '2', name: 'Джинсы мужские классика', price: 2499, image: '/api/placeholder/100/100', barcode: '2345678901234' }
    ];
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 50) + 1;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      customerPhone: phoneNumber || '1234',
      cellNumber: `${letter}${number}`,
      items,
      status: 'ready',
      total: items.reduce((sum, item) => sum + item.price, 0),
      hasDiscount: Math.random() > 0.5
    };
  };

  // Обработка QR-сканирования
  const handleQRScan = async () => {
    setIsScanning(true);
    
    setTimeout(async () => {
      const order = generateOrder();
      setCurrentOrder(order);
      setOrderStatus('found');
      setIsScanning(false);
      
      // Озвучка номера ячейки
      await playAudio('cell');
      
      // Задержка перед следующей озвучкой
      setTimeout(async () => {
        if (order.hasDiscount) {
          await playAudio('discount');
        }
        setOrderStatus('bringing');
      }, 2000);
    }, 2000);
  };

  // Поиск по телефону
  const handlePhoneSearch = async () => {
    if (phoneNumber.length >= 4) {
      const order = generateOrder();
      setCurrentOrder(order);
      setOrderStatus('found');
      
      await playAudio('cell');
      setTimeout(async () => {
        if (order.hasDiscount) {
          await playAudio('discount');
        }
        setOrderStatus('bringing');
      }, 2000);
    }
  };

  // Сканирование товара
  const handleProductScan = async () => {
    if (currentOrder) {
      setOrderStatus('checking');
      await playAudio('check_camera');
      
      setTimeout(() => {
        setOrderStatus('payment');
        setShowPayment(true);
      }, 3000);
    }
  };

  // Обработка оплаты
  const handlePayment = async () => {
    setOrderStatus('completed');
    await playAudio('rate_us');
    
    setTimeout(() => {
      setCurrentOrder(null);
      setOrderStatus('scanning');
      setPhoneNumber('');
      setShowPayment(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Темная шапка как в оригинале */}
      <div className="bg-gray-800 text-white h-10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://cdn.poehali.dev/files/fe968fc1-b45c-4a13-9d0b-ba5587850999.png" 
            alt="WB ПВЗ" 
            className="w-6 h-6"
          />
          <span className="text-sm font-medium">WB ПВЗ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-2.5rem)]">
        {/* Левый сайдбар */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Package" size={20} className="text-purple-600" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="Search" size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">v1.0.0</div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col">
          {/* Верхняя панель */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Icon name="Menu" size={20} className="text-gray-600" />
              <Icon name="Search" size={20} className="text-gray-600" />
              <Icon name="Settings" size={20} className="text-gray-600" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Icon name="Download" size={16} className="mr-2" />
              Установить версию
            </Button>
          </div>

          {/* Вкладки */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('выдача')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'выдача'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Package" size={16} />
                  Выдача
                </div>
              </button>
              <button
                onClick={() => setActiveTab('приёмка')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'приёмка'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Truck" size={16} />
                  Приёмка
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">13</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('возврат')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'возврат'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="RotateCcw" size={16} />
                  Возврат
                </div>
              </button>
            </div>
          </div>

          {/* Контентная область */}
          <div className="flex-1 p-6">
            {activeTab === 'выдача' && (
              <div className="flex items-center justify-center h-full">
                {orderStatus === 'scanning' && (
                  <div className="text-center max-w-lg">
                    <h2 className="text-gray-600 mb-8 text-lg">
                      Отсканируйте QR-код клиента или курьера
                    </h2>
                    
                    <div className="mb-12">
                      <img 
                        src="https://cdn.poehali.dev/files/a81ddfe6-6c36-44db-b010-e8e4076dcc14.png" 
                        alt="QR Scanner" 
                        className={`w-64 h-auto mx-auto transition-transform duration-300 ${
                          isScanning ? 'scale-105' : 'hover:scale-102'
                        }`}
                      />
                    </div>

                    <Button 
                      onClick={handleQRScan}
                      disabled={isScanning}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 mb-12"
                    >
                      {isScanning ? 'Сканирование...' : 'Сканировать QR-код'}
                    </Button>

                    <div className="text-gray-500 mb-6">или</div>
                    
                    <div className="max-w-sm mx-auto">
                      <div className="mb-4">
                        <div className="text-gray-700 font-medium mb-2">
                          Введите номер телефона клиента
                        </div>
                        <Input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Последние 4 цифры номера"
                          className="text-center"
                          maxLength={4}
                        />
                      </div>
                      <Button 
                        onClick={handlePhoneSearch}
                        disabled={phoneNumber.length < 4}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Найти заказ
                      </Button>
                    </div>
                  </div>
                )}

                {orderStatus === 'found' && currentOrder && (
                  <div className="text-center">
                    <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
                      <Icon name="CheckCircle" size={48} className="text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-2">Заказ найден!</h3>
                      <p className="text-green-700">Ячейка: <span className="font-bold text-2xl">{currentOrder.cellNumber}</span></p>
                      {currentOrder.hasDiscount && (
                        <Badge className="mt-3 bg-purple-100 text-purple-800">
                          🎁 Товары со скидкой - проверьте ВБ кошелек
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">Принесите товар из ячейки {currentOrder.cellNumber}</p>
                  </div>
                )}

                {orderStatus === 'bringing' && currentOrder && (
                  <div className="text-center">
                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mb-6">
                      <Icon name="Package" size={48} className="text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-blue-800 mb-4">Товар принесён?</h3>
                      <div className="space-y-3 mb-6">
                        {currentOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-semibold">{item.price} ₽</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={handleProductScan}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        Сканировать товар
                      </Button>
                    </div>
                  </div>
                )}

                {orderStatus === 'checking' && (
                  <div className="text-center">
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6">
                      <Icon name="Camera" size={48} className="text-yellow-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-yellow-800 mb-2">Проверьте товар под камерой</h3>
                      <div className="animate-pulse">
                        <div className="w-32 h-32 bg-yellow-200 rounded-lg mx-auto mb-4"></div>
                        <p className="text-yellow-700">Сканирование товара...</p>
                      </div>
                    </div>
                  </div>
                )}

                {orderStatus === 'payment' && currentOrder && (
                  <div className="text-center">
                    <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
                      <Icon name="CreditCard" size={48} className="text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-4">Оплата</h3>
                      <div className="text-2xl font-bold mb-4">{currentOrder.total} ₽</div>
                      <Button 
                        onClick={handlePayment}
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        Оплата прошла успешно
                      </Button>
                    </div>
                  </div>
                )}

                {orderStatus === 'completed' && (
                  <div className="text-center">
                    <div className="bg-purple-100 border border-purple-300 rounded-lg p-6">
                      <Icon name="Star" size={48} className="text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-purple-800 mb-2">Спасибо за покупку!</h3>
                      <p className="text-purple-700">Оцените наш пункт выдачи в приложении</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'приёмка' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Приёмка товаров</h2>
                <p className="text-gray-600">Функционал приёмки товаров</p>
              </div>
            )}

            {activeTab === 'возврат' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Обработка возвратов</h2>
                <p className="text-gray-600">Функционал обработки возвратов</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;