import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { audioSystem } from '@/utils/audioSystem';

const AudioTester: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [activeCategory, setActiveCategory] = useState<string>('main');

  const testAudio = async (type: string, label: string, method: string, params?: any[]) => {
    setIsPlaying(type);
    try {
      // @ts-ignore - динамический вызов метода
      if (params) {
        await audioSystem[method](...params);
      } else {
        await audioSystem[method]();
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

  // Группы аудиофайлов для тестирования
  const audioCategories = {
    main: {
      title: 'Основные',
      icon: 'Volume2',
      items: [
        { key: 'discount', label: 'Скидки', method: 'playDiscountAudio' },
        { key: 'camera', label: 'Проверка', method: 'playCheckCameraAudio' },
        { key: 'rate', label: 'Оценка', method: 'playRateUsAudio' },
        { key: 'cell', label: 'Ячейка A15', method: 'playCellAudio', params: ['A15'] }
      ]
    },
    entry: {
      title: 'Вход',
      icon: 'DoorOpen',
      items: [
        { key: 'welcome', label: 'Приветствие', method: 'playWelcomeAudio' },
        { key: 'scanPhone', label: 'Сканер', method: 'playScanPhoneAudio' },
        { key: 'accessGranted', label: 'Доступ', method: 'playAccessGrantedAudio' },
        { key: 'scanError', label: 'Ошибка', method: 'playScanErrorAudio' }
      ]
    },
    cells: {
      title: 'Ячейки',
      icon: 'Archive',
      items: [
        { key: 'findCell', label: 'Найти ячейку', method: 'playFindCellAudio' },
        { key: 'cellOpen', label: 'Открыта', method: 'playCellOpenAudio' },
        { key: 'closeCell', label: 'Закрыть', method: 'playCloseCellAudio' },
        { key: 'timeLimit', label: 'Лимит времени', method: 'playTimeLimitAudio' }
      ]
    },
    fitting: {
      title: 'Примерочная',
      icon: 'Shirt',
      items: [
        { key: 'fittingFree', label: 'Свободна', method: 'playFittingFreeAudio' },
        { key: 'fittingTime', label: '5 минут', method: 'playFittingTimeAudio' },
        { key: 'finishFitting', label: 'Завершить', method: 'playFinishFittingAudio' }
      ]
    },
    returns: {
      title: 'Возвраты',
      icon: 'RotateCcw',
      items: [
        { key: 'returnStaff', label: 'К сотруднику', method: 'playReturnStaffAudio' },
        { key: 'returnAccepted', label: 'Принят', method: 'playReturnAcceptedAudio' },
        { key: 'packReturn', label: 'Упаковать', method: 'playPackReturnAudio' }
      ]
    },
    queue: {
      title: 'Очередь',
      icon: 'Users',
      items: [
        { key: 'waitTurn', label: 'Ожидание', method: 'playWaitTurnAudio' },
        { key: 'nextCustomer', label: 'Следующий', method: 'playNextCustomerAudio' }
      ]
    },
    tech: {
      title: 'Техподдержка',
      icon: 'Settings',
      items: [
        { key: 'techIssues', label: 'Неполадки', method: 'playTechIssuesAudio' },
        { key: 'systemDown', label: 'Недоступна', method: 'playSystemDownAudio' }
      ]
    },
    time: {
      title: 'Время работы',
      icon: 'Clock',
      items: [
        { key: 'closing', label: 'Закрытие', method: 'playClosingAudio' },
        { key: 'tenMinutes', label: '10 минут', method: 'playTenMinutesAudio' }
      ]
    },
    thanks: {
      title: 'Благодарности',
      icon: 'Heart',
      items: [
        { key: 'thankYou', label: 'Спасибо', method: 'playThankYouAudio' },
        { key: 'goodDay', label: 'Хорошего дня', method: 'playGoodDayAudio' }
      ]
    },
    system: {
      title: 'Системные',
      icon: 'Bell',
      items: [
        { key: 'attention', label: 'Внимание', method: 'playAttentionAudio' },
        { key: 'important', label: 'Важное', method: 'playImportantAudio' },
        { key: 'success', label: 'Успех', method: 'playSuccessSound' },
        { key: 'error', label: 'Ошибка', method: 'playErrorSound' },
        { key: 'notification', label: 'Уведомление', method: 'playNotificationSound' }
      ]
    }
  };

  const currentCategory = audioCategories[activeCategory as keyof typeof audioCategories];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Volume2" size={20} />
            Полная система озвучки WB ПВЗ
          </div>
          <Button 
            onClick={toggleAudio}
            size="sm"
            variant={systemStatus.enabled ? "default" : "secondary"}
          >
            {systemStatus.enabled ? "Включено" : "Отключено"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статус системы */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Статус</div>
              <div className={systemStatus.enabled ? "text-green-600" : "text-red-600"}>
                {systemStatus.enabled ? "Активна" : "Отключена"}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Инициализация</div>
              <div className={systemStatus.initialized ? "text-green-600" : "text-orange-600"}>
                {systemStatus.initialized ? "Да" : "Нет"}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">В кеше</div>
              <div className="text-blue-600">{systemStatus.cachedFiles?.length || 0}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Доступно</div>
              <div className="text-green-600">{systemStatus.availableFiles?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Переключатель категорий */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(audioCategories).map(([key, category]) => (
            <Button
              key={key}
              size="sm"
              variant={activeCategory === key ? "default" : "outline"}
              onClick={() => setActiveCategory(key)}
              className="flex items-center gap-1"
            >
              <Icon name={category.icon as any} size={14} />
              {category.title}
            </Button>
          ))}
        </div>

        {/* Кнопки тестирования текущей категории */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <Icon name={currentCategory.icon as any} size={18} />
            {currentCategory.title}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {currentCategory.items.map((item) => (
              <Button
                key={item.key}
                onClick={() => testAudio(item.key, item.label, item.method, item.params)}
                disabled={isPlaying === item.key}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-auto py-2 px-3 text-left justify-start"
              >
                {isPlaying === item.key ? (
                  <Icon name="Loader2" size={14} className="animate-spin flex-shrink-0" />
                ) : (
                  <Icon name="Play" size={14} className="flex-shrink-0" />
                )}
                <span className="text-xs truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Информация о файлах */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded space-y-2">
          <div className="font-medium">💡 О системе озвучки:</div>
          <ul className="space-y-1">
            <li>• Автоматически ищет оригинальные файлы в облаке Mail.ru</li>
            <li>• При отсутствии файла использует синтез речи</li>
            <li>• Кеширует загруженные файлы для быстрого доступа</li>
            <li>• Всего методов озвучки: {systemStatus.totalFiles || 'загружается...'}</li>
          </ul>
          
          {systemStatus.availableFiles?.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-medium text-gray-700">
                📁 Доступные файлы ({systemStatus.availableFiles.length})
              </summary>
              <div className="mt-1 max-h-32 overflow-y-auto text-xs">
                {systemStatus.availableFiles.map((file: string, idx: number) => (
                  <div key={idx} className="truncate">• {file}</div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Кнопка обновления */}
        <Button 
          onClick={updateStatus}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить статус
        </Button>
      </CardContent>
    </Card>
  );
};

export default AudioTester;