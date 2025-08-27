import { useCallback, useRef, useState } from 'react';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Web Speech API для озвучки
  const speak = useCallback((text: string, priority = false) => {
    if ('speechSynthesis' in window) {
      // Остановить текущую озвучку если это приоритетное сообщение
      if (priority) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        console.log('Ошибка озвучки, используем console.log:', text);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('ОЗВУЧКА:', text);
      // Визуальная обратная связь
      const toast = document.createElement('div');
      toast.textContent = `🔊 ${text}`;
      toast.className = 'fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  }, []);

  // Функция для воспроизведения аудиофайлов
  const playAudioFile = useCallback(async (audioType: 'cell' | 'discount' | 'camera' | 'rate', cellNumber?: number) => {
    try {
      // Определяем путь к аудиофайлу
      let audioPath = '';
      let fallbackText = '';
      
      switch (audioType) {
        case 'cell':
          audioPath = `/audio/cells/${cellNumber || 1}.mp3`;
          fallbackText = `Ячейка номер ${cellNumber || 1}`;
          break;
        case 'discount':
          audioPath = '/audio/discount.mp3';
          fallbackText = 'Товары со скидкой! Проверьте ВБ кошелёк!';
          break;
        case 'camera':
          audioPath = '/audio/camera.mp3';
          fallbackText = 'Проверьте товар под камерой!';
          break;
        case 'rate':
          audioPath = '/audio/rate.mp3';
          fallbackText = 'Оцените наш пункт выдачи в приложении ВБ!';
          break;
      }

      // Попытка воспроизвести аудиофайл
      if (audioRef.current) {
        audioRef.current.src = audioPath;
        audioRef.current.oncanplaythrough = () => {
          if (audioRef.current) {
            setIsSpeaking(true);
            audioRef.current.play().catch(() => {
              // Если не удалось воспроизвести файл, используем Web Speech API
              setIsSpeaking(false);
              speak(fallbackText, true);
            });
          }
        };
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
          // Если ошибка загрузки файла, используем Web Speech API
          setIsSpeaking(false);
          speak(fallbackText, true);
        };
        audioRef.current.load();
      } else {
        // Если нет ref, используем Web Speech API
        speak(fallbackText, true);
      }
    } catch (error) {
      // В случае любой ошибки используем Web Speech API
      console.error('Ошибка воспроизведения аудио:', error);
      speak(fallbackText, true);
    }
  }, [speak]);

  return {
    audioRef,
    isSpeaking,
    speak,
    playAudioFile
  };
};