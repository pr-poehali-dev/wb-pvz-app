import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface QRScannerProps {
  phoneNumber: string;
  isScanning: boolean;
  onPhoneNumberChange: (value: string) => void;
  onQRScan: () => void;
  onPhoneSubmit: () => void;
}

const QRScanner = ({ 
  phoneNumber, 
  isScanning, 
  onPhoneNumberChange, 
  onQRScan, 
  onPhoneSubmit 
}: QRScannerProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8 text-center">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
          Отсканируйте QR-код клиента или курьера
        </h2>
        
        <div className="relative mb-8">
          {isScanning ? (
            <div className="w-40 h-40 mx-auto relative">
              <img 
                src="https://cdn.poehali.dev/files/b7ad8c94-8898-490e-9188-8c8df30b8fcd.png" 
                alt="QR Scanner" 
                className="w-full h-full object-contain animate-pulse"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <img 
              src="https://cdn.poehali.dev/files/b7ad8c94-8898-490e-9188-8c8df30b8fcd.png" 
              alt="QR Scanner" 
              className="w-40 h-40 mx-auto object-contain cursor-pointer hover:scale-105 transition-transform"
              onClick={onQRScan}
            />
          )}
        </div>

        <Button 
          onClick={onQRScan}
          disabled={isScanning}
          className="w-full mb-6 bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:scale-105"
          size="lg"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              Сканирование...
            </div>
          ) : (
            'Начать сканирование'
          )}
        </Button>

        <div className="text-muted-foreground text-sm mb-4">или</div>

        {/* Phone Input */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">
            Введите номер телефона клиента
          </h3>
          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder="Последние 4 цифры номера"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                onPhoneNumberChange(value);
              }}
              maxLength={4}
              className="text-center text-lg font-mono tracking-widest"
            />
            <Button 
              onClick={onPhoneSubmit}
              disabled={phoneNumber.length !== 4}
              className="bg-primary hover:bg-primary/90 text-white transition-all duration-300"
            >
              <Icon name="Search" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;