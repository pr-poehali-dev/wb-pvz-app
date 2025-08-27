import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CloudAudioLoader from './CloudAudioLoader';

// Импорт декомпозированных компонентов
import FileStatusGrid from './AudioUploader/FileStatusGrid';
import ProcessedFilesList from './AudioUploader/ProcessedFilesList';
import UploadMethods from './AudioUploader/UploadMethods';
import AudioPlayer from './AudioUploader/AudioPlayer';
import { useAudioUploader } from './AudioUploader/useAudioUploader';

interface AudioUploaderProps {
  onClose: () => void;
}

const AudioUploader = ({ onClose }: AudioUploaderProps) => {
  const {
    uploadStatus,
    processedFiles,
    audioFiles,
    currentFileIndex,
    isProcessing,
    showCloudLoader,
    showAudioPlayer,
    setShowCloudLoader,
    setShowAudioPlayer,
    handleBulkUpload,
    assignAudioToFunction,
    skipCurrentFile,
    getCurrentFile,
    checkExistingFiles,
    clearAllAudio,
    runDiagnostics,
    updateStatusAfterCloudLoad
  } = useAudioUploader();

  // Проверяем при загрузке, какие файлы уже есть
  useEffect(() => {
    checkExistingFiles();
  }, []);

  const currentFile = getCurrentFile();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {showAudioPlayer && currentFile ? (
        // Режим прослушивания аудио
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center text-sm text-gray-600 mb-2">
              Файл {currentFileIndex + 1} из {audioFiles.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${((currentFileIndex) / audioFiles.length) * 100}%` }}
              />
            </div>
          </div>
          
          <AudioPlayer
            file={currentFile}
            onAssign={assignAudioToFunction}
            onSkip={skipCurrentFile}
          />
          
          <Button
            onClick={() => {
              setShowAudioPlayer(false);
              // Сбрасываем состояние
              // setAudioFiles([]);
              // setCurrentFileIndex(0);
            }}
            variant="outline"
            className="mt-4"
          >
            <Icon name="X" size={16} className="mr-2" />
            Отменить загрузку
          </Button>
        </div>
      ) : (
        // Основной интерфейс загрузчика
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Прослушивание и привязка аудиофайлов</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Новая инструкция для прослушивания */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Icon name="Headphones" size={16} className="text-blue-600" />
                Прослушивание и привязка аудиофайлов
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>🎧 <strong>Загрузите аудиофайлы</strong> - система предложит прослушать каждый и выбрать функцию!</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="font-medium">Доступные функции:</p>
                    <ul className="text-xs space-y-1 mt-1">
                      <li>• <strong>Скидки/Кошелёк</strong> - уведомления о скидках</li>
                      <li>• <strong>Камера</strong> - проверка товара под камерой</li>
                      <li>• <strong>Оценка</strong> - просьба оценить приложение</li>
                      <li>• <strong>Ячейки</strong> - озвучка номеров ячеек (1-999)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Как это работает:</p>
                    <ul className="text-xs space-y-1 mt-1">
                      <li>• Прослушайте аудиофайл</li>
                      <li>• Выберите подходящую функцию</li>
                      <li>• Для ячеек укажите номер</li>
                      <li>• Переходите к следующему файлу</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Способы загрузки */}
            <UploadMethods 
              isProcessing={isProcessing}
              onBulkUpload={handleBulkUpload}
              onShowCloudLoader={() => setShowCloudLoader(true)}
            />

            {/* Результаты обработки */}
            <ProcessedFilesList processedFiles={processedFiles} />

            {/* Статус загруженных файлов */}
            <FileStatusGrid uploadStatus={uploadStatus} />

            {/* Кнопки действий */}
            <div className="flex gap-2 mt-6">
              <Button onClick={onClose} className="flex-1">
                <Icon name="Check" size={16} className="mr-2" />
                Готово
              </Button>
              <Button 
                variant="outline" 
                onClick={runDiagnostics}
              >
                <Icon name="Bug" size={16} className="mr-2" />
                Диагностика
              </Button>
              <Button 
                variant="outline" 
                onClick={clearAllAudio}
                className="text-red-600 hover:text-red-700"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Очистить всё
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CloudAudioLoader Modal */}
      {showCloudLoader && (
        <CloudAudioLoader 
          onClose={() => setShowCloudLoader(false)}
          onLoadComplete={updateStatusAfterCloudLoad}
        />
      )}
    </div>
  );
};

export default AudioUploader;