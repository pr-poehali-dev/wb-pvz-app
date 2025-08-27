import React, { useEffect, useState } from 'react';

const AudioSetup: React.FC = () => {
  const [audioStatus, setAudioStatus] = useState<'checking' | 'ready' | 'demo'>('checking');
  
  useEffect(() => {
    // Проверяем доступность аудио файлов
    const checkAudioFiles = async () => {
      try {
        // Пробуем загрузить один из основных файлов
        const testAudio = new Audio('/audio/добро-пожаловать.mp3');
        testAudio.volume = 0;
        await testAudio.play();
        setAudioStatus('ready');
      } catch (error) {
        setAudioStatus('demo');
      }
    };
    
    checkAudioFiles();
  }, []);

  if (audioStatus === 'checking') {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
        🔄 Проверка аудио системы...
      </div>
    );
  }

  if (audioStatus === 'demo') {
    return (
      <div className="fixed top-4 right-4 bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm max-w-sm">
        🔊 Используется синтез речи. 
        <br />
        <small>Добавьте файлы из облака для качественной озвучки</small>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
      ✅ Аудио файлы готовы
    </div>
  );
};

export default AudioSetup;