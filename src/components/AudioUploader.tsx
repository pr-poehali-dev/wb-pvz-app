import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { categorizeAudioFiles, getFunctionDisplayName, type AudioMapping } from '@/utils/audioRecognition';

interface AudioUploaderProps {
  onClose: () => void;
}

interface ProcessedFile {
  file: File;
  mapping: AudioMapping;
  status: 'pending' | 'uploaded' | 'failed';
  displayName: string;
}

const AudioUploader = ({ onClose }: AudioUploaderProps) => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploaded'>>({});
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [unrecognizedFiles, setUnrecognizedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Проверяем при загрузке, какие файлы уже есть
  React.useEffect(() => {
    const checkExistingFiles = () => {
      const newStatus: Record<string, 'pending' | 'uploaded'> = {};
      
      // Проверяем основные файлы
      const basicFiles = ['discount', 'camera', 'rate'];
      basicFiles.forEach(fileType => {
        if (localStorage.getItem(`audio_${fileType}`)) {
          newStatus[fileType] = 'uploaded';
        }
      });
      
      // Проверяем файлы ячеек
      let cellsCount = 0;
      for (let i = 1; i <= 100; i++) {
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

  // Автоматическая загрузка всей папки с аудио
  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    console.log(`📁 Начинается автоматическая обработка ${files.length} файлов`);

    const { recognized, unrecognized } = categorizeAudioFiles(Array.from(files));
    
    // Подготавливаем обработанные файлы
    const processed: ProcessedFile[] = recognized.map(({ file, mapping }) => ({
      file,
      mapping,
      status: 'pending' as const,
      displayName: getFunctionDisplayName(
        mapping.type,
        mapping.cellNumber
      )
    }));

    setProcessedFiles(processed);
    setUnrecognizedFiles(unrecognized);

    console.log(`✅ Распознано: ${recognized.length} файлов`);
    console.log(`❓ Не распознано: ${unrecognized.length} файлов`);

    // Загружаем распознанные файлы
    let uploadedCount = 0;
    for (const processedFile of processed) {
      try {
        await saveAudioFile(processedFile);
        uploadedCount++;
        
        // Обновляем статус файла
        setProcessedFiles(prev => 
          prev.map(pf => 
            pf.file === processedFile.file 
              ? { ...pf, status: 'uploaded' }
              : pf
          )
        );
      } catch (error) {
        console.error(`Ошибка загрузки ${processedFile.file.name}:`, error);
        setProcessedFiles(prev => 
          prev.map(pf => 
            pf.file === processedFile.file 
              ? { ...pf, status: 'failed' }
              : pf
          )
        );
      }
    }

    // Обновляем общий статус
    const newStatus = { ...uploadStatus };
    if (recognized.some(r => r.mapping.type === 'discount')) newStatus['discount'] = 'uploaded';
    if (recognized.some(r => r.mapping.type === 'camera')) newStatus['camera'] = 'uploaded';
    if (recognized.some(r => r.mapping.type === 'rate')) newStatus['rate'] = 'uploaded';
    
    const cellFiles = recognized.filter(r => r.mapping.type === 'cell');
    if (cellFiles.length > 0) newStatus['cells_folder'] = 'uploaded';
    
    setUploadStatus(newStatus);
    setIsProcessing(false);
    
    console.log(`🎉 Автозагрузка завершена! Загружено: ${uploadedCount}/${processed.length}`);
  };

  // Сохранение аудиофайла
  const saveAudioFile = async (processedFile: ProcessedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const base64 = reader.result as string;
          let storageKey: string;
          
          if (processedFile.mapping.type === 'cell') {
            storageKey = `audio_cells_${processedFile.mapping.cellNumber}`;
          } else {
            storageKey = `audio_${processedFile.mapping.type}`;
          }
          
          localStorage.setItem(storageKey, base64);
          console.log(`✅ Сохранён: ${processedFile.file.name} -> ${storageKey}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsDataURL(processedFile.file);
    });
  };

  // Очистка всех аудиофайлов
  const clearAllAudio = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('audio_')) {
        localStorage.removeItem(key);
      }
    });
    setUploadStatus({});
    setProcessedFiles([]);
    setUnrecognizedFiles([]);
    console.log('🗑️ Все аудиофайлы удалены');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <Icon name="CheckCircle" className="text-green-500" size={16} />;
      case 'failed': return <Icon name="XCircle" className="text-red-500" size={16} />;
      default: return <Icon name="Clock" className="text-yellow-500" size={16} />;
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Icon name="Percent" className="text-purple-500" size={16} />;
      case 'camera': return <Icon name="Camera" className="text-blue-500" size={16} />;
      case 'rate': return <Icon name="Star" className="text-yellow-500" size={16} />;
      case 'cell': return <Icon name="Package" className="text-green-500" size={16} />;
      default: return <Icon name="Music" className="text-gray-500" size={16} />;
    }
  };

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
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Icon name="Lightbulb" size={16} className="text-blue-600" />
              Автоматическое распознавание файлов
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>🎯 <strong>Загрузите всю папку сразу</strong> - система автоматически распознает каждый файл по названию!</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="font-medium">Примеры названий:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    <li>• <code>discount.mp3</code> → Скидки</li>
                    <li>• <code>camera.mp3</code> → Проверка под камерой</li>
                    <li>• <code>1.mp3, 2.mp3...</code> → Ячейки</li>
                    <li>• <code>ячейка15.mp3</code> → Ячейка 15</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Ключевые слова:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    <li>• скидка, кошелёк, товары</li>
                    <li>• камера, проверьте, товар</li>
                    <li>• оцените, приложение, выдача</li>
                    <li>• любые цифры (для ячеек)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Основная кнопка загрузки */}
          <div className="mb-6">
            <div className="p-6 border-2 border-dashed border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon name="Upload" size={32} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">Загрузить папку с аудио</h3>
                  <p className="text-sm text-purple-600 mt-1">
                    Выберите все файлы из папки - система сама всё распознает!
                  </p>
                </div>
                <Input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={handleBulkUpload}
                  disabled={isProcessing}
                  className="max-w-xs"
                />
                {isProcessing && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="text-sm">Обрабатываю файлы...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Результаты обработки */}
          {processedFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Icon name="CheckCircle2" size={16} className="text-green-600" />
                Распознанные файлы ({processedFiles.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {processedFiles.map((pf, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    {getFileTypeIcon(pf.mapping.type)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{pf.displayName}</div>
                      <div className="text-xs text-gray-500">{pf.file.name}</div>
                    </div>
                    {getStatusIcon(pf.status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Не распознанные файлы */}
          {unrecognizedFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
                Не распознанные файлы ({unrecognizedFiles.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {unrecognizedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <Icon name="Music" className="text-yellow-600" size={16} />
                    <span className="flex-1">{file.name}</span>
                    <span className="text-xs text-yellow-600">Переименуйте файл</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                💡 Переименуйте файлы согласно примерам выше и загрузите снова
              </p>
            </div>
          )}

          {/* Статус загруженных файлов */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Текущий статус</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'discount', label: 'Скидки', icon: 'Percent' },
                { key: 'camera', label: 'Камера', icon: 'Camera' },
                { key: 'rate', label: 'Оценка', icon: 'Star' },
                { key: 'cells_folder', label: 'Ячейки', icon: 'Package' }
              ].map(({ key, label, icon }) => (
                <div key={key} className={`p-3 rounded-lg border text-center ${
                  uploadStatus[key] === 'uploaded' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  <Icon name={icon as any} size={20} className="mx-auto mb-1" />
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs">
                    {uploadStatus[key] === 'uploaded' ? '✅ Загружено' : '⏳ Нет файла'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2 mt-6">
            <Button onClick={onClose} className="flex-1">
              <Icon name="Check" size={16} className="mr-2" />
              Готово
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('=== ДИАГНОСТИКА АУДИОФАЙЛОВ ===');
                const audioKeys = Object.keys(localStorage).filter(key => key.startsWith('audio_'));
                console.log(`Всего файлов: ${audioKeys.length}`);
                audioKeys.forEach(key => {
                  const value = localStorage.getItem(key);
                  console.log(`📁 ${key}: ${value ? `${(value.length / 1024).toFixed(1)}KB` : 'null'}`);
                });
                console.log('=== КОНЕЦ ДИАГНОСТИКИ ===');
              }}
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
    </div>
  );
};

export default AudioUploader;