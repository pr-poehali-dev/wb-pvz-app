import React, { useState } from 'react';

const WBPickupApp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleQRClick = () => {
    playSound('Отсканируйте QR-код клиента или курьера');
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 4) {
      playSound(`Номер телефона ${phoneNumber} принят`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">WB</span>
          </div>
          <span className="text-gray-900 font-medium">WB ПВЗ</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Выдача
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Приемка
            </button>
            <button className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Возврат
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              13
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Установить версию
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center space-y-8">
          {/* Title */}
          <h1 className="text-xl text-gray-700 font-medium">
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
              className="w-48 h-48 object-contain hover:scale-105 transition-transform"
            />
          </div>

          {/* OR Divider */}
          <div className="text-gray-500 text-sm font-medium">
            или
          </div>

          {/* Phone Input */}
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">
              Введите номер телефона клиента
            </p>
            
            <div className="space-y-2">
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Последние 4 цифры номера"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={10}
              />
              
              {phoneNumber.length >= 4 && (
                <button
                  onClick={handlePhoneSubmit}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Найти заказ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WBPickupApp;