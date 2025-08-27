import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { audioSystem } from '@/utils/audioSystem';

const AudioTester: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>({});

  const testAudio = async (type: string, label: string) => {
    setIsPlaying(type);
    try {
      switch (type) {
        case 'cell':
          await audioSystem.playCellAudio('A15'); // Тестовая ячейка
          break;
        case 'discount':
          await audioSystem.playDiscountAudio();
          break;
        case 'camera':
          await audioSystem.playCheckCameraAudio();
          break;
        case 'rate':
          await audioSystem.playRateUsAudio();
          break;
        case 'success':
          await audioSystem.playSuccessSound();
          break;
        case 'error':
          await audioSystem.playErrorSound();
          break;
      }
    } catch (error) {
      console.error(`Ошибка воспроизведения ${label}:`, error);
    } finally {
      setIsPlaying(null);
    }
  };

  const updateStatus = () => {
    setSystemStatus(audioSystem.getStatus());
  };

  const toggleAudio = () => {
    if (audioSystem.isAudioEnabled()) {
      audioSystem.disable();
    } else {
      audioSystem.enable();
    }
    updateStatus();
  };

  React.useEffect(() => {
    updateStatus();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Volume2" size={20} />
          Тестирование озвучки WB ПВЗ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статус системы */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Статус системы:</span>
            <Button 
              onClick={toggleAudio}
              size="sm"
              variant={systemStatus.enabled ? "default" : "secondary"}
            >
              {systemStatus.enabled ? "Включено" : "Отключено"}
            </Button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>🔄 Инициализирована: {systemStatus.initialized ? "Да" : "Нет"}</div>
            <div>📁 Файлов в кеше: {systemStatus.cachedFiles?.length || 0}</div>
            <div>☁️ Облако: {systemStatus.cloudUrl}</div>
          </div>
        </div>

        {/* Кнопки тестирования */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => testAudio('cell', 'Ячейка A15')}
            disabled={isPlaying === 'cell'}
            className="flex items-center gap-2"
          >
            {isPlaying === 'cell' ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="MapPin" size={16} />
            )}
            Ячейка A15
          </Button>

          <Button 
            onClick={() => testAudio('discount', 'Скидки')}
            disabled={isPlaying === 'discount'}
            className="flex items-center gap-2"
          >
            {isPlaying === 'discount' ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Tag" size={16} />
            )}
            Скидки
          </Button>

          <Button 
            onClick={() => testAudio('camera', 'Проверка камерой')}
            disabled={isPlaying === 'camera'}
            className="flex items-center gap-2"
          >
            {isPlaying === 'camera' ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Camera" size={16} />
            )}
            Проверка
          </Button>

          <Button 
            onClick={() => testAudio('rate', 'Оценка ПВЗ')}
            disabled={isPlaying === 'rate'}
            className="flex items-center gap-2"
          >
            {isPlaying === 'rate' ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Star" size={16} />
            )}
            Оценка
          </Button>

          <Button 
            onClick={() => testAudio('success', 'Успех')}
            disabled={isPlaying === 'success'}
            className="flex items-center gap-2"
            variant="outline"
          >
            {isPlaying === 'success' ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="CheckCircle" size={16} />
            )}
            Успех
          </Button>

          <Button 
            onClick={() => testAudio('error', 'Ошибка')}
            disabled={isPlaying === 'error'}
            className="flex items-center gap-2"
            variant="outline"
          >
            {isPlaying === 'error' ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="XCircle" size={16} />
            )}
            Ошибка
          </Button>
        </div>

        {/* Обновление статуса */}
        <Button 
          onClick={updateStatus}
          variant="outline" 
          className="w-full"
        >
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить статус
        </Button>

        {/* Инструкция */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          <div className="font-medium mb-1">💡 Как это работает:</div>
          <ul className="space-y-1">
            <li>• Система пытается загрузить оригинальные файлы из облака Mail.ru</li>
            <li>• Если файл не найден, используется синтез речи</li>
            <li>• Все загруженные файлы кешируются для быстрого доступа</li>
            <li>• Проверьте консоль браузера для детальной информации</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioTester;