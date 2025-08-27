import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPhoneNumber('');
  };

  const startScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handlePhoneSearch = () => {
    console.log('Phone search:', phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Темная шапка */}
      <div className="bg-gray-800 text-white h-10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://cdn.poehali.dev/files/b5495ae9-2b90-41be-97b8-2e7b76e5db77.png" 
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
          {/* Верхняя панель с меню и кнопками */}
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
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-gray-600 mb-8 text-lg">
                    Отсканируйте QR-код клиента или курьера
                  </h2>
                  
                  <div className="mb-12">
                    <img 
                      src="https://cdn.poehali.dev/files/40af1a34-1bf1-4bdf-bcd5-f6925aef79fb.png" 
                      alt="QR Scanner" 
                      className={`w-64 h-auto mx-auto transition-transform duration-300 ${
                        isScanning ? 'scale-105' : 'hover:scale-102'
                      }`}
                    />
                  </div>

                  <Button 
                    onClick={startScanning}
                    disabled={isScanning}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 mb-12"
                  >
                    {isScanning ? 'Сканирование...' : 'Начать сканирование'}
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
              </div>
            )}

            {activeTab === 'приёмка' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Приёмка товаров</h2>
                <p className="text-gray-600">Здесь будет интерфейс приёмки товаров</p>
              </div>
            )}

            {activeTab === 'возврат' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Обработка возвратов</h2>
                <p className="text-gray-600">Здесь будет интерфейс обработки возвратов</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;