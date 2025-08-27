import { useState } from 'react';

export interface ProcessedFile {
  file: File;
  functionType?: string;
  cellNumber?: number;
  status: 'pending' | 'uploaded' | 'failed' | 'skipped';
  displayName?: string;
}

export const useAudioUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploaded'>>({});
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCloudLoader, setShowCloudLoader] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  // Сохранение аудиофайла
  const saveAudioFile = async (file: File, functionType: string, cellNumber?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const base64 = reader.result as string;
          let storageKey: string;
          let displayName: string;
          
          if (functionType === 'cell' && cellNumber) {
            storageKey = `audio_cells_${cellNumber}`;
            displayName = `Ячейка ${cellNumber}`;
          } else {
            storageKey = `audio_${functionType}`;
            switch (functionType) {
              case 'discount':
                displayName = 'Скидки/Кошелёк';
                break;
              case 'camera':
                displayName = 'Проверка под камерой';
                break;
              case 'rate':
                displayName = 'Оценка приложения';
                break;
              default:
                displayName = functionType;
            }
          }
          
          localStorage.setItem(storageKey, base64);
          console.log(`✅ Сохранён: ${file.name} -> ${displayName}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsDataURL(file);
    });
  };

  // Обработка загрузки файлов
  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const audioFilesList = Array.from(files).filter(file => file.type.startsWith('audio/'));
    console.log(`📁 Загружено ${audioFilesList.length} аудиофайлов для прослушивания`);

    setAudioFiles(audioFilesList);
    setCurrentFileIndex(0);
    setProcessedFiles(audioFilesList.map(file => ({ 
      file, 
      status: 'pending' as const 
    })));
    
    if (audioFilesList.length > 0) {
      setShowAudioPlayer(true);
    }
  };

  // Привязка аудио к функции
  const assignAudioToFunction = async (functionType: string, cellNumber?: number) => {
    if (currentFileIndex >= audioFiles.length) return;
    
    const currentFile = audioFiles[currentFileIndex];
    setIsProcessing(true);

    try {
      await saveAudioFile(currentFile, functionType, cellNumber);
      
      // Обновляем статус файла
      setProcessedFiles(prev =>
        prev.map((pf, index) =>
          index === currentFileIndex
            ? { 
                ...pf, 
                status: 'uploaded' as const, 
                functionType, 
                cellNumber,
                displayName: cellNumber ? `Ячейка ${cellNumber}` : getFunctionDisplayName(functionType)
              }
            : pf
        )
      );

      // Обновляем общий статус
      const newStatus = { ...uploadStatus };
      if (functionType === 'cell') {
        // Проверяем есть ли хотя бы одна ячейка
        const hasAnyCells = Object.keys(localStorage).some(key => key.startsWith('audio_cells_'));
        if (hasAnyCells) newStatus['cells_folder'] = 'uploaded';
      } else {
        newStatus[functionType] = 'uploaded';
      }
      setUploadStatus(newStatus);

      // Переходим к следующему файлу
      moveToNextFile();
      
    } catch (error) {
      console.error(`Ошибка загрузки ${currentFile.name}:`, error);
      setProcessedFiles(prev =>
        prev.map((pf, index) =>
          index === currentFileIndex ? { ...pf, status: 'failed' as const } : pf
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Пропустить файл
  const skipCurrentFile = () => {
    setProcessedFiles(prev =>
      prev.map((pf, index) =>
        index === currentFileIndex ? { ...pf, status: 'skipped' as const } : pf
      )
    );
    moveToNextFile();
  };

  // Перейти к следующему файлу
  const moveToNextFile = () => {
    const nextIndex = currentFileIndex + 1;
    if (nextIndex >= audioFiles.length) {
      // Все файлы обработаны
      setShowAudioPlayer(false);
      console.log('🎉 Все аудиофайлы обработаны!');
    } else {
      setCurrentFileIndex(nextIndex);
    }
  };

  // Получить название функции
  const getFunctionDisplayName = (functionType: string): string => {
    switch (functionType) {
      case 'discount': return 'Скидки/Кошелёк';
      case 'camera': return 'Проверка под камерой';
      case 'rate': return 'Оценка приложения';
      default: return functionType;
    }
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
    setAudioFiles([]);
    setCurrentFileIndex(0);
    setShowAudioPlayer(false);
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

  // Получить текущий файл
  const getCurrentFile = (): File | null => {
    return audioFiles[currentFileIndex] || null;
  };

  return {
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
  };
};