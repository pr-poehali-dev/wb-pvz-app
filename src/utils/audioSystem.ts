// Расширенная система озвучки для WB ПВЗ с полным набором аудиофайлов
export class WBAudioSystem {
  private mailRuPublicUrl = 'https://cloud.mail.ru/public/WMiM/n1UTJ5fwe';
  private audioCache = new Map<string, HTMLAudioElement>();
  private isEnabled = true;
  private isInitialized = false;
  private availableFiles = new Set<string>();

  // Полный каталог аудиофайлов из облака Mail.ru
  private audioFiles = {
    // Основные файлы (известные)
    discount: 'Товары со скидкой проверьте ВБ кошелек.mp3',
    camera: 'Проверьте товар под камерой.mp3',
    rate: 'Оцените наш пункт выдачи в приложении.mp3',
    
    // Файлы входа и доступа  
    welcome: 'Добро пожаловать сканируйте QR код.mp3',
    scanPhone: 'Приложите телефон к считывателю.mp3',
    accessGranted: 'Доступ разрешен проходите.mp3',
    scanError: 'Ошибка сканирования повторите.mp3',
    enterCode: 'Введите код получения.mp3',
    codeCorrect: 'Код верный.mp3',
    codeIncorrect: 'Неверный код повторите ввод.mp3',
    
    // Операции с ячейками
    findCell: 'Найдите вашу ячейку номер.mp3',
    cellOpen: 'Ячейка открыта заберите товар.mp3',
    closeCell: 'Закройте ячейку после получения.mp3',
    timeLimit: 'Время на получение ограничено.mp3',
    cellBusy: 'Ячейка занята.mp3',
    cellError: 'Ошибка открытия ячейки.mp3',
    
    // Примерочная
    fittingFree: 'Примерочная свободна.mp3',
    fittingTime: 'Время примерки 5 минут.mp3',
    finishFitting: 'Завершите примерку.mp3',
    fittingBusy: 'Примерочная занята.mp3',
    
    // Возвраты
    returnStaff: 'Для возврата обратитесь к сотруднику.mp3',
    returnAccepted: 'Товар принят к возврату.mp3',
    packReturn: 'Упакуйте товар для возврата.mp3',
    returnComplete: 'Возврат оформлен.mp3',
    returnDenied: 'В возврате отказано.mp3',
    
    // Очереди
    waitTurn: 'Ожидайте своей очереди.mp3',
    nextCustomer: 'Следующий покупатель.mp3',
    makeRoom: 'Освободите место для других.mp3',
    queueFull: 'Очередь переполнена.mp3',
    
    // Технические проблемы
    techIssues: 'Технические неполадки обратитесь к персоналу.mp3',
    systemDown: 'Система временно недоступна.mp3',
    systemRestart: 'Перезагрузка системы.mp3',
    maintenance: 'Техническое обслуживание.mp3',
    
    // Безопасность и порядок
    dontForget: 'Не забудьте ваши вещи.mp3',
    videoSurveillance: 'Территория под видеонаблюдением.mp3',
    maintainOrder: 'Соблюдайте порядок.mp3',
    noSmoking: 'Курение запрещено.mp3',
    maskRequired: 'Наденьте маску.mp3',
    
    // Время работы
    closing: 'Пункт выдачи закрывается.mp3',
    tenMinutes: 'До закрытия осталось 10 минут.mp3',
    fiveMinutes: 'До закрытия осталось 5 минут.mp3',
    closed: 'Пункт выдачи закрыт.mp3',
    opening: 'Открытие через несколько минут.mp3',
    twentyFourSeven: 'Работаем круглосуточно.mp3',
    
    // Благодарности и приветствия
    thankYou: 'Спасибо за покупку.mp3',
    goodDay: 'Хорошего дня.mp3',
    comeAgain: 'Приходите еще.mp3',
    goodMorning: 'Доброе утро.mp3',
    goodEvening: 'Добрый вечер.mp3',
    
    // Системные уведомления
    attention: 'Внимание.mp3',
    urgent: 'Срочно.mp3',
    important: 'Важное объявление.mp3',
    newOrder: 'Поступил новый заказ.mp3',
    orderReady: 'Заказ готов к выдаче.mp3',
    
    // Дополнительные системные звуки
    success: 'success.mp3',
    error: 'error.mp3',
    notification: 'notification.mp3',
    beep: 'beep.mp3',
    chime: 'chime.mp3',
    alert: 'alert.mp3'
  };

  // Получение прямых ссылок на файлы из Mail.ru Cloud API
  private async getDirectFileUrl(filename: string): Promise<string> {
    try {
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
      
      return `${this.mailRuPublicUrl}/${filename}`;
    } catch (error) {
      console.warn(`Не удалось получить прямую ссылку для ${filename}:`, error);
      return `${this.mailRuPublicUrl}/${filename}`;
    }
  }

  // Инициализация и обнаружение доступных файлов
  async initialize() {
    if (this.isInitialized) return;

    console.log('🎵 Инициализация расширенной системы озвучки WB ПВЗ...');
    
    // Критически важные файлы для предзагрузки
    const criticalFiles = [
      this.audioFiles.discount,
      this.audioFiles.camera, 
      this.audioFiles.rate,
      this.audioFiles.welcome,
      this.audioFiles.accessGranted
    ];

    // Предзагружаем критические файлы
    for (const filename of criticalFiles) {
      try {
        const directUrl = await this.getDirectFileUrl(filename);
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.crossOrigin = 'anonymous';
        audio.src = directUrl;
        
        this.audioCache.set(filename, audio);
        this.availableFiles.add(filename);
        console.log(`✅ Критический файл загружен: ${filename}`);
      } catch (error) {
        console.warn(`⚠️ Не удалось предзагрузить: ${filename}`, error);
      }
    }

    // Асинхронно проверяем остальные файлы
    this.discoverAvailableFiles();

    this.isInitialized = true;
    console.log('✅ Расширенная система озвучки инициализирована');
  }

  // Автоматическое обнаружение доступных файлов
  private async discoverAvailableFiles() {
    console.log('🔍 Обнаружение дополнительных аудиофайлов...');
    
    const allFiles = Object.values(this.audioFiles);
    let foundCount = 0;

    for (const filename of allFiles) {
      if (this.availableFiles.has(filename)) continue; // Уже загружен
      
      try {
        const directUrl = await this.getDirectFileUrl(filename);
        const response = await fetch(directUrl, { 
          method: 'HEAD',
          mode: 'cors'
        });
        
        if (response.ok && response.headers.get('content-type')?.includes('audio')) {
          this.availableFiles.add(filename);
          foundCount++;
          console.log(`✅ Найден: ${filename}`);
        }
      } catch (error) {
        // Тихо игнорируем недоступные файлы
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`📊 Найдено дополнительных файлов: ${foundCount}`);
    console.log(`📈 Всего доступно: ${this.availableFiles.size} файлов`);
  }

  // Универсальный метод воспроизведения любого аудио
  private async playAudioByKey(key: string, fallbackText?: string): Promise<void> {
    if (!this.isEnabled) return;
    
    await this.initialize();

    const filename = this.audioFiles[key as keyof typeof this.audioFiles];
    if (!filename) {
      console.warn(`Неизвестный ключ аудио: ${key}`);
      return;
    }

    try {
      // Пробуем из кеша
      let audio = this.audioCache.get(filename);
      
      if (!audio && this.availableFiles.has(filename)) {
        const audioUrl = await this.getDirectFileUrl(filename);
        audio = new Audio(audioUrl);
        audio.volume = 0.9;
        audio.crossOrigin = 'anonymous';
        this.audioCache.set(filename, audio);
      }

      if (audio) {
        await this.playAudioPromise(audio);
        console.log(`✅ Озвучено: ${filename}`);
        return;
      }

      // Fallback на синтез речи
      if (fallbackText) {
        console.log(`🗣️ Файл ${filename} недоступен, использую синтез`);
        await this.speakText(fallbackText);
      }

    } catch (error) {
      console.warn(`Ошибка воспроизведения ${filename}:`, error);
      if (fallbackText) {
        await this.speakText(fallbackText);
      }
    }
  }

  // ОСНОВНЫЕ МЕТОДЫ ОЗВУЧКИ

  // Ячейки
  async playCellAudio(cellNumber?: string): Promise<void> {
    const cell = cellNumber || this.getRandomCell();
    
    // Пробуем файлы из папки Ячейки
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
        console.log(`✅ Озвучена ячейка: ${cell}`);
        return;
      } catch (err) {
        continue;
      }
    }

    // Fallback
    await this.speakText(`Ячейка ${cell}`);
  }

  // Скидки
  async playDiscountAudio(): Promise<void> {
    await this.playAudioByKey('discount', 'Товары со скидкой, проверьте ВБ кошелек');
  }

  // Проверка под камерой
  async playCheckCameraAudio(): Promise<void> {
    await this.playAudioByKey('camera', 'Проверьте товар под камерой');
  }

  // Оценка ПВЗ
  async playRateUsAudio(): Promise<void> {
    await this.playAudioByKey('rate', 'Оцените наш пункт выдачи в приложении');
  }

  // НОВЫЕ МЕТОДЫ ОЗВУЧКИ

  // Приветствие и вход
  async playWelcomeAudio(): Promise<void> {
    await this.playAudioByKey('welcome', 'Добро пожаловать, сканируйте QR код');
  }

  async playScanPhoneAudio(): Promise<void> {
    await this.playAudioByKey('scanPhone', 'Приложите телефон к считывателю');
  }

  async playAccessGrantedAudio(): Promise<void> {
    await this.playAudioByKey('accessGranted', 'Доступ разрешен, проходите');
  }

  async playScanErrorAudio(): Promise<void> {
    await this.playAudioByKey('scanError', 'Ошибка сканирования, повторите');
  }

  // Операции с ячейками
  async playFindCellAudio(): Promise<void> {
    await this.playAudioByKey('findCell', 'Найдите вашу ячейку номер');
  }

  async playCellOpenAudio(): Promise<void> {
    await this.playAudioByKey('cellOpen', 'Ячейка открыта, заберите товар');
  }

  async playCloseCellAudio(): Promise<void> {
    await this.playAudioByKey('closeCell', 'Закройте ячейку после получения');
  }

  async playTimeLimitAudio(): Promise<void> {
    await this.playAudioByKey('timeLimit', 'Время на получение ограничено');
  }

  // Примерочная
  async playFittingFreeAudio(): Promise<void> {
    await this.playAudioByKey('fittingFree', 'Примерочная свободна');
  }

  async playFittingTimeAudio(): Promise<void> {
    await this.playAudioByKey('fittingTime', 'Время примерки 5 минут');
  }

  async playFinishFittingAudio(): Promise<void> {
    await this.playAudioByKey('finishFitting', 'Завершите примерку');
  }

  // Возвраты
  async playReturnStaffAudio(): Promise<void> {
    await this.playAudioByKey('returnStaff', 'Для возврата обратитесь к сотруднику');
  }

  async playReturnAcceptedAudio(): Promise<void> {
    await this.playAudioByKey('returnAccepted', 'Товар принят к возврату');
  }

  async playPackReturnAudio(): Promise<void> {
    await this.playAudioByKey('packReturn', 'Упакуйте товар для возврата');
  }

  // Очереди
  async playWaitTurnAudio(): Promise<void> {
    await this.playAudioByKey('waitTurn', 'Ожидайте своей очереди');
  }

  async playNextCustomerAudio(): Promise<void> {
    await this.playAudioByKey('nextCustomer', 'Следующий покупатель');
  }

  // Технические проблемы
  async playTechIssuesAudio(): Promise<void> {
    await this.playAudioByKey('techIssues', 'Технические неполадки, обратитесь к персоналу');
  }

  async playSystemDownAudio(): Promise<void> {
    await this.playAudioByKey('systemDown', 'Система временно недоступна');
  }

  // Время работы
  async playClosingAudio(): Promise<void> {
    await this.playAudioByKey('closing', 'Пункт выдачи закрывается');
  }

  async playTenMinutesAudio(): Promise<void> {
    await this.playAudioByKey('tenMinutes', 'До закрытия осталось 10 минут');
  }

  // Благодарности
  async playThankYouAudio(): Promise<void> {
    await this.playAudioByKey('thankYou', 'Спасибо за покупку');
  }

  async playGoodDayAudio(): Promise<void> {
    await this.playAudioByKey('goodDay', 'Хорошего дня');
  }

  // Системные уведомления
  async playAttentionAudio(): Promise<void> {
    await this.playAudioByKey('attention', 'Внимание');
  }

  async playImportantAudio(): Promise<void> {
    await this.playAudioByKey('important', 'Важное объявление');
  }

  // Системные звуки
  async playSuccessSound(): Promise<void> {
    await this.playAudioByKey('success') || this.playSystemBeep(800, 200, 0.1);
  }

  async playErrorSound(): Promise<void> {
    await this.playAudioByKey('error') || this.playSystemBeep(300, 500, 0.2);
  }

  async playNotificationSound(): Promise<void> {
    await this.playAudioByKey('notification') || this.playSystemBeep(600, 150, 0.15);
  }

  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ

  private async playAudioPromise(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Audio timeout after 10 seconds'));
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        audio.onended = null;
        audio.onerror = null;
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };

      audio.onerror = () => {
        cleanup();
        reject(new Error('Audio playback failed'));
      };

      audio.play().catch(reject);
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

  // УПРАВЛЕНИЕ СИСТЕМОЙ

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

  // Получение статуса системы
  getStatus(): object {
    return {
      enabled: this.isEnabled,
      initialized: this.isInitialized,
      cachedFiles: Array.from(this.audioCache.keys()),
      availableFiles: Array.from(this.availableFiles),
      totalFiles: Object.keys(this.audioFiles).length,
      cloudUrl: this.mailRuPublicUrl
    };
  }

  // Получение списка всех методов озвучки
  getAvailableMethods(): string[] {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter(name => name.startsWith('play') && typeof this[name as keyof this] === 'function')
      .sort();
  }
}

// Глобальный экземпляр расширенной системы озвучки
export const audioSystem = new WBAudioSystem();