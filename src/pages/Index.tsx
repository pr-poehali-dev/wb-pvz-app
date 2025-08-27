import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import AudioUploader from '@/components/AudioUploader';
import AppTester from '@/components/AppTester';
import CloudAudioLoader from '@/components/CloudAudioLoader';
import ReceptionTab from '@/components/ReceptionTab';
import ReturnsTab from '@/components/ReturnsTab';
import OrderCard from '@/components/OrderCard';
import { useAudio } from '@/hooks/useAudio';
import { generateRandomOrder, Order } from '@/utils/orderUtils';
import { isAudioLoaded } from '@/utils/audioLoader';

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isProductScanned, setIsProductScanned] = useState(false);
  const { playAudio } = useAudio();

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    setPhoneNumber('');
    setCurrentOrder(null);
    setIsProductScanned(false);
    
    if (isAudioLoaded) {
      await playAudio('click');
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
    if (isAudioLoaded) {
      await playAudio('scan');
    }
    
    setTimeout(() => {
      const order = generateRandomOrder();
      setCurrentOrder(order);
      setIsScanning(false);
      setIsProductScanned(true);
    }, 2000);
  };

  const handlePhoneSearch = async () => {
    if (phoneNumber.length >= 4) {
      const order = generateRandomOrder();
      setCurrentOrder(order);
      if (isAudioLoaded) {
        await playAudio('success');
      }
    }
  };

  const completeOrder = async () => {
    if (isAudioLoaded) {
      await playAudio('complete');
    }
    setCurrentOrder(null);
    setIsProductScanned(false);
    setPhoneNumber('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Icon name="Package" size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              WB ПВЗ Система
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-1 mb-8">
          <button
            onClick={() => handleTabChange('выдача')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'выдача'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Icon name="Package" size={20} />
            Выдача
          </button>
          <button
            onClick={() => handleTabChange('приёмка')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'приёмка'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Icon name="Truck" size={20} />
            Приёмка
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">13</span>
          </button>
          <button
            onClick={() => handleTabChange('возврат')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'возврат'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Icon name="RotateCcw" size={20} />
            Возврат
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">13</span>
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'выдача' && (
          <div className="max-w-2xl mx-auto">
            {!currentOrder ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="mb-6">
                    <div className="inline-block relative">
                      <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center transform transition-transform duration-500 ${
                        isScanning ? 'scale-110 shadow-2xl' : 'hover:scale-105'
                      }`}>
                        <Icon 
                          name={isScanning ? 'Loader2' : 'QrCode'} 
                          size={48} 
                          className={`text-white ${isScanning ? 'animate-spin' : ''}`} 
                        />
                      </div>
                      {isScanning && (
                        <div className="absolute inset-0 border-4 border-purple-400 rounded-3xl animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Отсканируйте QR-код клиента или курьера
                  </h2>
                  
                  <Button 
                    onClick={startScanning}
                    disabled={isScanning}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium mb-8 shadow-lg"
                  >
                    {isScanning ? 'Сканирование...' : 'Начать сканирование'}
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-gray-500 mb-4">или</div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Введите номер телефона клиента
                      </label>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Последние 4 цифры номера"
                        className="text-center text-lg py-3"
                        maxLength={4}
                      />
                    </div>
                    <Button 
                      onClick={handlePhoneSearch}
                      disabled={phoneNumber.length < 4}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium"
                    >
                      Найти заказ
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <OrderCard 
                order={currentOrder} 
                onComplete={completeOrder}
                isProductScanned={isProductScanned}
              />
            )}
          </div>
        )}

        {activeTab === 'приёмка' && <ReceptionTab />}
        {activeTab === 'возврат' && <ReturnsTab />}

        {/* Audio Controls */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
            <AudioUploader />
            <CloudAudioLoader />
            <AppTester />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;