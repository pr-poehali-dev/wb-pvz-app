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
      // Сначала проверяем, есть ли загруженный файл в localStorage
      let audioPath = '';
      let storageKey = '';
      
      switch (audioType) {
        case 'cell':
          storageKey = `audio_cells_${cellNumber || 1}`;
          audioPath = `/audio/cells/${cellNumber || 1}.mp3`;
          break;
        case 'discount':
          storageKey = 'audio_discount';
          audioPath = '/audio/discount.mp3';
          break;
        case 'camera':
          storageKey = 'audio_camera';
          audioPath = '/audio/camera.mp3';
          break;
        case 'rate':
          storageKey = 'audio_rate';
          audioPath = '/audio/rate.mp3';
          break;
      }

      // Проверяем, есть ли загруженный файл
      const uploadedFile = localStorage.getItem(storageKey);
      if (uploadedFile) {
        // Используем загруженный файл
        audioPath = uploadedFile;
        console.log(`🎵 Воспроизводим загруженный файл для ${audioType}`);
      } else {
        console.warn(`⚠️ Файл для ${audioType} не загружен. Используйте "Настроить озвучку"`);
        return;
      }

      // Попытка воспроизвести аудиофайл
      if (audioRef.current) {
        audioRef.current.src = audioPath;
        audioRef.current.oncanplaythrough = () => {
          if (audioRef.current) {
            setIsSpeaking(true);
            audioRef.current.play().catch(() => {
              setIsSpeaking(false);
              console.warn(`Не удалось воспроизвести ${audioPath}. Загрузите оригинальные аудиофайлы через "Настроить озвучку"`);
            });
          }
        };
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
          setIsSpeaking(false);
          console.warn(`Аудиофайл ${audioPath} не найден. Загрузите оригинальные файлы через "Настроить озвучку"`);
        };
        audioRef.current.load();
      } else {
        console.warn('AudioRef недоступен. Проверьте настройки аудио.');
      }
    } catch (error) {
      console.error('Ошибка воспроизведения аудио:', error);
      console.warn('Загрузите оригинальные аудиофайлы через "Настроить озвучку"');
    }
  }, [speak]);

  return {
    audioRef,
    isSpeaking,
    speak,
    playAudioFile
  };
};