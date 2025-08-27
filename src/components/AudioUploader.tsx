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
      
      // Проверяем файлы ячеек (проверяем несколько для определения статуса папки)
      let cellsCount = 0;
      for (let i = 1; i <= 50; i++) {
        if (localStorage.getItem(`audio_cells_${i}`)) {
          cellsCount++;
        }
      }
      
      if (cellsCount > 0) {
        newStatus['cells_folder'] = 'uploaded';
        console.log(`📁 Найдено ${cellsCount} файлов ячеек`);
      }
      
      setUploadStatus(newStatus);
    };
    
    checkExistingFiles();
  }, []);

  const audioFiles = [
    { id: 'discount', name: 'discount.mp3', label: 'Товары со скидкой проверьте ВБ кошелек' },
    { id: 'camera', name: 'camera.mp3', label: 'Проверьте товар под камерой' },
    { id: 'rate', name: 'rate.mp3', label: 'Оцените наш пункт выдачи в приложении' },
  ];

  const handleCellsFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    console.log(`📁 Начинается загрузка ${files.length} файлов ячеек`);
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    let processedCount = 0;

    for (const file of audioFiles) {
      try {
        const fileName = file.name.replace(/\.(mp3|wav|ogg)$/i, '');
        const cellNumber = fileName;
        
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const storageKey = `audio_cells_${cellNumber}`;
          localStorage.setItem(storageKey, base64);
          console.log(`✅ Ячейка ${cellNumber} сохранена (${file.name})`);
          
          processedCount++;
          if (processedCount === audioFiles.length) {
            setUploadStatus(prev => ({ ...prev, 'cells_folder': 'uploaded' }));
            console.log(`🎉 Папка ячеек загружена! Обработано файлов: ${processedCount}`);
          }
        };
        reader.onerror = () => {
          console.error(`❌ Ошибка чтения файла ${file.name}`);
          processedCount++;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(`Ошибка обработки файла ${file.name}:`, error);
        processedCount++;
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileId: string, folder?: string) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      try {
        // Создаём URL для локального воспроизведения
        const audioUrl = URL.createObjectURL(file);
        
        // Определяем ключ для localStorage
        let storageKey;
        if (folder === 'cells') {
          const cellNumber = fileId.replace('cell-', '');
          storageKey = `audio_cells_${cellNumber}`;
        } else {
          storageKey = `audio_${fileId}`;
        }
        
        // Сохраняем файл как base64 в localStorage для постоянного хранения
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          localStorage.setItem(storageKey, base64);
          console.log(`✅ Файл ${file.name} сохранён с ключом: ${storageKey}`);
          
          // Также сохраняем temporary URL для немедленного использования
          localStorage.setItem(`${storageKey}_url`, audioUrl);
          
          // Проверяем что сохранилось
          const saved = localStorage.getItem(storageKey);
          console.log(`🔍 Проверка сохранения: ${saved ? 'УСПЕШНО' : 'ОШИБКА'}`);
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

            {/* Аудиофайлы ячеек - загрузка папкой */}
            <div>
              <h3 className="font-medium mb-3">Номера ячеек (загрузка папки)</h3>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="text-center">
                  <Icon name="FolderOpen" size={32} className="text-gray-400 mx-auto mb-2" />
                  <div className="mb-3">
                    <div className="font-medium text-sm">Загрузите папку с файлами ячеек</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Выберите все MP3-файлы из папки cells/ сразу
                    </div>
                  </div>
                  <Input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleCellsFolderUpload}
                    className="w-full mb-2"
                  />
                  {uploadStatus['cells_folder'] === 'uploaded' && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                      <Icon name="CheckCircle" size={16} />
                      Папка ячеек загружена успешно
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                💡 Совет: Выберите все файлы из папки cells одновременно (Ctrl+A в проводнике)
                <br />
                Названия файлов должны соответствовать номерам ячеек: 1.mp3, 2.mp3, 3.mp3 и т.д.
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={onClose} className="flex-1">
              Готово
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('=== ПРОВЕРКА СОХРАНЁННЫХ ФАЙЛОВ ===');
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('audio_')) {
                    console.log(`📁 ${key}: ${localStorage.getItem(key)?.slice(0, 50)}...`);
                  }
                });
                console.log('=== КОНЕЦ ПРОВЕРКИ ===');
              }}
            >
              Проверить файлы
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