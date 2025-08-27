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
      // Определяем ключ для localStorage
      let storageKey = '';
      
      switch (audioType) {
        case 'cell':
          storageKey = `audio_cells_${cellNumber || 1}`;
          break;
        case 'discount':
          storageKey = 'audio_discount';
          break;
        case 'camera':
          storageKey = 'audio_camera';
          break;
        case 'rate':
          storageKey = 'audio_rate';
          break;
      }

      // Проверяем, есть ли загруженный файл в localStorage
      const uploadedFile = localStorage.getItem(storageKey);
      if (!uploadedFile) {
        console.warn(`⚠️ Аудиофайл для "${audioType}" не загружен. Откройте "Настроить озвучку" и загрузите файлы.`);
        
        // Показываем уведомление пользователю
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: #f59e0b; color: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; font-family: system-ui; font-size: 14px; max-width: 300px;">
            <div style="font-weight: 600; margin-bottom: 4px;">🔊 Озвучка не найдена</div>
            <div>Загрузите аудиофайл для "${audioType}" в настройках</div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
        return;
      }

      console.log(`🎵 Воспроизводим загруженный файл: ${audioType}${cellNumber ? ` (ячейка ${cellNumber})` : ''}`);

      // Воспроизводим загруженный файл из localStorage
      if (audioRef.current) {
        // Устанавливаем src как data URL из localStorage
        audioRef.current.src = uploadedFile;
        
        const playPromise = audioRef.current.play();
        setIsSpeaking(true);

        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log(`✅ Успешно воспроизводим: ${audioType}`);
          }).catch((error) => {
            console.error(`❌ Ошибка воспроизведения ${audioType}:`, error);
            setIsSpeaking(false);
            
            // Показываем ошибку пользователю
            const errorNotification = document.createElement('div');
            errorNotification.innerHTML = `
              <div style="position: fixed; top: 20px; right: 20px; background: #dc2626; color: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; font-family: system-ui; font-size: 14px; max-width: 300px;">
                <div style="font-weight: 600; margin-bottom: 4px;">❌ Ошибка воспроизведения</div>
                <div>Переместите аудиофайл для "${audioType}"</div>
              </div>
            `;
            document.body.appendChild(errorNotification);
            setTimeout(() => document.body.removeChild(errorNotification), 3000);
          });
        }

        // Обработчики событий
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          console.log(`🎵 Завершено воспроизведение: ${audioType}`);
        };

        audioRef.current.onerror = (error) => {
          setIsSpeaking(false);
          console.error(`❌ Ошибка аудио элемента для ${audioType}:`, error);
        };
        
      } else {
        console.warn('❌ AudioRef недоступен. Перезагрузите страницу.');
      }
      
    } catch (error) {
      console.error('❌ Критическая ошибка воспроизведения:', error);
      setIsSpeaking(false);
    }
  }, []);

  return {
    audioRef,
    isSpeaking,
    speak,
    playAudioFile
  };
};