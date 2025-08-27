import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import WBOrderProcessor from '@/components/WBOrderProcessor';
import { audioSystem } from '@/utils/audioSystem';

// Типы данных
interface OrderItem {
  id: string;
  name: string;
  price: number;
  barcode: string;
  weight?: number;
}

interface Order {
  id: string;
  customerPhone: string;
  customerName: string;
  cellNumber: string;
  items: OrderItem[];
  status: 'pending' | 'ready' | 'processing' | 'completed';
  total: number;
  hasDiscount: boolean;
  hasWallet: boolean;
  paymentType: 'card' | 'cash' | 'online';
  deliveryDate: string;
}

// База тестовых заказов с реальными данными
const TEST_ORDERS: Order[] = [
  {
    id: 'WB001234567',
    customerPhone: '1234',
    customerName: 'Иванова Мария Сергеевна',
    cellNumber: 'A15',
    items: [
      { id: '1', name: 'Футболка женская базовая белая', price: 899, barcode: '1234567890123' },
      { id: '2', name: 'Джинсы женские классические синие', price: 2499, barcode: '2345678901234' }
    ],
    status: 'ready',
    total: 3398,
    hasDiscount: true,
    hasWallet: true,
    paymentType: 'card',
    deliveryDate: '2024-01-15'
  },
  {
    id: 'WB001234568', 
    customerPhone: '5678',
    customerName: 'Петров Сергей Иванович',
    cellNumber: 'B23',
    items: [
      { id: '3', name: 'Кроссовки мужские спортивные Nike', price: 4999, barcode: '3456789012345' }
    ],
    status: 'ready',
    total: 4999,
    hasDiscount: false,
    hasWallet: false,
    paymentType: 'cash',
    deliveryDate: '2024-01-15'
  },
  {
    id: 'WB001234569',
    customerPhone: '9012',
    customerName: 'Сидорова Анна Петровна',
    cellNumber: 'C7',
    items: [
      { id: '4', name: 'Платье летнее цветочное', price: 1599, barcode: '4567890123456' },
      { id: '5', name: 'Сандалии женские кожаные', price: 2299, barcode: '5678901234567' },
      { id: '6', name: 'Сумка через плечо чёрная', price: 799, barcode: '6789012345678' }
    ],
    status: 'ready',
    total: 4697,
    hasDiscount: true,
    hasWallet: false,
    paymentType: 'online',
    deliveryDate: '2024-01-15'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  // Инициализация аудиосистемы
  useEffect(() => {
    audioSystem.preloadAudio();
    if (isAudioEnabled) {
      audioSystem.enable();
    } else {
      audioSystem.disable();
    }
  }, [isAudioEnabled]);



  // Генерация случайного заказа для QR-сканирования
  const generateRandomOrder = (): Order => {
    const randomItems = [
      { id: '1', name: 'Футболка базовая унисекс', price: 599, barcode: '1111111111111' },
      { id: '2', name: 'Джинсы классические', price: 1999, barcode: '2222222222222' },
      { id: '3', name: 'Кроссовки белые', price: 3499, barcode: '3333333333333' },
      { id: '4', name: 'Свитшот оверсайз', price: 1299, barcode: '4444444444444' },
      { id: '5', name: 'Куртка демисезонная', price: 4999, barcode: '5555555555555' }
    ];

    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = randomItems.slice(0, numItems);
    const total = orderItems.reduce((sum, item) => sum + item.price, 0);
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 99) + 1;
    
    const names = ['Иванов Иван', 'Петрова Мария', 'Сидоров Андрей', 'Козлова Елена', 'Смирнов Дмитрий'];
    
    return {
      id: 'WB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerPhone: Math.floor(Math.random() * 9000 + 1000).toString(),
      customerName: names[Math.floor(Math.random() * names.length)],
      cellNumber: `${letter}${number}`,
      items: orderItems,
      status: 'ready',
      total,
      hasDiscount: Math.random() > 0.4,
      hasWallet: Math.random() > 0.6,
      paymentType: ['card', 'cash', 'online'][Math.floor(Math.random() * 3)] as any,
      deliveryDate: new Date().toISOString().split('T')[0]
    };
  };

  // QR-сканирование
  const handleQRScan = async () => {
    setIsScanning(true);
    
    // Имитация сканирования 2.5 секунды
    setTimeout(() => {
      const order = generateRandomOrder();
      setCurrentOrder(order);
      setIsScanning(false);
    }, 2500);
  };

  // Поиск по телефону
  const handlePhoneSearch = () => {
    if (phoneNumber.length >= 4) {
      // Ищем в тестовых заказах
      const foundOrder = TEST_ORDERS.find(order => 
        order.customerPhone === phoneNumber
      );

      if (foundOrder) {
        setCurrentOrder(foundOrder);
        // Добавляем в историю поиска
        setSearchHistory(prev => [...prev.filter(p => p !== phoneNumber), phoneNumber].slice(-5));
      } else {
        // Если не найден, создаем новый
        const newOrder = generateRandomOrder();
        newOrder.customerPhone = phoneNumber;
        setCurrentOrder(newOrder);
        setSearchHistory(prev => [...prev.filter(p => p !== phoneNumber), phoneNumber].slice(-5));
      }
    }
  };

  // Завершение заказа
  const handleOrderComplete = () => {
    setCurrentOrder(null);
    setPhoneNumber('');
  };

  // Отмена заказа
  const handleOrderCancel = () => {
    setCurrentOrder(null);
    setPhoneNumber('');
  };

  // Переключение вкладок
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentOrder(null);
    setPhoneNumber('');
  };

  // Быстрый поиск из истории
  const handleHistorySearch = (phone: string) => {
    setPhoneNumber(phone);
    const order = TEST_ORDERS.find(o => o.customerPhone === phone) || generateRandomOrder();
    if (order.customerPhone !== phone) {
      order.customerPhone = phone;
    }
    setCurrentOrder(order);
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
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`w-3 h-3 rounded-full transition-colors ${
              isAudioEnabled ? 'bg-green-400' : 'bg-red-400'
            }`}
            title={isAudioEnabled ? 'Звук включен' : 'Звук выключен'}
          />
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-2.5rem)]">
        {/* Левый сайдбар */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === 'выдача' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Icon name="Package" size={20} className={
                  activeTab === 'выдача' ? 'text-purple-600' : 'text-gray-600'
                } />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="Search" size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">v2.1.0</div>
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
              <div className="text-sm text-gray-600">
                Смена: {new Date().toLocaleDateString()}
              </div>
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
                onClick={() => handleTabChange('выдача')}
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
                onClick={() => handleTabChange('приёмка')}
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
                onClick={() => handleTabChange('возврат')}
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
              <>
                {!currentOrder ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-lg">
                      <h2 className="text-gray-600 mb-8 text-lg">
                        Отсканируйте QR-код клиента или курьера
                      </h2>
                      
                      <div className="mb-12">
                        <img 
                          src="https://cdn.poehali.dev/files/a81ddfe6-6c36-44db-b010-e8e4076dcc14.png" 
                          alt="QR Scanner" 
                          className={`w-64 h-auto mx-auto transition-transform duration-300 ${
                            isScanning ? 'scale-105 animate-pulse' : 'hover:scale-102'
                          }`}
                        />
                      </div>

                      <Button 
                        onClick={handleQRScan}
                        disabled={isScanning}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 mb-12"
                      >
                        {isScanning ? (
                          <>
                            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                            Сканирование...
                          </>
                        ) : (
                          <>
                            <Icon name="QrCode" size={16} className="mr-2" />
                            Сканировать QR-код
                          </>
                        )}
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
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-4"
                        >
                          <Icon name="Search" size={16} className="mr-2" />
                          Найти заказ
                        </Button>

                        {/* История поиска */}
                        {searchHistory.length > 0 && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-2">Последние поиски:</div>
                            <div className="flex flex-wrap gap-2">
                              {searchHistory.map((phone, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleHistorySearch(phone)}
                                  className="px-2 py-1 bg-white border border-gray-200 rounded text-xs hover:bg-purple-50 hover:border-purple-200"
                                >
                                  {phone}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Тестовые номера */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-blue-600 mb-2">💡 Тестовые номера:</div>
                          <div className="flex flex-wrap gap-1">
                            {TEST_ORDERS.map((order) => (
                              <button
                                key={order.id}
                                onClick={() => handleHistorySearch(order.customerPhone)}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                              >
                                {order.customerPhone}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <WBOrderProcessor 
                    order={currentOrder}
                    onComplete={handleOrderComplete}
                    onCancel={handleOrderCancel}
                  />
                )}
              </>
            )}

            {activeTab === 'приёмка' && (
              <div className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Icon name="Truck" size={64} className="text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Приёмка товаров</h2>
                  <p className="text-gray-600 mb-6">
                    Отсканируйте товар для добавления в систему
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <Icon name="AlertCircle" size={20} />
                      <span className="font-medium">13 товаров ожидают обработки</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'возврат' && (
              <div className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Icon name="RotateCcw" size={64} className="text-orange-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Обработка возвратов</h2>
                  <p className="text-gray-600 mb-6">
                    Сканируйте QR-код для оформления возврата
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Icon name="QrCode" size={16} className="mr-2" />
                    Сканировать возврат
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;