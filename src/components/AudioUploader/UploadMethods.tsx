import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface UploadMethodsProps {
  isProcessing: boolean;
  onBulkUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowCloudLoader: () => void;
}

const UploadMethods = ({ isProcessing, onBulkUpload, onShowCloudLoader }: UploadMethodsProps) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Автоматическая загрузка с облака */}
      <div className="p-6 border-2 border-dashed border-green-300 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="Cloud" size={32} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Загрузка с облака</h3>
            <p className="text-sm text-green-600 mt-1">
              Прямая загрузка ВСЕХ файлов с Mail.ru Cloud
            </p>
          </div>
          <Button
            onClick={onShowCloudLoader}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Icon name="CloudDownload" size={16} className="mr-2" />
            Загрузить с облака
          </Button>
          <div className="text-xs text-green-700 max-w-md space-y-1">
            <p>✅ <strong>59 реальных аудиофайлов</strong> с вашего облака</p>
            <p>🎯 <strong>Автоматическое распознавание</strong> по названиям</p>
            <p>⚡ <strong>Прямые ссылки</strong> - без скачивания архива</p>
          </div>
        </div>
      </div>

      {/* Ручная загрузка */}
      <div className="p-6 border-2 border-dashed border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="Upload" size={32} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-800">Ручная загрузка папки</h3>
            <p className="text-sm text-purple-600 mt-1">
              Скачайте файлы с Mail.ru Cloud и выберите здесь
            </p>
          </div>
          <Input
            type="file"
            accept="audio/*"
            multiple
            onChange={onBulkUpload}
            disabled={isProcessing}
            className="max-w-xs"
          />
          <div className="text-xs text-purple-700 max-w-md space-y-1">
            <p>📁 <a href="https://cloud.mail.ru/public/bsFp/vkbT876fD" target="_blank" rel="noopener noreferrer" className="underline font-medium">Скачать архив с Mail.ru Cloud</a></p>
            <p>📥 Распакуйте и выберите все файлы (Ctrl+A)</p>
          </div>
          {isProcessing && (
            <div className="flex items-center gap-2 text-purple-600">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span className="text-sm">Обрабатываю файлы...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadMethods;