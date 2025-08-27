import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const WBPickupApp = () => {
  const [activeOrder, setActiveOrder] = useState('');
  const [qrInput, setQrInput] = useState('');

  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleQRScan = (qrCode: string) => {
    setActiveOrder(qrCode);
    playSound(`Заказ ${qrCode} найден. Ячейка А15`);
  };

  const quickMessages = [
    { id: 'welcome', text: 'Добро пожаловать в пункт выдачи', icon: 'UserCheck', color: 'bg-blue-500' },
    { id: 'cell', text: 'Ячейка А15', icon: 'Package', color: 'bg-green-500' },
    { id: 'discount', text: 'Товары со скидкой, проверьте ВБ кошелек', icon: 'Percent', color: 'bg-purple-500' },
    { id: 'check', text: 'Проверьте товар под камерой', icon: 'Camera', color: 'bg-orange-500' },
    { id: 'rate', text: 'Оцените наш пункт выдачи в приложении', icon: 'Star', color: 'bg-red-500' },
    { id: 'goodbye', text: 'Спасибо за покупку, хорошего дня', icon: 'Heart', color: 'bg-cyan-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <Icon name="Package" size={32} className="text-blue-600" />
              WB ПВЗ - Система озвучки
            </CardTitle>
            <Badge variant="secondary" className="mx-auto bg-green-100 text-green-800">
              <Icon name="CheckCircle" size={16} className="mr-1" />
              Система работает
            </Badge>
          </CardHeader>
        </Card>

        {/* QR Scanner Section */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="QrCode" size={24} />
              QR-код сканер
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Введите или отсканируйте QR-код"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => handleQRScan(qrInput)}
                disabled={!qrInput}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Icon name="Search" size={16} className="mr-2" />
                Найти
              </Button>
            </div>
            
            {activeOrder && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <Icon name="CheckCircle" size={20} />
                  <span className="font-medium">Заказ найден: {activeOrder}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Ячейка: А15</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Messages */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Volume2" size={24} />
              Быстрые сообщения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickMessages.map((message) => (
                <Button
                  key={message.id}
                  onClick={() => playSound(message.text)}
                  className={`${message.color} hover:opacity-90 text-white p-4 h-auto flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105`}
                >
                  <Icon name={message.icon as any} size={24} />
                  <span className="text-sm font-medium text-center leading-tight">
                    {message.text}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Icon name="Mic" size={18} />
              <span className="text-sm">Нажмите любую кнопку для тестирования озвучки</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WBPickupApp;