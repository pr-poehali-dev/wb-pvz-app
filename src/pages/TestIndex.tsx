import React from 'react';

const TestIndex = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🚀 WB ПВЗ - Система выдачи заказов
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl mb-4">Приложение работает!</h2>
          <p className="text-gray-600 mb-4">
            Система озвучки для пунктов выдачи Wildberries запущена успешно.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium text-blue-800">📱 Сканирование</h3>
              <p className="text-sm text-blue-600 mt-1">QR-коды и номера телефонов</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium text-green-800">🔊 Озвучка</h3>
              <p className="text-sm text-green-600 mt-1">Голосовые уведомления</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-medium text-purple-800">📦 Выдача</h3>
              <p className="text-sm text-purple-600 mt-1">Автоматизированный процесс</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded">
              <h3 className="font-medium text-orange-800">⭐ Оценка</h3>
              <p className="text-sm text-orange-600 mt-1">Система обратной связи</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">🎵 Тест озвучки</h3>
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance('Добро пожаловать в пункт выдачи');
                    utterance.lang = 'ru-RU';
                    speechSynthesis.speak(utterance);
                  }
                }}
              >
                Приветствие
              </button>
              
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance('Ячейка А15');
                    utterance.lang = 'ru-RU';
                    speechSynthesis.speak(utterance);
                  }
                }}
              >
                Ячейка
              </button>
              
              <button 
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance('Товары со скидкой, проверьте ВБ кошелек');
                    utterance.lang = 'ru-RU';
                    speechSynthesis.speak(utterance);
                  }
                }}
              >
                Скидки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIndex;