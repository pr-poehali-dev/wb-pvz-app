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
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border-4 border-dashed border-primary/30">
            {isScanning ? (
              <div className="animate-pulse">
                <Icon name="Scan" size={40} className="text-primary animate-pulse" />
              </div>
            ) : (
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="QrCode" size={24} className="text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
                </div>
              </div>
            )}
          </div>
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