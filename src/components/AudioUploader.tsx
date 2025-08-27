import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CloudAudioLoader from './CloudAudioLoader';

// Импорт декомпозированных компонентов
import FileStatusGrid from './AudioUploader/FileStatusGrid';
import ProcessedFilesList from './AudioUploader/ProcessedFilesList';
import UnrecognizedFilesList from './AudioUploader/UnrecognizedFilesList';
import UploadInstructions from './AudioUploader/UploadInstructions';
import UploadMethods from './AudioUploader/UploadMethods';
import { useAudioUploader } from './AudioUploader/useAudioUploader';

interface AudioUploaderProps {
  onClose: () => void;
}

const AudioUploader = ({ onClose }: AudioUploaderProps) => {
  const {
    uploadStatus,
    processedFiles,
    unrecognizedFiles,
    isProcessing,
    showCloudLoader,
    setShowCloudLoader,
    handleBulkUpload,
    checkExistingFiles,
    clearAllAudio,
    runDiagnostics,
    updateStatusAfterCloudLoad
  } = useAudioUploader();

  // Проверяем при загрузке, какие файлы уже есть
  useEffect(() => {
    checkExistingFiles();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Умная загрузка аудиофайлов</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Инструкция */}
          <UploadInstructions />

          {/* Способы загрузки */}
          <UploadMethods 
            isProcessing={isProcessing}
            onBulkUpload={handleBulkUpload}
            onShowCloudLoader={() => setShowCloudLoader(true)}
          />

          {/* Результаты обработки */}
          <ProcessedFilesList processedFiles={processedFiles} />

          {/* Не распознанные файлы */}
          <UnrecognizedFilesList unrecognizedFiles={unrecognizedFiles} />

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