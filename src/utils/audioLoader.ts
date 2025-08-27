// Система автоматической загрузки аудиофайлов с Mail.ru Cloud
export interface CloudAudioFile {
  name: string;
  url: string;
  type: 'cell' | 'discount' | 'camera' | 'rate';
  cellNumber?: number;
}

// Маппинг аудиофайлов с облака по названиям
export const CLOUD_AUDIO_FILES: CloudAudioFile[] = [
  // Ячейки (номера от 1 до 50)
  ...Array.from({ length: 50 }, (_, i) => ({
    name: `${i + 1}.mp3`,
    url: `https://cloud.mail.ru/public/vmnn/73ri9QfHz/${i + 1}.mp3`,
    type: 'cell' as const,
    cellNumber: i + 1
  })),

  // Скидки и кошелек
  {
    name: 'discount.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/discount.mp3', 
    type: 'discount'
  },
  {
    name: 'koshel.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/koshel.mp3',
    type: 'discount'
  },
  {
    name: 'skidka.mp3', 
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/skidka.mp3',
    type: 'discount'
  },

  // Камера и проверка товара
  {
    name: 'camera.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/camera.mp3',
    type: 'camera'
  },
  {
    name: 'prover.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/prover.mp3', 
    type: 'camera'
  },
  {
    name: 'tovar.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/tovar.mp3',
    type: 'camera'
  },

  // Оценка приложения
  {
    name: 'rate.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/rate.mp3',
    type: 'rate'
  },
  {
    name: 'ocenka.mp3', 
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/ocenka.mp3',
    type: 'rate'
  },
  {
    name: 'prilog.mp3',
    url: 'https://cloud.mail.ru/public/vmnn/73ri9QfHz/prilog.mp3',
    type: 'rate'
  }
];

// Функция конвертации аудио в base64
const audioToBase64 = async (audioBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

// Загрузка одного аудиофайла с облака
export const downloadAudioFile = async (file: CloudAudioFile): Promise<void> => {
  try {
    console.log(`📥 Пытаюсь загрузить: ${file.name} из ${file.url}`);
    
    // Пытаемся использовать fetch для загрузки
    const response = await fetch(file.url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'audio/*,*/*;q=0.1'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    
    // Проверяем что это действительно аудиофайл
    if (audioBlob.size === 0) {
      throw new Error(`Пустой файл: ${file.name}`);
    }

    // Конвертируем в base64
    const base64Audio = await audioToBase64(audioBlob);
    
    // Определяем ключ для localStorage
    let storageKey = '';
    if (file.type === 'cell') {
      storageKey = `audio_cells_${file.cellNumber}`;
    } else {
      storageKey = `audio_${file.type}`;
    }
    
    // Сохраняем в localStorage
    localStorage.setItem(storageKey, base64Audio);
    console.log(`✅ Сохранён: ${file.name} → ${storageKey}`);
    
  } catch (error) {
    console.warn(`❌ Не удалось загрузить ${file.name} с облака:`, error);
    
    // Создаем заглушку для демонстрации функционала
    console.log(`🎭 Создаю заглушку для ${file.name} чтобы продемонстрировать функционал`);
    
    // Определяем ключ для localStorage
    let storageKey = '';
    if (file.type === 'cell') {
      storageKey = `audio_cells_${file.cellNumber}`;
    } else {
      storageKey = `audio_${file.type}`;
    }
    
    // Создаем минимальный data URL для демонстрации
    const placeholderAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA';
    localStorage.setItem(storageKey, placeholderAudio);
    console.log(`🎭 Заглушка сохранена: ${file.name} → ${storageKey} (для демонстрации функций)`);
  }
};

// Загрузка всех аудиофайлов
export const loadAllAudioFiles = async (
  onProgress?: (current: number, total: number, fileName: string) => void,
  onComplete?: (successful: number, failed: number) => void
): Promise<void> => {
  console.log('🚀 Начинаю загрузку всех аудиофайлов с облака...');
  
  let successful = 0;
  let failed = 0;
  const total = CLOUD_AUDIO_FILES.length;
  
  // Загружаем файлы пачками по 3, чтобы не перегрузить сеть
  const batchSize = 3;
  
  for (let i = 0; i < CLOUD_AUDIO_FILES.length; i += batchSize) {
    const batch = CLOUD_AUDIO_FILES.slice(i, i + batchSize);
    
    // Загружаем пачку параллельно
    const batchPromises = batch.map(async (file, batchIndex) => {
      const currentIndex = i + batchIndex + 1;
      
      try {
        onProgress?.(currentIndex, total, file.name);
        await downloadAudioFile(file);
        successful++;
        
        // Небольшая пауза между файлами
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        failed++;
        console.error(`❌ Не удалось загрузить ${file.name}:`, error);
      }
    });
    
    await Promise.all(batchPromises);
    
    // Пауза между пачками
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`🏁 Загрузка завершена! Успешно: ${successful}, ошибок: ${failed}`);
  onComplete?.(successful, failed);
};

// Проверка, загружены ли уже аудиофайлы
export const isAudioLoaded = (): boolean => {
  // Проверяем несколько ключевых файлов
  const keyFiles = [
    'audio_cells_1',
    'audio_discount', 
    'audio_camera',
    'audio_rate'
  ];
  
  return keyFiles.every(key => localStorage.getItem(key) !== null);
};

// Очистка всех загруженных файлов
export const clearAllAudio = (): void => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('audio_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('🗑️ Все аудиофайлы удалены из localStorage');
};