import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  cell: string;
  status: 'waiting' | 'scanned' | 'brought' | 'checked' | 'paid' | 'completed';
  items?: number;
  amount?: number;
  customerPhone?: string;
}

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: '12345678', cell: 'А15', status: 'waiting', items: 3, amount: 1250 },
    { id: '87654321', cell: 'Б23', status: 'waiting', items: 1, amount: 890 },
    { id: '11223344', cell: 'В07', status: 'scanned', items: 2, amount: 2100 },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleScan = () => {
    if (!scanMode) {
      setScanMode(true);
      setScannedCode('');
      speak('Наведите камеру на QR-код заказа');
      
      // Симуляция сканирования через 2 секунды
      setTimeout(() => {
        const waitingOrders = orders.filter(order => order.status === 'waiting');
        if (waitingOrders.length > 0) {
          const order = waitingOrders[0];
          setScannedCode(order.id);
          updateOrderStatus(order.id, 'scanned');
          speak(`Заказ найден. Ячейка ${order.cell}. Товары со скидкой, проверьте ВБ кошелёк.`);
        }
        setScanMode(false);
      }, 2000);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const handleBrought = (orderId: string) => {
    updateOrderStatus(orderId, 'brought');
    speak('Проверьте документы клиента. Проверьте товар под камерой.');
  };

  const handleChecked = (orderId: string) => {
    updateOrderStatus(orderId, 'checked');
    speak('Товар проверен. Ожидается оплата.');
  };

  const handlePaid = (orderId: string) => {
    updateOrderStatus(orderId, 'paid');
    speak('Оплата прошла успешно. Оцените наш пункт выдачи в приложении ВБ.');
    
    setTimeout(() => {
      updateOrderStatus(orderId, 'completed');
      speak('Спасибо за покупку! Хорошего дня!');
    }, 3000);
  };

  const testAudio = () => {
    speak('Тестирование аудио системы. Добро пожаловать в пункт выдачи Wildberries!');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'waiting': return 'bg-gray-100 text-gray-700';
      case 'scanned': return 'bg-blue-100 text-blue-700';
      case 'brought': return 'bg-yellow-100 text-yellow-700';
      case 'checked': return 'bg-orange-100 text-orange-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-green-200 text-green-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'waiting': return 'Ожидает';
      case 'scanned': return 'Отсканирован';
      case 'brought': return 'Принесён';
      case 'checked': return 'Проверен';
      case 'paid': return 'Оплачен';
      case 'completed': return 'Выдан';
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Window Bar */}
      <div className="bg-purple-600 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium">
            ВБ ПВЗ
          </div>
          <span className="text-sm">Система выдачи заказов</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={testAudio}
            className="text-white hover:bg-purple-700 px-2 py-1 rounded text-sm"
          >
            🔊 Тест аудио
          </button>
          <span className="text-sm font-mono">{formatTime(currentTime)}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs">Онлайн</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Scanner */}
        <div className="w-96 bg-gray-50 border-r p-6">
          <h2 className="text-lg font-semibold mb-6">📱 Сканер QR-кодов</h2>
          
          <div className="bg-white rounded-lg p-6 border mb-6">
            <div className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center ${
              scanMode ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}>
              {scanMode ? (
                <div className="text-center">
                  <div className="animate-pulse text-blue-600 text-4xl mb-2">📷</div>
                  <p className="text-blue-600 font-medium">Сканирование...</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📱</div>
                  <p>Область для QR-кода</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleScan}
              disabled={scanMode}
              className={`w-full mt-4 px-4 py-3 rounded-lg font-medium ${
                scanMode 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {scanMode ? 'Сканирование...' : 'Начать сканирование'}
            </button>
          </div>

          {scannedCode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">✅ Заказ найден</h3>
              <p className="text-sm text-green-700">ID: {scannedCode}</p>
            </div>
          )}
        </div>

        {/* Right Panel - Orders */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📦 Активные заказы ({activeOrders.length})</h2>
            <p className="text-gray-600 text-sm">Заказы в процессе выдачи</p>
          </div>

          <div className="space-y-4 mb-8">
            {activeOrders.map((order) => (
              <div key={order.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-mono font-bold text-gray-800">
                      #{order.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Ячейка</div>
                    <div className="text-lg font-bold text-purple-600">{order.cell}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <span>📦 {order.items} товара</span>
                    <span>💰 {order.amount}₽</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {order.status === 'scanned' && (
                    <button
                      onClick={() => handleBrought(order.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                    >
                      📋 Товар принесён
                    </button>
                  )}
                  
                  {order.status === 'brought' && (
                    <button
                      onClick={() => handleChecked(order.id)}
                      className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm font-medium"
                    >
                      ✅ Товар проверен
                    </button>
                  )}
                  
                  {order.status === 'checked' && (
                    <button
                      onClick={() => handlePaid(order.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                    >
                      💳 Оплата получена
                    </button>
                  )}

                  {order.status === 'paid' && (
                    <div className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded text-sm font-medium text-center">
                      ⏳ Завершается...
                    </div>
                  )}
                </div>
              </div>
            ))}

            {activeOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium mb-2">Нет активных заказов</h3>
                <p className="text-sm">Отсканируйте QR-код для добавления заказа</p>
              </div>
            )}
          </div>

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <>
              <hr className="my-8" />
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">✅ Выданные заказы ({completedOrders.length})</h2>
                <p className="text-gray-600 text-sm">Завершённые заказы сегодня</p>
              </div>

              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <div key={order.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono text-gray-700">#{order.id}</span>
                        <span className="text-sm text-gray-600">Ячейка {order.cell}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>📦 {order.items}</span>
                        <span>💰 {order.amount}₽</span>
                        <span className="text-green-600 font-medium">✅ Выдан</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;