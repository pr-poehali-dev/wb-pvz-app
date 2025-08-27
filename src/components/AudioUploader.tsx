import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AudioUploaderProps {
  onClose: () => void;
}

const AudioUploader = ({ onClose }: AudioUploaderProps) => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploaded'>>({});

  // Проверяем при загрузке, какие файлы уже есть
  React.useEffect(() => {
    const checkExistingFiles = () => {
      const newStatus: Record<string, 'pending' | 'uploaded'> = {};
      
      // Проверяем основные файлы
      audioFiles.forEach(file => {
        if (localStorage.getItem(`audio_${file.id}`)) {
          newStatus[file.id] = 'uploaded';
        }
      });
      
      // Проверяем файлы ячеек
      cellFiles.forEach(file => {
        const cellNumber = file.id.replace('cell-', '');
        if (localStorage.getItem(`audio_cells_${cellNumber}`)) {
          newStatus[file.id] = 'uploaded';
        }
      });
      
      setUploadStatus(newStatus);
    };
    
    checkExistingFiles();
  }, []);

  const audioFiles = [
    { id: 'discount', name: 'discount.mp3', label: 'Товары со скидкой проверьте ВБ кошелек' },
    { id: 'camera', name: 'camera.mp3', label: 'Проверьте товар под камерой' },
    { id: 'rate', name: 'rate.mp3', label: 'Оцените наш пункт выдачи в приложении' },
  ];

  const cellFiles = Array.from({ length: 50 }, (_, i) => ({
    id: `cell-${i + 1}`,
    name: `${i + 1}.mp3`,
    label: `Ячейка номер ${i + 1}`,
    folder: 'cells'
  }));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileId: string, folder?: string) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      try {
        // Создаём URL для локального воспроизведения
        const audioUrl = URL.createObjectURL(file);
        
        // Определяем ключ для localStorage
        const storageKey = folder ? `audio_${folder}_${fileId.replace(`${folder}-`, '')}` : `audio_${fileId}`;
        
        // Сохраняем файл как base64 в localStorage для постоянного хранения
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          localStorage.setItem(storageKey, base64);
          console.log(`✅ Файл ${file.name} сохранён для ${fileId}`);
          
          // Также сохраняем temporary URL для немедленного использования
          localStorage.setItem(`${storageKey}_url`, audioUrl);
        };
        reader.readAsDataURL(file);
        
        setUploadStatus(prev => ({ ...prev, [fileId]: 'uploaded' }));
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Загрузка аудиофайлов</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              Инструкции по загрузке
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Скачайте файлы с Mail.ru Cloud по ссылке: <a href="https://cloud.mail.ru/public/bsFp/vkbT876fD" target="_blank" rel="noopener noreferrer" className="underline">cloud.mail.ru/public/bsFp/vkbT876fD</a></li>
              <li>Распакуйте архив с аудиофайлами</li>
              <li>Загрузите каждый файл в соответствующее поле ниже</li>
              <li>Поддерживаются форматы: MP3, WAV, OGG</li>
            </ol>
          </div>

          <div className="space-y-6">
            {/* Основные аудиофайлы */}
            <div>
              <h3 className="font-medium mb-3">Основные звуки</h3>
              <div className="space-y-3">
                {audioFiles.map(file => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{file.label}</div>
                      <div className="text-xs text-muted-foreground">{file.name}</div>
                    </div>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, file.id)}
                      className="w-40"
                    />
                    {uploadStatus[file.id] === 'uploaded' && (
                      <Icon name="CheckCircle" className="text-green-500" size={20} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Аудиофайлы ячеек */}
            <div>
              <h3 className="font-medium mb-3">Номера ячеек (1-50)</h3>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {cellFiles.slice(0, 10).map(file => (
                  <div key={file.id} className="flex items-center gap-3 p-2 border rounded text-sm">
                    <div className="flex-1">{file.label}</div>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, file.id, file.folder)}
                      className="w-32 h-8 text-xs"
                    />
                    {uploadStatus[file.id] === 'uploaded' && (
                      <Icon name="CheckCircle" className="text-green-500" size={16} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Показаны первые 10 ячеек. Добавьте файлы для всех нужных ячеек.
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={onClose} className="flex-1">
              Готово
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioUploader;