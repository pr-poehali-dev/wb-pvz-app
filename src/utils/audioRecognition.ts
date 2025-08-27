// Утилита для автоматического распознавания аудиофайлов по названиям

export interface AudioMapping {
  type: 'discount' | 'camera' | 'rate' | 'cell';
  cellNumber?: number;
}

// Паттерны для распознавания названий файлов
const AUDIO_PATTERNS = [
  // Основные аудиофайлы
  { pattern: /discount|скидк|кошел|товар.*скидк/i, type: 'discount' as const },
  { pattern: /camera|камер|проверь|под.*камер/i, type: 'camera' as const },
  { pattern: /rate|оцен|приложен|пункт.*выдач/i, type: 'rate' as const },
  
  // Ячейки - цифры в начале или конце названия
  { pattern: /^(\d+)\./, type: 'cell' as const, extractNumber: true },
  { pattern: /ячейк.*(\d+)|cell.*(\d+)|(\d+).*ячейк/i, type: 'cell' as const, extractNumber: true },
  { pattern: /(\d+)$/, type: 'cell' as const, extractNumber: true },
] as const;

// Ключевые слова для более точного распознавания
const KEYWORDS = {
  discount: ['скидка', 'скидки', 'кошелёк', 'кошелек', 'товары', 'проверьте', 'вб'],
  camera: ['камера', 'камеру', 'камерой', 'проверьте', 'проверь', 'товар'],
  rate: ['оцените', 'оценка', 'приложение', 'приложении', 'пункт', 'выдачи', 'выдача'],
} as const;

export function recognizeAudioFile(fileName: string): AudioMapping | null {
  const nameWithoutExt = fileName.replace(/\.(mp3|wav|ogg|m4a)$/i, '').toLowerCase();
  
  console.log(`🔍 Распознаю файл: ${fileName} -> ${nameWithoutExt}`);
  
  // Проверяем паттерны
  for (const { pattern, type, extractNumber } of AUDIO_PATTERNS) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      if (type === 'cell' && extractNumber) {
        // Извлекаем номер ячейки
        const cellNumber = parseInt(match[1] || match[2] || match[3] || '0');
        if (cellNumber > 0 && cellNumber <= 999) {
          console.log(`✅ Распознано: ${fileName} -> ячейка ${cellNumber}`);
          return { type: 'cell', cellNumber };
        }
      } else {
        console.log(`✅ Распознано: ${fileName} -> ${type}`);
        return { type };
      }
    }
  }
  
  // Дополнительная проверка по ключевым словам
  for (const [audioType, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(keyword => nameWithoutExt.includes(keyword))) {
      console.log(`✅ Распознано по ключевым словам: ${fileName} -> ${audioType}`);
      return { type: audioType as 'discount' | 'camera' | 'rate' };
    }
  }
  
  console.log(`❌ Не удалось распознать: ${fileName}`);
  return null;
}

// Функция для группировки файлов по типам
export function categorizeAudioFiles(files: File[]): {
  recognized: Array<{ file: File; mapping: AudioMapping }>;
  unrecognized: File[];
} {
  const recognized: Array<{ file: File; mapping: AudioMapping }> = [];
  const unrecognized: File[] = [];
  
  for (const file of files) {
    if (!file.type.startsWith('audio/')) continue;
    
    const mapping = recognizeAudioFile(file.name);
    if (mapping) {
      recognized.push({ file, mapping });
    } else {
      unrecognized.push(file);
    }
  }
  
  return { recognized, unrecognized };
}

// Функция для получения отображаемого имени функции
export function getFunctionDisplayName(type: string, cellNumber?: number): string {
  switch (type) {
    case 'discount':
      return 'Товары со скидкой (ВБ кошелёк)';
    case 'camera':
      return 'Проверьте товар под камерой';
    case 'rate':
      return 'Оцените пункт выдачи';
    case 'cell':
      return `Ячейка номер ${cellNumber}`;
    default:
      return 'Неизвестная функция';
  }
}