import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import AudioUploader from '@/components/AudioUploader';

interface Order {
  id: string;
  cell: string;
  items: string[];
  total: number;
  status: 'ready' | 'processing' | 'completed';
  cellNumber: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProductScanned, setIsProductScanned] = useState(false);
  const [orderStep, setOrderStep] = useState<'found' | 'scanned' | 'paid'>('found');
  const [showAudioUploader, setShowAudioUploader] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Web Speech API для озвучки
  const speak = useCallback((text: string, priority = false) => {
    if ('speechSynthesis' in window) {
      // Остановить текущую озвучку если это приоритетное сообщение
      if (priority) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        console.log('Ошибка озвучки, используем console.log:', text);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('ОЗВУЧКА:', text);
      // Визуальная обратная связь
      const toast = document.createElement('div');
      toast.textContent = `🔊 ${text}`;
      toast.className = 'fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  }, []);

  // Функция для воспроизведения аудиофайлов
  const playAudioFile = useCallback(async (audioType: 'cell' | 'discount' | 'camera' | 'rate', cellNumber?: number) => {
    try {
      // Определяем путь к аудиофайлу
      let audioPath = '';
      let fallbackText = '';
      
      switch (audioType) {
        case 'cell':
          audioPath = `/audio/cells/${cellNumber || 1}.mp3`;
          fallbackText = `Ячейка номер ${cellNumber || 1}`;
          break;
        case 'discount':
          audioPath = '/audio/discount.mp3';
          fallbackText = 'Товары со скидкой! Проверьте ВБ кошелёк!';
          break;
        case 'camera':
          audioPath = '/audio/camera.mp3';
          fallbackText = 'Проверьте товар под камерой!';
          break;
        case 'rate':
          audioPath = '/audio/rate.mp3';
          fallbackText = 'Оцените наш пункт выдачи в приложении ВБ!';
          break;
      }

      // Попытка воспроизвести аудиофайл
      if (audioRef.current) {
        audioRef.current.src = audioPath;
        audioRef.current.oncanplaythrough = () => {
          if (audioRef.current) {
            setIsSpeaking(true);
            audioRef.current.play().catch(() => {
              // Если не удалось воспроизвести файл, используем Web Speech API
              setIsSpeaking(false);
              speak(fallbackText, true);
            });
          }
        };
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
          // Если ошибка загрузки файла, используем Web Speech API
          setIsSpeaking(false);
          speak(fallbackText, true);
        };
        audioRef.current.load();
      } else {
        // Если нет ref, используем Web Speech API
        speak(fallbackText, true);
      }
    } catch (error) {
      // В случае любой ошибки используем Web Speech API
      console.error('Ошибка воспроизведения аудио:', error);
      speak(fallbackText, true);
    }
  }, [speak]);

  // Генерация случайных заказов
  const generateRandomOrder = (): Order => {
    const orderIds = ['WB12345678', 'WB87654321', 'WB55667788', 'WB99112233', 'WB44556677'];
    const cells = [
      { cell: 'А-15', number: 15 },
      { cell: 'Б-23', number: 23 },
      { cell: 'В-07', number: 7 },
      { cell: 'Г-41', number: 41 },
      { cell: 'Д-12', number: 12 }
    ];
    const items = [
      ['Кроссовки Nike', 'Футболка'],
      ['Платье летнее'],
      ['Джинсы', 'Рубашка', 'Кепка'],
      ['Сумка женская'],
      ['Телефон Samsung', 'Чехол']
    ];
    const totals = [2890, 1590, 4250, 3100, 15990];
    
    const randomIndex = Math.floor(Math.random() * orderIds.length);
    const selectedCell = cells[randomIndex];
    
    return {
      id: orderIds[randomIndex],
      cell: selectedCell.cell,
      cellNumber: selectedCell.number,
      items: items[randomIndex],
      total: totals[randomIndex],
      status: 'ready'
    };
  };

  const handleQRScan = () => {
    setIsScanning(true);
    setOrderStep('found');
    setIsProductScanned(false);
    
    // Симуляция процесса сканирования
    setTimeout(() => {
      const order = generateRandomOrder();
      setCurrentOrder(order);
      setIsScanning(false);
      
      // Озвучка номера ячейки
      playAudioFile('cell', order.cellNumber);
      
      // Через 3 секунды озвучка про скидку
      setTimeout(() => {
        playAudioFile('discount');
      }, 3000);
      
    }, 2500);
  };

  const handleProductScan = () => {
    if (!currentOrder) return;
    
    setIsProductScanned(true);
    setOrderStep('scanned');
    
    // Озвучка про проверку под камерой
    playAudioFile('camera');
    
    // Обновляем статус заказа
    setCurrentOrder(prev => prev ? {...prev, status: 'processing'} : null);
  };

  const handlePayment = () => {
    if (!currentOrder) return;
    
    setOrderStep('paid');
    
    // Симуляция обработки оплаты
    setTimeout(() => {
      playAudioFile('rate');
      
      // Через 4 секунды очищаем заказ
      setTimeout(() => {
        setCurrentOrder(null);
        setIsProductScanned(false);
        setOrderStep('found');
        setPhoneNumber('');
      }, 4000);
      
    }, 1500);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length === 4) {
      const order = generateRandomOrder();
      setCurrentOrder(order);
      setOrderStep('found');
      setIsProductScanned(false);
      
      // Озвучка номера ячейки
      playAudioFile('cell', order.cellNumber);
      
      // Через 3 секунды озвучка про скидку
      setTimeout(() => {
        playAudioFile('discount');
      }, 3000);
    }
  };

  // Очистка при смене вкладки
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'выдача') {
      setCurrentOrder(null);
      setPhoneNumber('');
      setIsScanning(false);
      setIsProductScanned(false);
      setOrderStep('found');
      window.speechSynthesis.cancel();
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
            <Icon name="Menu" size={20} className="text-muted-foreground" />
            <Icon name="ShoppingCart" size={20} className="text-muted-foreground" />
            <Icon name="Search" size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="flex max-w-md mx-auto">
          {['выдача', 'приёмка', 'возврат'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-4 px-2 text-center relative transition-colors ${
                activeTab === tab 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-primary/70'
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
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-scale-in" />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center p-2 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAudioUploader(true)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            <Icon name="Volume2" size={12} className="mr-1" />
            Настроить озвучку
          </Button>
          <Badge variant="secondary" className="bg-muted">
            <Icon name="RotateCcw" size={12} className="mr-1" />
            13
          </Badge>
        </div>
      </div>

      {/* Sound Indicator */}
      {isSpeaking && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <Icon name="Volume2" size={16} />
          <span className="text-sm">Озвучка...</span>
        </div>
      )}

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
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border-4 border-dashed border-primary/30">
                    {isScanning ? (
                      <div className="animate-pulse">
                        <Icon name="Scan" size={40} className="text-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="QrCode" size={24} className="text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleQRScan}
                  disabled={isScanning}
                  className="w-full mb-6 bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Сканирование...
                    </div>
                  ) : (
                    'Начать сканирование'
                  )}
                </Button>

                <div className="text-muted-foreground text-sm mb-4">или</div>

                {/* Phone Input */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Введите номер телефона клиента
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="Последние 4 цифры номера"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPhoneNumber(value);
                      }}
                      maxLength={4}
                      className="text-center text-lg font-mono tracking-widest"
                    />
                    <Button 
                      onClick={handlePhoneSubmit}
                      disabled={phoneNumber.length !== 4}
                      className="bg-primary hover:bg-primary/90 text-white transition-all duration-300"
                    >
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Order */}
            {currentOrder && (
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
                          onClick={handleProductScan}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105"
                        >
                          <Icon name="Package" size={16} className="mr-2" />
                          Сканировать товар
                        </Button>
                        <Button 
                          onClick={handlePayment}
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
                        onClick={handlePayment}
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
            )}
          </div>
        )}

        {activeTab === 'приёмка' && (
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
        )}

        {activeTab === 'возврат' && (
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
        )}
      </div>

      {/* Audio element для воспроизведения файлов */}
      <audio ref={audioRef} preload="none" />

      {/* Модальное окно загрузки аудио */}
      {showAudioUploader && (
        <AudioUploader onClose={() => setShowAudioUploader(false)} />
      )}
    </div>
  );
};

export default Index;