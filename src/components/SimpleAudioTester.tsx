import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const SimpleAudioTester: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const testAudio = async (type: string, text: string) => {
    setIsPlaying(type);
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.85;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Ошибка озвучки:', error);
    } finally {
      setTimeout(() => setIsPlaying(null), 2000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Volume2" size={20} />
          Тест озвучки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => testAudio('cell', 'Ячейка А15')}
            disabled={isPlaying === 'cell'}
            size="sm"
            className="flex items-center gap-1"
          >
            {isPlaying === 'cell' ? (
              <Icon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="MapPin" size={14} />
            )}
            Ячейка
          </Button>

          <Button
            onClick={() => testAudio('discount', 'Товары со скидкой, проверьте ВБ кошелек')}
            disabled={isPlaying === 'discount'}
            size="sm"
            className="flex items-center gap-1"
          >
            {isPlaying === 'discount' ? (
              <Icon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="Tag" size={14} />
            )}
            Скидки
          </Button>

          <Button
            onClick={() => testAudio('camera', 'Проверьте товар под камерой')}
            disabled={isPlaying === 'camera'}
            size="sm"
            className="flex items-center gap-1"
          >
            {isPlaying === 'camera' ? (
              <Icon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="Camera" size={14} />
            )}
            Проверка
          </Button>

          <Button
            onClick={() => testAudio('rate', 'Оцените наш пункт выдачи в приложении')}
            disabled={isPlaying === 'rate'}
            size="sm"
            className="flex items-center gap-1"
          >
            {isPlaying === 'rate' ? (
              <Icon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="Star" size={14} />
            )}
            Оценка
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center mt-3">
          🔊 Использует синтез речи браузера
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleAudioTester;