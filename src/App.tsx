import React, { useState, useEffect } from 'react';
import AudioSetup from './components/AudioSetup';

interface Order {
  id: string;
  cell: string;
  status: 'waiting' | 'scanned' | 'brought' | 'checked' | 'paid' | 'completed';
  customerPhone?: string;
}

const WBPickupApp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders] = useState<Order[]>([
    { id: 'WB001234567', cell: 'А15', status: 'waiting' },
    { id: 'WB001234568', cell: 'Б23', status: 'waiting' },
    { id: 'WB001234569', cell: 'В07', status: 'waiting' },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Улучшенная система озвучки с поддержкой реальных и демо аудио
  const playAudio = async (audioFile: string, fallbackText: string) => {
    try {
      // Пробуем воспроизвести реальный аудио файл
      const audio = new Audio(`/audio/${audioFile}`);
      audio.volume = 0.9;
      
      // Добавляем обработку загрузки
      return new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => {
          audio.play()
            .then(() => {
              audio.onended = () => resolve();
            })
            .catch(reject);
        };
        
        audio.onerror = () => reject(new Error('Audio file not found'));
        audio.load();
        
        // Таймаут для перехода к fallback
        setTimeout(() => reject(new Error('Audio timeout')), 1000);
      });
    } catch (error) {
      // Fallback на синтез речи если файл не найден
      return new Promise<void>((resolve) => {
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel(); // Останавливаем предыдущую озвучку
          const utterance = new SpeechSynthesisUtterance(fallbackText);
          utterance.lang = 'ru-RU';
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          
          speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      });
    }
  };

  // Последовательная озвучка нескольких файлов
  const playSequentialAudio = async (audioSequence: Array<{file: string, text: string}>, delay = 1500) => {
    for (let i = 0; i < audioSequence.length; i++) {
      await playAudio(audioSequence[i].file, audioSequence[i].text);
      if (i < audioSequence.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Аудио файлы из облака cloud.mail.ru/public/WMiM/n1UTJ5fwe
  const audioFiles = {
    // Ячейки из папки "Ячейки"
    cellA15: 'ячейки/А15.mp3',
    cellA16: 'ячейки/А16.mp3',
    cellA17: 'ячейки/А17.mp3', 
    cellA18: 'ячейки/А18.mp3',
    cellB23: 'ячейки/Б23.mp3',
    cellB24: 'ячейки/Б24.mp3',
    cellV07: 'ячейки/В07.mp3',
    cellV08: 'ячейки/В08.mp3',
    
    // Основные фразы
    welcome: 'добро-пожаловать.mp3',
    discountCheck: 'товары-со-скидкой-проверьте-вб-кошелек.mp3',
    cameraCheck: 'проверьте-товар-под-камерой.mp3',
    rateService: 'оцените-наш-пункт-выдачи-в-приложении.mp3',
    thankYou: 'спасибо-за-покупку-хорошего-дня.mp3',
    
    // Дополнительные фразы
    orderFound: 'заказ-найден.mp3',
    checkDocument: 'проверьте-документы.mp3',
    paymentCompleted: 'оплата-прошла.mp3'
  };

  const handleQRScan = async (qrData: string) => {
    // Находим заказ
    const order = orders.find(o => o.id === qrData || o.cell === qrData);
    
    if (order && order.status === 'waiting') {
      setCurrentOrder({ ...order, status: 'scanned' });
      
      // Определяем аудио для ячейки
      const getCellAudio = (cell: string) => {
        const cellMap: {[key: string]: string} = {
          'А15': audioFiles.cellA15,
          'А16': audioFiles.cellA16, 
          'А17': audioFiles.cellA17,
          'А18': audioFiles.cellA18,
          'Б23': audioFiles.cellB23,
          'Б24': audioFiles.cellB24,
          'В07': audioFiles.cellV07,
          'В08': audioFiles.cellV08
        };
        return cellMap[cell] || 'ячейки/default.mp3';
      };
      
      // Последовательная озвучка: заказ найден -> ячейка -> скидки
      await playSequentialAudio([
        { file: audioFiles.orderFound, text: 'Заказ найден' },
        { file: getCellAudio(order.cell), text: `Ячейка ${order.cell}` },
        { file: audioFiles.discountCheck, text: 'Товары со скидкой, проверьте ВБ кошелёк' }
      ]);
    }
  };

  const handlePhoneSearch = async () => {
    if (phoneNumber.length >= 4) {
      const cells = ['А15', 'А16', 'А17', 'А18', 'Б23', 'Б24', 'В07', 'В08'];
      const randomCell = cells[Math.floor(Math.random() * cells.length)];
      
      const mockOrder: Order = {
        id: `WB${Math.random().toString().substr(2, 9)}`,
        cell: randomCell,
        status: 'scanned',
        customerPhone: phoneNumber
      };
      setCurrentOrder(mockOrder);
      
      // Определяем аудио для ячейки
      const getCellAudio = (cell: string) => {
        const cellMap: {[key: string]: string} = {
          'А15': audioFiles.cellA15, 'А16': audioFiles.cellA16, 'А17': audioFiles.cellA17, 'А18': audioFiles.cellA18,
          'Б23': audioFiles.cellB23, 'Б24': audioFiles.cellB24, 'В07': audioFiles.cellV07, 'В08': audioFiles.cellV08
        };
        return cellMap[cell] || 'ячейки/default.mp3';
      };
      
      // Последовательная озвучка
      await playSequentialAudio([
        { file: audioFiles.orderFound, text: 'Заказ найден' },
        { file: getCellAudio(randomCell), text: `Ячейка ${randomCell}` },
        { file: audioFiles.discountCheck, text: 'Товары со скидкой, проверьте ВБ кошелёк' }
      ]);
    }
  };

  const handleItemBrought = async () => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status: 'brought' });
      // Последовательная озвучка: проверьте документы + проверьте товар под камерой
      await playSequentialAudio([
        { file: audioFiles.checkDocument, text: 'Проверьте документы клиента' },
        { file: audioFiles.cameraCheck, text: 'Проверьте товар под камерой' }
      ]);
    }
  };

  const handleItemChecked = () => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status: 'checked' });
    }
  };

  const handlePaymentCompleted = async () => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status: 'paid' });
      
      // Последовательная озвучка: оплата прошла -> оцените сервис -> спасибо
      await playSequentialAudio([
        { file: audioFiles.paymentCompleted, text: 'Оплата успешно прошла' },
        { file: audioFiles.rateService, text: 'Оцените наш пункт выдачи в приложении' },
        { file: audioFiles.thankYou, text: 'Спасибо за покупку, хорошего дня!' }
      ]);
      
      // Очищаем заказ после завершения
      setTimeout(() => {
        setCurrentOrder(null);
        setPhoneNumber('');
      }, 5000);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'waiting': return 'Ожидание клиента';
      case 'scanned': return 'QR отсканирован';
      case 'brought': return 'Товар принесён';
      case 'checked': return 'Товар проверен';
      case 'paid': return 'Оплачено';
      default: return 'Неизвестен';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AudioSetup />
      {/* Top Window Bar */}
      <div className="h-8 bg-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">WB</span>
          </div>
          <span className="text-white text-sm">WB ПВЗ</span>
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <span>—</span>
          <span>◻</span>
          <span>×</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <img 
              src="https://cdn.poehali.dev/files/bbf13e73-cc4d-4590-9bff-515b872cdfb9.png"
              alt="WB Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium flex items-center gap-2 border border-purple-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Выдача
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Приемка
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Возврат
            </button>
          </div>
          
          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              13
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">🔔</span>
              <span className="text-gray-600">💬</span>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Установить версию
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-16 bg-gray-50 border-r flex flex-col items-center py-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2">
              <path d="M9 19c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8z"/>
              <circle cx="9" cy="11" r="2"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-gray-100 flex flex-col">
          {/* Current Order Status */}
          {currentOrder && (
            <div className="bg-white border-b p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">Заказ: {currentOrder.id}</div>
                    <div className="text-gray-600">Ячейка: {currentOrder.cell}</div>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {getStatusText(currentOrder.status)}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {currentOrder.status === 'scanned' && (
                    <button 
                      onClick={handleItemBrought}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Товар принесён
                    </button>
                  )}
                  {currentOrder.status === 'brought' && (
                    <button 
                      onClick={handleItemChecked}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Товар проверен
                    </button>
                  )}
                  {currentOrder.status === 'checked' && (
                    <button 
                      onClick={handlePaymentCompleted}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Оплата прошла
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scanner Area */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
            <div className="w-full max-w-lg text-center space-y-12">
              {/* Title */}
              <h1 className="text-2xl text-gray-600 font-normal leading-relaxed">
                Отсканируйте QR-код клиента или курьера
              </h1>

              {/* QR Scanner */}
              <div className="flex justify-center">
                <img 
                  src="https://cdn.poehali.dev/files/04d9ffff-5ab3-4256-89e9-4eedb060ab77.png" 
                  alt="QR Scanner"
                  className="w-64 h-64 object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => handleQRScan('WB001234567')}
                />
              </div>



              {/* OR Divider */}
              <div className="text-gray-500 text-lg font-normal">
                или
              </div>

              {/* Phone Input */}
              <div className="space-y-6">
                <p className="text-gray-600 text-lg font-normal">
                  Введите номер телефона клиента
                </p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Последние 4 цифры номера"
                    className="w-full px-6 py-4 border border-gray-300 rounded-lg text-center text-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                    maxLength={10}
                  />
                  
                  {phoneNumber.length >= 4 && (
                    <button
                      onClick={handlePhoneSearch}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg text-lg font-medium transition-colors duration-200"
                    >
                      Найти заказ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-white border-t px-4 py-2 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Время: {currentTime.toLocaleTimeString('ru-RU')}</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Система озвучки активна</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => playAudio(audioFiles.welcome, 'Добро пожаловать в пункт выдачи Wildberries')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
              >
                🔊 Тест аудио
              </button>
              <span>Готов к работе</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WBPickupApp;