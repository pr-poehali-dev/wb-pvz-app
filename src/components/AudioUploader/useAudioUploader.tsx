import { useState } from 'react';
import { categorizeAudioFiles, getFunctionDisplayName, type AudioMapping } from '@/utils/audioRecognition';

export interface ProcessedFile {
  file: File;
  mapping: AudioMapping;
  status: 'pending' | 'uploaded' | 'failed';
  displayName: string;
}

export const useAudioUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploaded'>>({});
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [unrecognizedFiles, setUnrecognizedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCloudLoader, setShowCloudLoader] = useState(false);

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

  // Проверяем при загрузке, какие файлы уже есть
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

  // Диагностика аудиофайлов
  const runDiagnostics = () => {
    console.log('=== ДИАГНОСТИКА АУДИОФАЙЛОВ ===');
    const audioKeys = Object.keys(localStorage).filter(key => key.startsWith('audio_'));
    console.log(`Всего файлов: ${audioKeys.length}`);
    audioKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`📁 ${key}: ${value ? `${(value.length / 1024).toFixed(1)}KB` : 'null'}`);
    });
    console.log('=== КОНЕЦ ДИАГНОСТИКИ ===');
  };

  // Обновление статусов после загрузки с облака
  const updateStatusAfterCloudLoad = () => {
    const newStatus: Record<string, 'pending' | 'uploaded'> = {};
    ['discount', 'camera', 'rate'].forEach(type => {
      if (localStorage.getItem(`audio_${type}`)) {
        newStatus[type] = 'uploaded';
      }
    });
    if (localStorage.getItem('audio_cells_1')) {
      newStatus['cells_folder'] = 'uploaded';
    }
    setUploadStatus(newStatus);
  };

  return {
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
  };
};