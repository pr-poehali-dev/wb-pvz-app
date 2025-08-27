import React, { useState } from 'react';

const WBPickupApp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const playSound = (text: string, audioFile?: string) => {
    // Пытаемся воспроизвести аудио файл, если он указан
    if (audioFile) {
      const audio = new Audio(`/audio/${audioFile}`);
      audio.play().catch(() => {
        // Если аудио файл не найден, используем синтез речи
        fallbackToSpeech(text);
      });
    } else {
      fallbackToSpeech(text);
    }
  };

  const fallbackToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleQRClick = () => {
    playSound('Отсканируйте QR-код клиента или курьера', 'qr-scan.mp3');
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 4) {
      playSound(`Номер телефона ${phoneNumber} принят`, 'phone-accepted.mp3');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\\D/g, '');
    setPhoneNumber(value);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
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
              src="https://cdn.poehali.dev/files/4ddafe2f-d1a8-4fcd-9ed1-bd6ff8d62c00.png"
              alt="WB Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Navigation */}
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
          
          {/* Right side */}
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

      {/* Sidebar */}
      <div className="flex flex-1">
        <div className="w-16 bg-gray-50 border-r flex flex-col items-center py-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2">
              <path d="M9 19c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8z"/>
              <circle cx="9" cy="11" r="2"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-lg text-center space-y-12">
            {/* Title */}
            <h1 className="text-2xl text-gray-600 font-normal leading-relaxed">
              Отсканируйте QR-код клиента или курьера
            </h1>

            {/* QR Scanner */}
            <div 
              className="flex justify-center cursor-pointer"
              onClick={handleQRClick}
            >
              <img 
                src="https://cdn.poehali.dev/files/db0e9f54-681c-40d1-9c1e-82c54540fe15.png" 
                alt="QR Scanner"
                className="w-64 h-64 object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* OR Divider */}
            <div className="text-gray-500 text-lg font-normal">
              или
            </div>

            {/* Phone Input Section */}
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
                    onClick={handlePhoneSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg text-lg font-medium transition-colors duration-200"
                  >
                    Найти заказ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WBPickupApp;