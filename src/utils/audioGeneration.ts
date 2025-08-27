// Утилиты для генерации демонстрационных аудио файлов
export const generateDemoAudio = (text: string, filename: string): Promise<void> => {
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        console.log(`Generated demo audio for: ${filename} - "${text}"`);
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};

// Список всех необходимых аудио файлов для ПВЗ
export const audioFilesList = {
  // Ячейки
  cells: [
    { filename: 'ячейки/А15.mp3', text: 'Ячейка А пятнадцать' },
    { filename: 'ячейки/А16.mp3', text: 'Ячейка А шестнадцать' },
    { filename: 'ячейки/А17.mp3', text: 'Ячейка А семнадцать' },
    { filename: 'ячейки/А18.mp3', text: 'Ячейка А восемнадцать' },
    { filename: 'ячейки/Б23.mp3', text: 'Ячейка Б двадцать три' },
    { filename: 'ячейки/Б24.mp3', text: 'Ячейка Б двадцать четыре' },
    { filename: 'ячейки/В07.mp3', text: 'Ячейка В ноль семь' },
    { filename: 'ячейки/В08.mp3', text: 'Ячейка В ноль восемь' },
  ],
  
  // Основные фразы
  main: [
    { filename: 'добро-пожаловать.mp3', text: 'Добро пожаловать в пункт выдачи Wildberries' },
    { filename: 'заказ-найден.mp3', text: 'Заказ найден' },
    { filename: 'товары-со-скидкой-проверьте-вб-кошелек.mp3', text: 'Товары со скидкой, проверьте ВБ кошелёк' },
    { filename: 'проверьте-документы.mp3', text: 'Проверьте документы клиента' },
    { filename: 'проверьте-товар-под-камерой.mp3', text: 'Проверьте товар под камерой' },
    { filename: 'оплата-прошла.mp3', text: 'Оплата успешно прошла' },
    { filename: 'оцените-наш-пункт-выдачи-в-приложении.mp3', text: 'Оцените наш пункт выдачи в приложении' },
    { filename: 'спасибо-за-покупку-хорошего-дня.mp3', text: 'Спасибо за покупку, хорошего дня!' },
  ]
};