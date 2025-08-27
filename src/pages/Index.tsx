import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NavigationTabs from '@/components/NavigationTabs';
import QRScanner from '@/components/QRScanner';
import OrderCard from '@/components/OrderCard';
import TabContent from '@/components/TabContent';
import AudioUploader from '@/components/AudioUploader';
import { useAudio } from '@/hooks/useAudio';
import { generateRandomOrder, Order } from '@/utils/orderUtils';

const Index = () => {
  const [activeTab, setActiveTab] = useState('выдача');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isProductScanned, setIsProductScanned] = useState(false);
  const [orderStep, setOrderStep] = useState<'found' | 'scanned' | 'paid'>('found');
  const [showAudioUploader, setShowAudioUploader] = useState(false);
  
  const { audioRef, isSpeaking, playAudioFile } = useAudio();

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
        />

        {/* Sound Indicator */}
        {isSpeaking && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in">
            <Icon name="Volume2" size={16} />
            <span className="text-sm">Озвучка...</span>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'выдача' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* QR Scanner Section */}
              <QRScanner 
                phoneNumber={phoneNumber}
                isScanning={isScanning}
                onPhoneNumberChange={setPhoneNumber}
                onQRScan={handleQRScan}
                onPhoneSubmit={handlePhoneSubmit}
              />

              {/* Current Order */}
              {currentOrder && (
                <OrderCard 
                  currentOrder={currentOrder}
                  orderStep={orderStep}
                  onProductScan={handleProductScan}
                  onPayment={handlePayment}
                />
              )}
            </div>
          )}

          {/* Tab Content for other tabs */}
          <TabContent activeTab={activeTab} />
        </div>
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