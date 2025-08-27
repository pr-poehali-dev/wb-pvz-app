class SimpleAudioSystem {
  private isEnabled = true;

  async speakText(text: string): Promise<void> {
    if (!this.isEnabled || !('speechSynthesis' in window)) return;
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Ошибка озвучки:', error);
    }
  }

  async playCellAudio(cellNumber: string): Promise<void> {
    await this.speakText(`Ячейка ${cellNumber}`);
  }

  async playDiscountAudio(): Promise<void> {
    await this.speakText('Товары со скидкой, проверьте ВБ кошелек');
  }

  async playCheckCameraAudio(): Promise<void> {
    await this.speakText('Проверьте товар под камерой');
  }

  async playRateUsAudio(): Promise<void> {
    await this.speakText('Оцените наш пункт выдачи в приложении');
  }

  async playSuccessSound(): Promise<void> {
    // Простой системный звук
    console.log('🔊 Успех!');
  }

  async playErrorSound(): Promise<void> {
    console.log('🔊 Ошибка!');
  }

  async playFindCellAudio(): Promise<void> {
    await this.speakText('Найдите вашу ячейку номер');
  }

  async playCellOpenAudio(): Promise<void> {
    await this.speakText('Ячейка открыта, заберите товар');
  }

  async playThankYouAudio(): Promise<void> {
    await this.speakText('Спасибо за покупку');
  }

  async playGoodDayAudio(): Promise<void> {
    await this.speakText('Хорошего дня');
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  initialize() {
    console.log('🎵 Простая система озвучки инициализирована');
  }
}

export const simpleAudio = new SimpleAudioSystem();