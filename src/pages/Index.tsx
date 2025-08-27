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
  const [orderStep, setOrderStep] = useState<'found' | 'scanned' | 'paid'>('found');
  const [showAudioUploader, setShowAudioUploader] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [showCloudLoader, setShowCloudLoader] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const { playAudio, isSpeaking, audioRef } = useAudio();

  React.useEffect(() => {
    setAudioLoaded(isAudioLoaded());
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Сброс состояния при смене вкладки
    if (tab !== 'выдача') {
      setCurrentOrder(null);
      setPhoneNumber('');
      setIsScanning(false);
      setIsProductScanned(false);
      setOrderStep('found');
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleQRScan = async () => {
    setIsScanning(true);
    await playAudio('camera');
    
    setTimeout(() => {
      const order = generateRandomOrder(phoneNumber);
      setCurrentOrder(order);
      setIsScanning(false);
      setOrderStep('found');
      console.log('🎯 Заказ найден:', order);
    }, 2000);
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length >= 4) {
      await playAudio('camera');
      const order = generateRandomOrder(phoneNumber);
      setCurrentOrder(order);
      setOrderStep('found');
      console.log('📞 Заказ найден по телефону:', order);
    }
  };

  const handleProductScan = async () => {
    await playAudio('camera');
    setIsProductScanned(true);
    setOrderStep('scanned');
    
    setTimeout(async () => {
      const cellNumber = currentOrder?.cellNumber || Math.floor(Math.random() * 50) + 1;
      await playAudio('cells', cellNumber);
    }, 1000);
  };

  const handlePayment = async () => {
    await playAudio('discount');
    
    setTimeout(async () => {
      setOrderStep('paid');
      await playAudio('rate');
      
      setTimeout(() => {
        setCurrentOrder(null);
        setPhoneNumber('');
        setIsScanning(false);
        setIsProductScanned(false);
        setOrderStep('found');
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Window Controls */}
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
            <Icon name="Package" size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium">WB ПВЗ</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-500"></button>
          <button className="w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-500"></button>
          <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400"></button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-20 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-8">
              <Icon name="Package" size={24} className="text-white" />
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => setShowAudioUploader(true)}
                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                title="Настроить озвучку"
              >
                <Icon name="Settings" size={20} />
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="text-xs text-gray-400 space-y-1">
              <div>id 000000001</div>
              <div>v1.0.0.*</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Icon name="Menu" size={20} className="text-gray-400" />
                <Icon name="Search" size={20} className="text-gray-400" />
                <Icon name="FileText" size={20} className="text-gray-400" />
              </div>
              
              <div className="flex items-center gap-6">
                <Icon name="BarChart3" size={20} className="text-gray-400" />
                <Icon name="Search" size={20} className="text-gray-400" />
                <Icon name="MessageCircle" size={20} className="text-gray-400" />
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Icon name="Download" size={16} className="mr-2" />
                  Установить версию
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-center">
              <div className="flex">
                <button 
                  className={`px-8 py-4 flex flex-col items-center gap-2 transition-colors relative ${
                    activeTab === 'выдача' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
                  }`}
                  onClick={() => handleTabChange('выдача')}
                >
                  <Icon name="Package" size={24} />
                  <span className="text-sm font-medium">Выдача</span>
                  {activeTab === 'выдача' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
                
                <button 
                  className={`px-8 py-4 flex flex-col items-center gap-2 transition-colors relative ${
                    activeTab === 'приёмка' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
                  }`}
                  onClick={() => handleTabChange('приёмка')}
                >
                  <Icon name="Truck" size={24} />
                  <span className="text-sm font-medium">Приёмка</span>
                  {activeTab === 'приёмка' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
                
                <button 
                  className={`px-8 py-4 flex flex-col items-center gap-2 transition-colors relative ${
                    activeTab === 'возврат' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
                  }`}
                  onClick={() => handleTabChange('возврат')}
                >
                  <div className="relative">
                    <Icon name="RotateCcw" size={24} />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      13
                    </span>
                  </div>
                  <span className="text-sm font-medium">Возврат</span>
                  {activeTab === 'возврат' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'выдача' && (
              <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
                {currentOrder ? (
                  <div className="max-w-md w-full">
                    <OrderCard 
                      currentOrder={currentOrder}
                      orderStep={orderStep}
                      onProductScan={handleProductScan}
                      onPayment={handlePayment}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-8">
                    <h2 className="text-xl font-medium text-gray-700 mb-8">
                      Отсканируйте QR-код клиента или курьера
                    </h2>
                    
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <img 
                          src="/img/8c005b5b-ae56-468b-9f3b-f75a33a47829.jpg" 
                          alt="QR Scanner" 
                          className="w-64 h-64 object-contain"
                        />
                        {isScanning && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-4 border-purple-500 border-dashed animate-pulse rounded-lg"></div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={handleQRScan}
                        disabled={isScanning}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                      >
                        {isScanning ? (
                          <>
                            <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                            Сканирование...
                          </>
                        ) : (
                          <>
                            <Icon name="QrCode" size={20} className="mr-2" />
                            Начать сканирование
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">или</p>
                      <div className="space-y-4">
                        <p className="text-gray-700 font-medium">Введите номер телефона клиента</p>
                        <div className="flex items-center justify-center space-x-4">
                          <Input
                            type="tel"
                            placeholder="Последние 4 цифры номера"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                            className="max-w-xs text-center"
                            maxLength={4}
                          />
                          <Button 
                            onClick={handlePhoneSubmit}
                            disabled={phoneNumber.length < 4}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Найти
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'приёмка' && <ReceptionTab />}
            {activeTab === 'возврат' && <ReturnsTab />}
          </div>
        </div>
      </div>

      {/* Sound Indicator */}
      {isSpeaking && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
          <Icon name="Volume2" size={16} />
          <span className="text-sm">Озвучка...</span>
        </div>
      )}

      {/* Quick Audio Load Button */}
      {!audioLoaded && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setShowCloudLoader(true)}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Icon name="CloudDownload" size={16} className="mr-2" />
            Загрузить озвучку
          </Button>
        </div>
      )}

      {/* Audio element */}
      <audio ref={audioRef} preload="none" />

      {/* Modals */}
      {showAudioUploader && (
        <AudioUploader onClose={() => setShowAudioUploader(false)} />
      )}

      {showTester && (
        <AppTester onClose={() => setShowTester(false)} />
      )}

      {showCloudLoader && (
        <CloudAudioLoader 
          onClose={() => setShowCloudLoader(false)}
          onLoadComplete={() => setAudioLoaded(true)}
        />
      )}
    </div>
  );
};

export default Index;