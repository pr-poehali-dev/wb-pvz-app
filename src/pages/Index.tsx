import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NavigationTabs from '@/components/NavigationTabs';
import QRScanner from '@/components/QRScanner';
import OrderCard from '@/components/OrderCard';
import TabContent from '@/components/TabContent';
import AudioUploader from '@/components/AudioUploader';
import Dashboard from '@/components/Dashboard';
import AppTester from '@/components/AppTester';
import CloudAudioLoader from '@/components/CloudAudioLoader';
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
  
  const { audioRef, isSpeaking, playAudioFile } = useAudio();

  // Проверяем загружены ли аудиофайлы при запуске
  React.useEffect(() => {
    const checkAudioStatus = () => {
      const loaded = isAudioLoaded();
      setAudioLoaded(loaded);
      
      if (!loaded) {
        console.log('🔍 Аудиофайлы не найдены. Показываем предложение загрузить с облака...');
        // Показываем уведомление о загрузке через 2 секунды
        setTimeout(() => {
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: white; padding: 16px 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999; font-family: system-ui; font-size: 14px; max-width: 400px; text-align: center; cursor: pointer;" onclick="this.remove()">
              <div style="font-weight: 600; margin-bottom: 8px;">🎵 Загрузите озвучку</div>
              <div>Нажмите "Настроить озвучку" внизу экрана для загрузки аудиофайлов с облака</div>
            </div>
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 6000);
        }, 2000);
      } else {
        console.log('✅ Аудиофайлы найдены и готовы к использованию!');
      }
    };

    checkAudioStatus();
  }, []);

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
      // Остановка текущего аудио
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header with menu icons and install button */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left menu icons */}
            <div className="flex items-center gap-4">
              <Icon name="Menu" size={20} className="text-gray-600" />
              <Icon name="FileText" size={20} className="text-gray-600" />
              <Icon name="Search" size={20} className="text-gray-600" />
            </div>
            
            {/* Right side icons and button */}
            <div className="flex items-center gap-4">
              <Icon name="Users" size={20} className="text-gray-600" />
              <Icon name="Moon" size={20} className="text-gray-600" />
              <Icon name="MessageCircle" size={20} className="text-gray-600" />
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Icon name="Download" size={16} />
                Установить версию
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onShowAudioUploader={() => setShowAudioUploader(true)}
          onShowTester={() => setShowTester(true)}
        />

        {/* Sound Indicator */}
        {isSpeaking && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in">
            <Icon name="Volume2" size={16} />
            <span className="text-sm">Озвучка...</span>
          </div>
        )}

        {/* Быстрая загрузка аудио - показываем если не загружено */}
        {!audioLoaded && (
          <div className="fixed top-4 right-4 z-40">
            <Button
              onClick={() => setShowCloudLoader(true)}
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg animate-pulse"
            >
              <Icon name="CloudDownload" size={16} className="mr-2" />
              Загрузить озвучку
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'выдача' && (
            <>
              {!currentOrder ? (
                /* Дашборд когда нет активного заказа */
                <Dashboard />
              ) : (
                /* Активный процесс выдачи */
                <div className="max-w-2xl mx-auto space-y-6">
                  <OrderCard 
                    currentOrder={currentOrder}
                    orderStep={orderStep}
                    onProductScan={handleProductScan}
                    onPayment={handlePayment}
                  />
                </div>
              )}
              
              {/* QR Scanner всегда доступен */}
              <div className="fixed bottom-6 right-6 z-40">
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
                  <QRScanner 
                    phoneNumber={phoneNumber}
                    isScanning={isScanning}
                    onPhoneNumberChange={setPhoneNumber}
                    onQRScan={handleQRScan}
                    onPhoneSubmit={handlePhoneSubmit}
                  />
                </div>
              </div>
            </>
          )}

          {/* Tab Content for other tabs */}
          <TabContent activeTab={activeTab} onStartScanning={() => setIsScanning(true)} />
        </div>
      </div>

      {/* Audio element для воспроизведения файлов */}
      <audio ref={audioRef} preload="none" />

      {/* Модальное окно загрузки аудио */}
      {showAudioUploader && (
        <AudioUploader onClose={() => setShowAudioUploader(false)} />
      )}

      {/* Модальное окно тестирования */}
      {showTester && (
        <AppTester onClose={() => setShowTester(false)} />
      )}

      {/* Модальное окно загрузки с облака */}
      {showCloudLoader && (
        <CloudAudioLoader 
          onClose={() => setShowCloudLoader(false)}
          onLoadComplete={() => {
            setAudioLoaded(true);
            console.log('🎉 Аудиофайлы успешно загружены с облака!');
          }}
        />
      )}
    </div>
  );
};

export default Index;