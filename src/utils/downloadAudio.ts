// Утилита для автоматического скачивания аудиофайлов с Mail.ru Cloud

// Прямые ссылки на аудиофайлы (если доступны)
const AUDIO_FILES_URLS = {
  discount: 'https://cloud.mail.ru/public/bsFp/vkbT876fD/discount.mp3',
  camera: 'https://cloud.mail.ru/public/bsFp/vkbT876fD/camera.mp3', 
  rate: 'https://cloud.mail.ru/public/bsFp/vkbT876fD/rate.mp3',
  // Ячейки будут загружаться по паттерну
} as const;

export async function downloadAndInstallAudio(
  onProgress?: (loaded: number, total: number) => void,
  onFileComplete?: (fileName: string, type: string) => void
): Promise<{success: number; failed: number; errors: string[]}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  try {
    console.log('🚀 Начинаю автоматическую загрузку аудиофайлов...');
    
    // Загружаем основные файлы
    const basicFiles = Object.entries(AUDIO_FILES_URLS);
    
    for (const [type, url] of basicFiles) {
      try {
        console.log(`📥 Загружаю ${type}...`);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuffer);
        const dataUrl = `data:audio/mpeg;base64,${base64}`;
        
        // Сохраняем в localStorage
        localStorage.setItem(`audio_${type}`, dataUrl);
        
        console.log(`✅ Успешно загружен: ${type}`);
        results.success++;
        onFileComplete?.(type, type);
        
      } catch (error) {
        console.error(`❌ Ошибка загрузки ${type}:`, error);
        results.failed++;
        results.errors.push(`${type}: ${error}`);
      }
    }

    // Пробуем загрузить ячейки (1-20 для примера)
    console.log('📦 Загружаю файлы ячеек...');
    
    for (let i = 1; i <= 20; i++) {
      try {
        const cellUrl = `https://cloud.mail.ru/public/bsFp/vkbT876fD/cells/${i}.mp3`;
        const response = await fetch(cellUrl);
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const base64 = arrayBufferToBase64(arrayBuffer);
          const dataUrl = `data:audio/mpeg;base64,${base64}`;
          
          localStorage.setItem(`audio_cells_${i}`, dataUrl);
          console.log(`✅ Ячейка ${i} загружена`);
          results.success++;
          onFileComplete?.(`${i}.mp3`, 'cell');
        }
      } catch (error) {
        // Тихо игнорируем ошибки ячеек, они могут отсутствовать
        console.log(`⏭️ Ячейка ${i} пропущена`);
      }
      
      // Обновляем прогресс
      onProgress?.(i, 20);
    }

    console.log(`🎉 Автозагрузка завершена! Успешно: ${results.success}, Ошибок: ${results.failed}`);
    
  } catch (error) {
    console.error('💥 Критическая ошибка автозагрузки:', error);
    results.errors.push(`Критическая ошибка: ${error}`);
  }

  return results;
}

// Вспомогательная функция для конвертации ArrayBuffer в Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Проверка доступности файлов
export async function checkAudioFilesAvailability(): Promise<{
  available: string[];
  unavailable: string[];
}> {
  const available: string[] = [];
  const unavailable: string[] = [];

  for (const [type, url] of Object.entries(AUDIO_FILES_URLS)) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        available.push(type);
      } else {
        unavailable.push(type);
      }
    } catch {
      unavailable.push(type);
    }
  }

  return { available, unavailable };
}