// Система озвучки для WB ПВЗ с оригинальными файлами из облака Mail.ru
export class WBAudioSystem {
  private mailRuPublicUrl = 'https://cloud.mail.ru/public/WMiM/n1UTJ5fwe';
  private audioCache = new Map<string, HTMLAudioElement>();
  private isEnabled = true;
  private isInitialized = false;

  // Получение прямых ссылок на файлы из Mail.ru Cloud API
  private async getDirectFileUrl(filename: string): Promise<string> {
    try {
      // Формируем URL для получения прямой ссылки на файл
      const apiUrl = `https://cloud.mail.ru/api/v2/file/download?public_key=WMiM%2Fn1UTJ5fwe&filename=${encodeURIComponent(filename)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        return data.url || `${this.mailRuPublicUrl}/${filename}`;
      }
      
      // Fallback на публичную ссылку
      return `${this.mailRuPublicUrl}/${filename}`;
    } catch (error) {
      console.warn(`Не удалось получить прямую ссылку для ${filename}:`, error);
      return `${this.mailRuPublicUrl}/${filename}`;
    }
  }

  // Инициализация и предзагрузка критических аудиофайлов
  async initialize() {
    if (this.isInitialized) return;

    console.log('🎵 Инициализация системы озвучки WB ПВЗ...');
    
    const criticalFiles = [
      'Товары со скидкой проверьте ВБ кошелек.mp3',
      'Проверьте товар под камерой.mp3', 
      'Оцените наш пункт выдачи в приложении.mp3'
    ];

    for (const filename of criticalFiles) {
      try {
        const directUrl = await this.getDirectFileUrl(filename);
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.crossOrigin = 'anonymous';
        audio.src = directUrl;
        
        this.audioCache.set(filename, audio);
        console.log(`✅ Загружен: ${filename}`);
      } catch (error) {
        console.warn(`⚠️ Не удалось предзагрузить: ${filename}`, error);
      }
    }

    this.isInitialized = true;
    console.log('✅ Система озвучки инициализирована');
  }

  // Воспроизведение озвучки ячейки (из папки Ячейки)
  async playCellAudio(cellNumber?: string): Promise<void> {
    if (!this.isEnabled) return;
    
    await this.initialize();
    
    try {
      const cell = cellNumber || this.getRandomCell();
      console.log(`🔊 Озвучиваю ячейку: ${cell}`);
      
      // Пробуем различные варианты путей к файлам ячеек
      const possiblePaths = [
        `Ячейки/${cell}.mp3`,
        `ячейки/${cell}.mp3`,
        `Cells/${cell}.mp3`,
        `cells/${cell}.mp3`,
        `${cell}.mp3`
      ];

      for (const path of possiblePaths) {
        try {
          const audioUrl = await this.getDirectFileUrl(path);
          const audio = new Audio(audioUrl);
          audio.volume = 0.9;
          audio.crossOrigin = 'anonymous';
          
          await this.playAudioPromise(audio);
          console.log(`✅ Успешно озвучена ячейка: ${cell}`);
          return;
        } catch (err) {
          console.warn(`Попытка воспроизведения ${path} не удалась:`, err);
          continue;
        }
      }

      // Если файлы не найдены, используем синтез речи
      console.log(`🗣️ Файл ячейки ${cell} не найден, использую синтез речи`);
      await this.speakText(`Ячейка ${cell}`);

    } catch (error) {
      console.error('Критическая ошибка озвучки ячейки:', error);
      await this.speakText(`Ячейка ${cellNumber || this.getRandomCell()}`);
    }
  }

  // Озвучка скидок
  async playDiscountAudio(): Promise<void> {
    if (!this.isEnabled) return;
    
    await this.initialize();

    try {
      const filename = 'Товары со скидкой проверьте ВБ кошелек.mp3';
      
      // Пробуем из кеша
      let audio = this.audioCache.get(filename);
      
      if (!audio) {
        const audioUrl = await this.getDirectFileUrl(filename);
        audio = new Audio(audioUrl);
        audio.volume = 0.9;
        audio.crossOrigin = 'anonymous';
      }

      await this.playAudioPromise(audio);
      console.log('✅ Озвучены скидки из оригинального файла');
      
    } catch (error) {
      console.warn('Ошибка озвучки скидок, использую синтез:', error);
      await this.speakText('Товары со скидкой, проверьте ВБ кошелек');
    }
  }

  // Озвучка проверки под камерой
  async playCheckCameraAudio(): Promise<void> {
    if (!this.isEnabled) return;
    
    await this.initialize();

    try {
      const filename = 'Проверьте товар под камерой.mp3';
      
      let audio = this.audioCache.get(filename);
      
      if (!audio) {
        const audioUrl = await this.getDirectFileUrl(filename);
        audio = new Audio(audioUrl);
        audio.volume = 0.9;
        audio.crossOrigin = 'anonymous';
      }

      await this.playAudioPromise(audio);
      console.log('✅ Озвучена проверка камеры из оригинального файла');
      
    } catch (error) {
      console.warn('Ошибка озвучки проверки камеры, использую синтез:', error);
      await this.speakText('Проверьте товар под камерой');
    }
  }

  // Озвучка оценки ПВЗ
  async playRateUsAudio(): Promise<void> {
    if (!this.isEnabled) return;
    
    await this.initialize();

    try {
      const filename = 'Оцените наш пункт выдачи в приложении.mp3';
      
      let audio = this.audioCache.get(filename);
      
      if (!audio) {
        const audioUrl = await this.getDirectFileUrl(filename);
        audio = new Audio(audioUrl);
        audio.volume = 0.9;
        audio.crossOrigin = 'anonymous';
      }

      await this.playAudioPromise(audio);
      console.log('✅ Озвучена просьба оценить ПВЗ из оригинального файла');
      
    } catch (error) {
      console.warn('Ошибка озвучки оценки ПВЗ, использую синтез:', error);
      await this.speakText('Оцените наш пункт выдачи в приложении');
    }
  }

  // Дополнительные системные звуки
  async playSuccessSound(): Promise<void> {
    try {
      // Попробуем найти звук успеха в облаке
      const successFiles = ['success.mp3', 'ok.mp3', 'ready.mp3'];
      
      for (const filename of successFiles) {
        try {
          const audioUrl = await this.getDirectFileUrl(filename);
          const audio = new Audio(audioUrl);
          audio.volume = 0.5;
          await this.playAudioPromise(audio);
          return;
        } catch (err) {
          continue;
        }
      }
      
      // Fallback - короткий системный звук
      this.playSystemBeep(800, 200, 0.1);
    } catch (error) {
      console.warn('Не удалось воспроизвести звук успеха');
    }
  }

  async playErrorSound(): Promise<void> {
    try {
      // Попробуем найти звук ошибки в облаке
      const errorFiles = ['error.mp3', 'wrong.mp3', 'fail.mp3'];
      
      for (const filename of errorFiles) {
        try {
          const audioUrl = await this.getDirectFileUrl(filename);
          const audio = new Audio(audioUrl);
          audio.volume = 0.5;
          await this.playAudioPromise(audio);
          return;
        } catch (err) {
          continue;
        }
      }
      
      // Fallback - низкий звук ошибки
      this.playSystemBeep(300, 500, 0.2);
    } catch (error) {
      console.warn('Не удалось воспроизвести звук ошибки');
    }
  }

  // Вспомогательные методы
  private async playAudioPromise(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Audio timeout after 10 seconds'));
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        audio.onended = null;
        audio.onerror = null;
        audio.oncanplay = null;
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };

      audio.onerror = (error) => {
        cleanup();
        reject(new Error(`Audio playback failed: ${error}`));
      };

      // Попытка воспроизведения
      audio.play().catch((error) => {
        cleanup();
        reject(new Error(`Play method failed: ${error}`));
      });
    });
  }

  private async speakText(text: string): Promise<void> {
    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.85;
        utterance.volume = 0.8;
        utterance.pitch = 1.0;
        
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        
        speechSynthesis.speak(utterance);
        
        // Timeout fallback
        setTimeout(() => resolve(), 5000);
      });
    }
  }

  private playSystemBeep(frequency: number, duration: number, volume: number) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = volume;

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Не удалось воспроизвести системный звук');
    }
  }

  private getRandomCell(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 99) + 1;
    return `${letter}${number}`;
  }

  // Управление системой
  enable() {
    this.isEnabled = true;
    console.log('🔊 Озвучка включена');
  }

  disable() {
    this.isEnabled = false;
    console.log('🔇 Озвучка отключена');
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // Получение информации о системе
  getStatus(): object {
    return {
      enabled: this.isEnabled,
      initialized: this.isInitialized,
      cachedFiles: Array.from(this.audioCache.keys()),
      cloudUrl: this.mailRuPublicUrl
    };
  }
}

// Глобальный экземпляр системы озвучки
export const audioSystem = new WBAudioSystem();