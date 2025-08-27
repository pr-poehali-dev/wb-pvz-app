import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { audioSystem } from '@/utils/audioSystem';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  barcode: string;
  weight?: number;
  dimensions?: string;
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

interface WBOrderProcessorProps {
  order: Order;
  onComplete: () => void;
  onCancel: () => void;
}

const WBOrderProcessor: React.FC<WBOrderProcessorProps> = ({ order, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<'found' | 'retrieving' | 'scanning' | 'checking' | 'payment' | 'completed'>('found');
  const [scannedItems, setScannedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Инициализация аудиосистемы
  useEffect(() => {
    audioSystem.preloadAudio();
  }, []);

  // Автоматический переход после озвучки ячейки
  useEffect(() => {
    if (currentStep === 'found') {
      const processOrder = async () => {
        // Озвучиваем последовательность для ячейки
        await audioSystem.playFindCellAudio(); // "Найдите вашу ячейку номер"
        setTimeout(async () => {
          await audioSystem.playCellAudio(order.cellNumber); // "A15"
          
          setTimeout(async () => {
            await audioSystem.playCellOpenAudio(); // "Ячейка открыта, заберите товар"
            
            // Затем озвучиваем скидки если есть
            setTimeout(async () => {
              if (order.hasDiscount) {
                await audioSystem.playDiscountAudio();
              }
              
              // Переходим к этапу получения товара
              setCurrentStep('retrieving');
            }, 2000);
          }, 1500);
        }, 1000);
      };
      
      processOrder();
    }
  }, [currentStep, order]);

  // Сканирование товара сотрудником
  const handleProductRetrieved = async () => {
    setIsProcessing(true);
    setCurrentStep('scanning');

    // Имитируем сканирование товара сотрудником
    setTimeout(async () => {
      // Озвучиваем "Проверьте товар под камерой"
      await audioSystem.playCheckCameraAudio();
      setCurrentStep('checking');
      setIsProcessing(false);
    }, 1500);
  };

  // Проверка товара покупателем
  const handleItemCheck = async (itemId: string) => {
    const newScannedItems = new Set(scannedItems);
    newScannedItems.add(itemId);
    setScannedItems(newScannedItems);

    await audioSystem.playSuccessSound();

    // Если все товары проверены, переходим к оплате
    if (newScannedItems.size === order.items.length) {
      setTimeout(() => {
        setCurrentStep('payment');
        setPaymentAmount(order.total);
      }, 1000);
    }
  };

  // Обработка оплаты
  const handlePayment = async (method: 'card' | 'cash' | 'online') => {
    setIsProcessing(true);

    // Имитируем процесс оплаты
    setTimeout(async () => {
      setCurrentStep('completed');
      
      // Последовательность озвучек при завершении
      await audioSystem.playSuccessSound(); // Успешная оплата
      
      setTimeout(async () => {
        await audioSystem.playThankYouAudio(); // "Спасибо за покупку"
        
        setTimeout(async () => {
          await audioSystem.playRateUsAudio(); // "Оцените наш пункт выдачи в приложении"
          
          setTimeout(async () => {
            await audioSystem.playGoodDayAudio(); // "Хорошего дня"
            
            // Завершаем через 2 секунды
            setTimeout(() => {
              onComplete();
            }, 2000);
          }, 3000);
        }, 1500);
      }, 1000);
      
      setIsProcessing(false);
    }, 2000);
  };

  // Отмена заказа
  const handleCancel = async () => {
    await audioSystem.playErrorSound();
    onCancel();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'found':
        return (
          <div className="text-center">
            <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
              <Icon name="CheckCircle" size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Заказ найден!</h3>
              <div className="space-y-2">
                <p className="text-green-700">
                  Клиент: <span className="font-medium">{order.customerName}</span>
                </p>
                <p className="text-green-700">
                  Телефон: <span className="font-medium">***{order.customerPhone}</span>
                </p>
                <p className="text-green-700">
                  Ячейка: <span className="font-bold text-3xl text-blue-600">{order.cellNumber}</span>
                </p>
                <div className="flex justify-center gap-2 mt-3">
                  {order.hasDiscount && (
                    <Badge className="bg-purple-100 text-purple-800">
                      💰 Скидки
                    </Badge>
                  )}
                  {order.hasWallet && (
                    <Badge className="bg-blue-100 text-blue-800">
                      👛 WB Кошелек
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="animate-pulse">
              <p className="text-gray-600">🔊 Озвучиваю номер ячейки...</p>
            </div>
          </div>
        );

      case 'retrieving':
        return (
          <div className="text-center">
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mb-6">
              <Icon name="Package" size={48} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-800 mb-4">Принесите товар из ячейки {order.cellNumber}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="text-sm font-medium text-blue-700 mb-3">Товары в заказе:</div>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="text-left">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">Штрихкод: {item.barcode}</div>
                    </div>
                    <div className="font-bold text-blue-600">{item.price.toLocaleString()} ₽</div>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Итого:</span>
                    <span className="text-blue-600">{order.total.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleProductRetrieved}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                {isProcessing ? 'Сканирую товар...' : 'Товар принесён, сканировать'}
              </Button>
            </div>
          </div>
        );

      case 'scanning':
        return (
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6">
              <Icon name="Scan" size={48} className="text-yellow-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-yellow-800 mb-2">Сканирую товар...</h3>
              <div className="animate-pulse">
                <div className="w-32 h-32 bg-yellow-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Loader2" size={32} className="animate-spin text-yellow-600" />
                </div>
                <p className="text-yellow-700">Проверяю соответствие заказу</p>
              </div>
            </div>
          </div>
        );

      case 'checking':
        return (
          <div className="text-center">
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-6 mb-6">
              <Icon name="Camera" size={48} className="text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-800 mb-4">Проверьте товар под камерой</h3>
              
              <div className="space-y-3 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded border">
                    <div className="text-left flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.price.toLocaleString()} ₽</div>
                    </div>
                    <Button
                      onClick={() => handleItemCheck(item.id)}
                      disabled={scannedItems.has(item.id)}
                      className={`ml-4 ${
                        scannedItems.has(item.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {scannedItems.has(item.id) ? (
                        <>
                          <Icon name="CheckCircle" size={16} className="mr-1" />
                          Проверено
                        </>
                      ) : (
                        'Проверить'
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-sm text-orange-700">
                Проверено: {scannedItems.size} из {order.items.length} товаров
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="text-center">
            <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
              <Icon name="CreditCard" size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-4">Оплата заказа</h3>
              
              <div className="text-3xl font-bold text-green-600 mb-6">
                {paymentAmount.toLocaleString()} ₽
              </div>

              <div className="grid grid-cols-1 gap-3 mb-6">
                <Button 
                  onClick={() => handlePayment('card')}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Icon name="CreditCard" size={16} className="mr-2" />
                  Оплата картой
                </Button>
                <Button 
                  onClick={() => handlePayment('cash')}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Icon name="Banknote" size={16} className="mr-2" />
                  Оплата наличными
                </Button>
                <Button 
                  onClick={() => handlePayment('online')}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Icon name="Smartphone" size={16} className="mr-2" />
                  Онлайн оплата
                </Button>
              </div>

              {isProcessing && (
                <div className="text-green-600 animate-pulse">
                  <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-2" />
                  Обрабатываю платеж...
                </div>
              )}
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center">
            <div className="bg-purple-100 border border-purple-300 rounded-lg p-6">
              <Icon name="Star" size={48} className="text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                Заказ выдан успешно!
              </h3>
              <p className="text-purple-700 mb-4">
                Спасибо за покупку в Wildberries!
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-purple-600">
                  🔊 Просим оценить наш пункт выдачи...
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded border">
                <div className="text-sm font-medium mb-2">Детали заказа:</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>№ заказа: {order.id}</div>
                  <div>Ячейка: {order.cellNumber}</div>
                  <div>Сумма: {order.total.toLocaleString()} ₽</div>
                  <div>Время: {new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Прогресс-бар */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className={currentStep === 'found' ? 'text-green-600 font-medium' : ''}>Найден</span>
          <span className={currentStep === 'retrieving' ? 'text-blue-600 font-medium' : ''}>Получение</span>
          <span className={currentStep === 'checking' ? 'text-orange-600 font-medium' : ''}>Проверка</span>
          <span className={currentStep === 'payment' ? 'text-green-600 font-medium' : ''}>Оплата</span>
          <span className={currentStep === 'completed' ? 'text-purple-600 font-medium' : ''}>Завершен</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                currentStep === 'found' ? '20%' :
                currentStep === 'retrieving' ? '40%' :
                currentStep === 'scanning' ? '50%' :
                currentStep === 'checking' ? '60%' :
                currentStep === 'payment' ? '80%' :
                currentStep === 'completed' ? '100%' : '0%'
              }`
            }}
          />
        </div>
      </div>

      {/* Основной контент */}
      {renderStep()}

      {/* Кнопка отмены */}
      {currentStep !== 'completed' && (
        <div className="mt-6 text-center">
          <Button 
            onClick={handleCancel}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Icon name="X" size={16} className="mr-2" />
            Отменить заказ
          </Button>
        </div>
      )}
    </div>
  );
};

export default WBOrderProcessor;