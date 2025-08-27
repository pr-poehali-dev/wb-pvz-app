import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { loadAllAudioFiles, isAudioLoaded, clearAllAudio, CLOUD_AUDIO_FILES } from '@/utils/audioLoader';

interface CloudAudioLoaderProps {
  onClose: () => void;
  onLoadComplete?: () => void;
}

const CloudAudioLoader = ({ onClose, onLoadComplete }: CloudAudioLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [loadResult, setLoadResult] = useState<{ successful: number; failed: number } | null>(null);
  const [audioAlreadyLoaded, setAudioAlreadyLoaded] = useState(false);

  useEffect(() => {
    // Проверяем, загружены ли уже файлы
    setAudioAlreadyLoaded(isAudioLoaded());
  }, []);

  const handleLoadAudio = async () => {
    setIsLoading(true);
    setProgress(0);
    setLoadResult(null);
    
    try {
      await loadAllAudioFiles(
        // onProgress callback
        (current, total, fileName) => {
          const progressPercent = Math.round((current / total) * 100);
          setProgress(progressPercent);
          setCurrentFile(fileName);
          console.log(`📥 Загрузка: ${current}/${total} - ${fileName}`);
        },
        // onComplete callback
        (successful, failed) => {
          setLoadResult({ successful, failed });
          setAudioAlreadyLoaded(true);
          console.log(`🏁 Загрузка завершена: ${successful} успешно, ${failed} ошибок`);
          
          if (successful > 0) {
            onLoadComplete?.();
            
            // Показываем уведомление об успехе
            const notification = document.createElement('div');
            notification.innerHTML = `
              <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #059669; color: white; padding: 16px 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999; font-family: system-ui; font-size: 14px; max-width: 400px; text-align: center;">
                <div style="font-weight: 600; margin-bottom: 8px;">🎉 Аудиофайлы загружены!</div>
                <div>Загружено ${successful} из ${successful + failed} файлов</div>
              </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 4000);
          }
        }
      );
    } catch (error) {
      console.error('❌ Критическая ошибка загрузки:', error);
    } finally {
      setIsLoading(false);
      setCurrentFile('');
    }
  };

  const handleClearAudio = () => {
    clearAllAudio();
    setAudioAlreadyLoaded(false);
    setLoadResult(null);
    console.log('🗑️ Все аудиофайлы удалены');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Cloud" size={20} />
            Загрузка аудио с облака
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Информация о файлах */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Icon name="FileAudio" size={16} />
              Источник: Mail.ru Cloud
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📁 Папка: https://cloud.mail.ru/public/vmnn/73ri9QfHz</p>
              <p>📊 Всего файлов: {CLOUD_AUDIO_FILES.length}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• Ячейки: 50 файлов (1.mp3 - 50.mp3)</div>
                <div>• Скидки: 3 файла (discount, koshel, skidka)</div>
                <div>• Камера: 3 файла (camera, prover, tovar)</div>
                <div>• Оценка: 3 файла (rate, ocenka, prilog)</div>
              </div>
            </div>
          </div>

          {/* Статус загрузки */}
          <div className={`p-4 rounded-lg ${audioAlreadyLoaded ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center gap-3">
              {audioAlreadyLoaded ? (
                <Icon name="CheckCircle" size={20} className="text-green-600" />
              ) : (
                <Icon name="Download" size={20} className="text-blue-600" />
              )}
              <div>
                <div className="font-medium text-sm">
                  {audioAlreadyLoaded ? 'Аудиофайлы загружены' : 'Готов к загрузке'}
                </div>
                <div className="text-xs text-gray-600">
                  {audioAlreadyLoaded 
                    ? 'Все файлы успешно сохранены и готовы к использованию' 
                    : 'Нажмите кнопку ниже для загрузки всех аудиофайлов'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Прогресс загрузки */}
          {isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Прогресс загрузки</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {currentFile && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon name="Loader2" size={12} className="animate-spin" />
                  <span>Загружаю: {currentFile}</span>
                </div>
              )}
            </div>
          )}

          {/* Результат загрузки */}
          {loadResult && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span>Успешно загружено:</span>
                  <span className="font-medium text-green-600">{loadResult.successful}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ошибок:</span>
                  <span className="font-medium text-red-600">{loadResult.failed}</span>
                </div>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <Button
              onClick={handleLoadAudio}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Загружаю...
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} className="mr-2" />
                  {audioAlreadyLoaded ? 'Перезагрузить' : 'Загрузить все'}
                </>
              )}
            </Button>
            
            {audioAlreadyLoaded && (
              <Button
                variant="outline"
                onClick={handleClearAudio}
                className="flex-none"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Очистить
              </Button>
            )}
          </div>

          {/* Инструкции */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} className="text-amber-600" />
              Как это работает
            </h3>
            <div className="text-sm text-amber-800 space-y-2">
              <p>1. <strong>Автоматическое сопоставление:</strong> каждый файл привязывается к функции по названию</p>
              <p>2. <strong>Кэширование:</strong> файлы сохраняются в браузере для мгновенного доступа</p>
              <p>3. <strong>Резерв:</strong> если основной файл недоступен, используются альтернативы</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudAudioLoader;