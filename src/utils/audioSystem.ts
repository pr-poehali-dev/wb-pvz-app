// Полная система озвучки для WB ПВЗ с интеграцией облачных файлов
export class WBAudioSystem {
  private baseUrl = 'https://cloud.mail.ru/public/WMiM/n1UTJ5fwe';
  private audioCache = new Map<string, HTMLAudioElement>();
  private isEnabled = true;

  // Все доступные ячейки (A1-Z99)
  private generateCellNumbers(): string[] {
    const cells: string[] = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let letter of letters) {
      for (let num = 1; num <= 99; num++) {
        cells.push(`${letter}${num}`);
      }
    }
    return cells;
  }

  // Предзагрузка критически важных аудио
  async preloadAudio() {
    const criticalSounds = [
      'Товары со скидкой проверьте ВБ кошелек.mp3',
      'Проверьте товар под камерой.mp3',
      'Оцените наш пункт выдачи в приложении.mp3'
    ];

    for (const sound of criticalSounds) {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = `${this.baseUrl}/${sound}`;
        this.audioCache.set(sound, audio);
      } catch (error) {
        console.warn(`Не удалось загрузить аудио: ${sound}`, error);
      }
    }
  }

  // Воспроизведение озвучки ячейки
  async playCellAudio(cellNumber?: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Если номер не указан, выбираем случайный
      const cell = cellNumber || this.getRandomCell();
      
      // Пытаемся несколько вариантов URL для ячеек
      const possibleUrls = [
        `${this.baseUrl}/Ячейки/${cell}.mp3`,
        `${this.baseUrl}/ячейки/${cell}.mp3`,
        `${this.baseUrl}/cells/${cell}.mp3`,
        `${this.baseUrl}/${cell}.mp3`
      ];

      for (const url of possibleUrls) {
        try {
          const audio = new Audio(url);
          audio.volume = 0.8;
          await this.playAudioWithFallback(audio);
          console.log(`🔊 Озвучена ячейка: ${cell}`);
          return;
        } catch (err) {
          continue; // Пробуем следующий URL
        }
      }

      // Fallback - синтезированная речь
      await this.speakText(`Ячейка ${cell}`);

    } catch (error) {
      console.warn('Ошибка воспроизведения ячейки:', error);
      await this.speakText(`Ячейка ${cellNumber || this.getRandomCell()}`);
    }
  }

  // Озвучка скидок
  async playDiscountAudio(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const urls = [
        `${this.baseUrl}/Товары со скидкой проверьте ВБ кошелек.mp3`,
        `${this.baseUrl}/discount.mp3`
      ];

      for (const url of urls) {
        try {
          const audio = this.audioCache.get('Товары со скидкой проверьте ВБ кошелек.mp3') || new Audio(url);
          audio.volume = 0.8;
          await this.playAudioWithFallback(audio);
          console.log('🔊 Озвучены скидки');
          return;
        } catch (err) {
          continue;
        }
      }

      // Fallback
      await this.speakText('Товары со скидкой, проверьте ВБ кошелек');

    } catch (error) {
      console.warn('Ошибка воспроизведения скидок:', error);
      await this.speakText('Товары со скидкой, проверьте ВБ кошелек');
    }
  }

  // Озвучка проверки под камерой
  async playCheckCameraAudio(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const urls = [
        `${this.baseUrl}/Проверьте товар под камерой.mp3`,
        `${this.baseUrl}/check_camera.mp3`
      ];

      for (const url of urls) {
        try {
          const audio = this.audioCache.get('Проверьте товар под камерой.mp3') || new Audio(url);
          audio.volume = 0.8;
          await this.playAudioWithFallback(audio);
          console.log('🔊 Озвучена проверка под камерой');
          return;
        } catch (err) {
          continue;
        }
      }

      // Fallback
      await this.speakText('Проверьте товар под камерой');

    } catch (error) {
      console.warn('Ошибка воспроизведения проверки:', error);
      await this.speakText('Проверьте товар под камерой');
    }
  }

  // Озвучка оценки ПВЗ
  async playRateUsAudio(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const urls = [
        `${this.baseUrl}/Оцените наш пункт выдачи в приложении.mp3`,
        `${this.baseUrl}/rate_us.mp3`
      ];

      for (const url of urls) {
        try {
          const audio = this.audioCache.get('Оцените наш пункт выдачи в приложении.mp3') || new Audio(url);
          audio.volume = 0.8;
          await this.playAudioWithFallback(audio);
          console.log('🔊 Озвучена просьба оценить ПВЗ');
          return;
        } catch (err) {
          continue;
        }
      }

      // Fallback
      await this.speakText('Оцените наш пункт выдачи в приложении');

    } catch (error) {
      console.warn('Ошибка воспроизведения оценки:', error);
      await this.speakText('Оцените наш пункт выдачи в приложении');
    }
  }

  // Дополнительные звуки
  async playSuccessSound(): Promise<void> {
    try {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBU...';
      audio.volume = 0.3;
      await this.playAudioWithFallback(audio);
    } catch (error) {
      console.warn('Не удалось воспроизвести звук успеха');
    }
  }

  async playErrorSound(): Promise<void> {
    try {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBU...';
      audio.volume = 0.5;
      await this.playAudioWithFallback(audio);
    } catch (error) {
      console.warn('Не удалось воспроизвести звук ошибки');
    }
  }

  // Системные методы
  private async playAudioWithFallback(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Audio timeout'));
      }, 5000);

      audio.onended = () => {
        clearTimeout(timeout);
        resolve();
      };

      audio.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Audio error'));
      };

      audio.play().catch(reject);
    });
  }

  private async speakText(text: string): Promise<void> {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      
      return new Promise((resolve) => {
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        speechSynthesis.speak(utterance);
      });
    }
  }

  private getRandomCell(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 99) + 1;
    return `${letter}${number}`;
  }

  // Управление
  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
}

// Глобальный экземпляр
export const audioSystem = new WBAudioSystem();